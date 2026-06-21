import { Module, Provider } from '@nestjs/common'
import { InfrastructureMailModule } from '@infrastructure/adapters/mail/mail.module'
import { InfrastructureErrorLogModule } from '@infrastructure/adapters/error-log/error-log.module'
import { InfrastructureRepositoryModule } from '@infrastructure/repositories/repository.module'
import { SendEmailNotificationCronJob } from '@application/jobs/cron-jobs/send-email-notification.cron-job'
import { EmailNotificationUseCaseModule } from '@application/use-cases/email-notification/use-case.module'
import { FinancialTransactionUseCaseModule } from '@application/use-cases/financial-transaction/use-case.module'
import { UpdateSituationFinancialTransactionCronJob } from '@application/jobs/cron-jobs/update-situation-financial-transaction.cron-job'

const providers: Provider[] = [
  SendEmailNotificationCronJob,
  UpdateSituationFinancialTransactionCronJob,
]

@Module({
  imports: [
    InfrastructureMailModule,
    InfrastructureRepositoryModule,
    InfrastructureErrorLogModule,
    EmailNotificationUseCaseModule,
    FinancialTransactionUseCaseModule,
  ],
  providers: [...providers],
  exports: [...providers]
})
export class CronJobModule { }