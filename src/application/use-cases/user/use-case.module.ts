import { Module, Provider } from '@nestjs/common'
import { InfrastructureHashModule } from '@infrastructure/adapters/crypto/crypto.module'
import { InfrastructureObserverModule } from '@infrastructure/adapters/observer/observer.module'
import { InfrastructureValidatorModule } from '@infrastructure/adapters/validator/validator.module'
import { InfrastructureRepositoryModule } from '@infrastructure/repositories/repository.module'
import { InfrastructureGeneratorCodeModule } from '@infrastructure/adapters/generator/code/code.module'
import { UserFindUseCase } from '@application/use-cases/user/find.use-case'
import { UserCreateUseCase } from '@application/use-cases/user/create.use-case'
import { UserGenerateCodeUseCase } from '@application/use-cases/user/generate-code.use-case'

const providers: Provider[] = [
  UserCreateUseCase,
  UserGenerateCodeUseCase,
  UserFindUseCase,
]

@Module({
  imports: [
    InfrastructureValidatorModule,
    InfrastructureGeneratorCodeModule,
    InfrastructureRepositoryModule,
    InfrastructureHashModule,
    InfrastructureObserverModule,
  ],
  providers: [...providers],
  exports: [...providers]
})
export class UserUseCaseModule { }