import { Module, Provider } from '@nestjs/common'
import { InfrastructureRepositoryModule } from '@infrastructure/repositories/repository.module'
import { InfrastructureGeneratorTemplateModule } from '@infrastructure/adapters/generator/template/template.module'
import { BankAccountUseCaseModule } from '@application/use-cases/bank-account/use-case.module'
import { EmailNotificationUseCaseModule } from '@application/use-cases/email-notification/use-case.module'
import { UpdateBalanceBankAccountListener } from '@application/observer/listeners/update-balance-bank-account.listener'
import { SendEmailNotificationUserCreatedListener } from '@application/observer/listeners/send-email-notification-user-created.listener'
import { SendEmailNotificationUserLoggedInListener } from '@application/observer/listeners/send-email-notification-user-logged-in.listener'
import { SendEmailNotificationBankAccountCreatedListener } from '@application/observer/listeners/send-email-notification-bank-account-created.listener'
import { SendEmailNotificationBankAccountLoggedInListener } from '@application/observer/listeners/send-email-notification-bank-account-logged-in.listener'

const providers: Provider[] = [
  SendEmailNotificationUserLoggedInListener,
  SendEmailNotificationUserCreatedListener,
  SendEmailNotificationBankAccountCreatedListener,
  SendEmailNotificationBankAccountLoggedInListener,
  UpdateBalanceBankAccountListener,
]

@Module({
  imports: [
    InfrastructureRepositoryModule,
    EmailNotificationUseCaseModule,
    BankAccountUseCaseModule,
    InfrastructureGeneratorTemplateModule,
  ],
  providers: [...providers],
  exports: [...providers],
})
export class ListenerModule { }