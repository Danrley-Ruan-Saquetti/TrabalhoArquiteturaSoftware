import { Module } from '@nestjs/common'
import { UserController } from '@presentation/controllers/user.controller'
import { AuthUserController } from '@presentation/controllers/auth-user.controller'
import { PeopleController } from '@presentation/controllers/people.controller'
import { ListenerModule } from '@application/observer/listeners/listener.module'
import { UserUseCaseModule } from '@application/use-cases/user/use-case.module'
import { AuthUseCaseModule } from '@application/use-cases/auth/use-case.module'
import { PeopleUseCaseModule } from '@application/use-cases/people/use-case.module'
import { SharedUseCaseModule } from '@application/use-cases/shared/use-case.module'
import { EmailNotificationUseCaseModule } from '@application/use-cases/email-notification/use-case.module'

@Module({
  imports: [
    UserUseCaseModule,
    PeopleUseCaseModule,
    SharedUseCaseModule,
    AuthUseCaseModule,
    EmailNotificationUseCaseModule,
    ListenerModule,
  ],
  controllers: [
    PeopleController,
    UserController,
    AuthUserController,
  ]
})
export class ControllerModule { }
