import { Module, Provider } from '@nestjs/common'
import { InfrastructureJWTModule } from '@infrastructure/adapters/jwt/jwt.module'
import { InfrastructureHashModule } from '@infrastructure/adapters/crypto/crypto.module'
import { InfrastructureObserverModule } from '@infrastructure/adapters/observer/observer.module'
import { InfrastructureValidatorModule } from '@infrastructure/adapters/validator/validator.module'
import { InfrastructureRepositoryModule } from '@infrastructure/repositories/repository.module'
import { ConsumerModule } from '@application/jobs/queues/consumer.module'
import { AuthUserSignInUseCase } from '@application/use-cases/auth/user/sign-in.use-case'
import { AuthUserAuthorizationUseCase } from '@application/use-cases/auth/user/authorization.use-case'
import { AuthBankAccountSignInUseCase } from '@application/use-cases/auth/bank-account/sign-in.use-case'
import { AuthBankAccountAuthorizationUseCase } from '@application/use-cases/auth/bank-account/authorization.use-case'

const providers: Provider[] = [
  AuthUserSignInUseCase,
  AuthUserAuthorizationUseCase,
  AuthBankAccountAuthorizationUseCase,
  AuthBankAccountSignInUseCase,
]

@Module({
  imports: [
    InfrastructureValidatorModule,
    InfrastructureRepositoryModule,
    InfrastructureHashModule,
    InfrastructureJWTModule,
    InfrastructureObserverModule,
    ConsumerModule,
  ],
  providers: [...providers],
  exports: [...providers]
})
export class AuthUseCaseModule { }