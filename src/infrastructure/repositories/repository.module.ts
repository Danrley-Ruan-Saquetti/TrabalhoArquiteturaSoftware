import { Module, Provider } from '@nestjs/common'
import { InfrastructureDatabaseModule } from '@infrastructure/adapters/database/database.module'
import { UserRepositoryImplementation } from '@infrastructure/repositories/user.repository'
import { PeopleRepositoryImplementation } from '@infrastructure/repositories/people.repository'
import { ErrorLogRepositoryImplementation } from '@infrastructure/repositories/error-log.repository'
import { NotificationRepositoryImplementation } from '@infrastructure/repositories/notification.repository'
import { EmailNotificationRepositoryImplementation } from '@infrastructure/repositories/email-notification.repository'
import { UserRepository } from '@domain/repositories/user.repository'
import { PeopleRepository } from '@domain/repositories/people.repository'
import { ErrorLogRepository } from '@domain/repositories/error-log.repository'
import { NotificationRepository } from '@domain/repositories/notification.repository'
import { EmailNotificationRepository } from '@domain/repositories/email-notification.repository'

const providers: Provider[] = [
  {
    provide: PeopleRepository,
    useClass: PeopleRepositoryImplementation
  },
  {
    provide: UserRepository,
    useClass: UserRepositoryImplementation
  },
  {
    provide: EmailNotificationRepository,
    useClass: EmailNotificationRepositoryImplementation
  },
  {
    provide: NotificationRepository,
    useClass: NotificationRepositoryImplementation
  },
  {
    provide: ErrorLogRepository,
    useClass: ErrorLogRepositoryImplementation
  },
] as const

@Module({
  imports: [
    InfrastructureDatabaseModule,
  ],
  providers: [...providers],
  exports: [...providers]
})
export class InfrastructureRepositoryModule { }
