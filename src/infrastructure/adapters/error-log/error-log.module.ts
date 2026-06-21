import { Module, Provider } from '@nestjs/common'
import { ErrorLogServiceImplementation } from '@infrastructure/adapters/error-log/error-log.service'
import { InfrastructureRepositoryModule } from '@infrastructure/repositories/repository.module'
import { ErrorLogService } from '@domain/adapters/error-log/error-log.service'

const providers: Provider[] = [
  {
    provide: ErrorLogService,
    useClass: ErrorLogServiceImplementation
  },
]

@Module({
  imports: [
    InfrastructureRepositoryModule
  ],
  providers: [...providers],
  exports: [...providers]
})
export class InfrastructureErrorLogModule { }