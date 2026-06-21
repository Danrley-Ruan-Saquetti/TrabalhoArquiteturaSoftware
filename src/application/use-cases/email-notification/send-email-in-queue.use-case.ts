import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { EmailNotificationSendEmailEvent } from '@application/observer/events/email-notification/send-email.event'
import { EmailNotificationSendEmailInQueueDTO, emailNotificationSendEmailInQueueSchema } from '@application/dto/email-notification/send-email-in-queue.dto'
import { MailService } from '@domain/adapters/mail/mail.service'
import { EmailNotification } from '@domain/entities/email-notification.entity'
import { ParallelismService } from '@domain/adapters/concurrency/parallelism.service'
import { NotificationSituation } from '@domain/enums/notification.enum'
import { EmailNotificationRepository } from '@domain/repositories/email-notification.repository'

@Injectable()
export class EmailNotificationSendEmailInQueueUseCase extends UseCase<EmailNotificationSendEmailEvent> {

  constructor(
    private readonly emailNotificationRepository: EmailNotificationRepository,
    private readonly mailService: MailService,
    private readonly parallelismService: ParallelismService
  ) {
    super()
  }

  async perform(args: EmailNotificationSendEmailInQueueDTO) {
    const { limit } = this.validator.validate(emailNotificationSendEmailInQueueSchema, args)

    const notificationInQueue = await this.getEmailNotificationsInQueue(limit)

    this.parallelismService.setLimit(Math.min(notificationInQueue.length, 8))

    notificationInQueue.map(notification =>
      this.parallelismService.registerHandler(() => this.resolveSendEmailNotification(notification))
    )

    await this.parallelismService.run()
  }

  private async getEmailNotificationsInQueue(limit?: number) {
    return await this.emailNotificationRepository.findMany({
      where: { notification: { situation: NotificationSituation.IN_QUEUE } },
      orderBy: { id: 'asc' },
      take: limit
    })
  }

  private async resolveSendEmailNotification(emailNotification: EmailNotification) {
    try {
      await this.sendEmail(emailNotification)
      await this.updateStateSuccessSendNotification(emailNotification)

      await this.observer.notify('events.email-notification.send.success', { emailNotification: emailNotification })
    } catch (error: any) {
      await this.updateStateErrorSendNotification(emailNotification)

      await this.observer.notify('events.email-notification.send.error', { emailNotification: emailNotification, error })
    } finally {
      await this.emailNotificationRepository.update(emailNotification.id, emailNotification)
    }
  }

  private async sendEmail({ sender, recipient, body, subject }: EmailNotification) {
    await this.mailService.send({ from: sender, to: recipient, subject, body })
  }

  private async updateStateErrorSendNotification(emailNotification: EmailNotification) {
    emailNotification.situation = NotificationSituation.ERROR

    return emailNotification
  }

  private async updateStateSuccessSendNotification(emailNotification: EmailNotification) {
    emailNotification.situation = NotificationSituation.SENT
    emailNotification.sendAt = new Date(Date.now())

    return emailNotification
  }
}