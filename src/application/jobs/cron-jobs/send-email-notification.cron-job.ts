import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { CronJob } from '@application/jobs/cron-jobs/cron-job'
import { EmailNotificationSendEmailInQueueUseCase } from '@application/use-cases/email-notification/send-email-in-queue.use-case'

@Injectable()
export class SendEmailNotificationCronJob extends CronJob {

  constructor(
    private readonly emailNotificationSendEmailInQueueUseCase: EmailNotificationSendEmailInQueueUseCase
  ) {
    super()
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async sendEmailNotification() {
    this.emailNotificationSendEmailInQueueUseCase.observer.subscribe(
      'events.email-notification.send.error',
      async ({ error }) => await this.errorLogService.save({
        type: 'JOB',
        origin: 'cron-job.send-email-notification.send',
        message: error.message ?? 'Error',
        details: {
          ...error.details,
        }
      })
    )

    await this.emailNotificationSendEmailInQueueUseCase.perform({ limit: 100 })
  }
}