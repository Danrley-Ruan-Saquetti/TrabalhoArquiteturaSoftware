import { Module, Provider } from '@nestjs/common'
import { InfrastructureRepositoryModule } from '@infrastructure/repositories/repository.module'
import { InfrastructureGeneratorTemplateModule } from '@infrastructure/adapters/generator/template/template.module'
import { EmailNotificationUseCaseModule } from '@application/use-cases/email-notification/use-case.module'
import { SendEmailNotificationUserCreatedListener } from '@application/observer/listeners/send-email-notification-user-created.listener'
import { SendEmailNotificationUserLoggedInListener } from '@application/observer/listeners/send-email-notification-user-logged-in.listener'

const providers: Provider[] = [
  SendEmailNotificationUserLoggedInListener,
  SendEmailNotificationUserCreatedListener,
]

@Module({
  imports: [
    InfrastructureRepositoryModule,
    EmailNotificationUseCaseModule,
    InfrastructureGeneratorTemplateModule,
  ],
  providers: [...providers],
  exports: [...providers],
})
export class ListenerModule { }
