import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { EmailNotificationCreateDTO, emailNotificationCreateSchema } from '@application/dto/email-notification/create.dto'
import { NotificationType } from '@domain/enums/notification.enum'
import { EmailNotification } from '@domain/entities/email-notification.entity'
import { EmailNotificationRepository } from '@domain/repositories/email-notification.repository'

@Injectable()
export class EmailNotificationCreateUseCase extends UseCase {

  constructor(
    private readonly emailNotificationRepository: EmailNotificationRepository
  ) {
    super()
  }

  async perform(args: EmailNotificationCreateDTO) {
    const { body, subject, sender, recipients } = this.validator.validate(emailNotificationCreateSchema, args)

    const emailNotification = new EmailNotification({
      body,
      subject,
      sender,
      recipient: recipients,
      type: NotificationType.EMAIL,
    })

    const emailNotificationCreated = await this.emailNotificationRepository.create(emailNotification)

    return { emailNotification: emailNotificationCreated }
  }
}