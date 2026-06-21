import { Module, Provider } from '@nestjs/common'
import { BankAccountQueryUseCase } from '@application/use-cases/bank-account/query.use-case'
import { BankAccountCreateUseCase } from '@application/use-cases/bank-account/create.use-case'
import { BankAccountUpdateUseCase } from '@application/use-cases/bank-account/update.use-case'
import { BankAccountFindUseCase } from '@application/use-cases/bank-account/find.use-case'
import { BankAccountInactivateUseCase } from '@application/use-cases/bank-account/inactivate.use-case'
import { BankAccountGenerateCodeUseCase } from '@application/use-cases/bank-account/generate-code.use-case'
import { BankAccountUpdateBalanceUseCase } from '@application/use-cases/bank-account/update-balance.use-case'
import { InfrastructureObserverModule } from '@infrastructure/adapters/observer/observer.module'
import { InfrastructureValidatorModule } from '@infrastructure/adapters/validator/validator.module'
import { InfrastructureRepositoryModule } from '@infrastructure/repositories/repository.module'
import { InfrastructureGeneratorCodeModule } from '@infrastructure/adapters/generator/code/code.module'

const providers: Provider[] = [
  BankAccountCreateUseCase,
  BankAccountGenerateCodeUseCase,
  BankAccountQueryUseCase,
  BankAccountUpdateBalanceUseCase,
  BankAccountUpdateUseCase,
  BankAccountFindUseCase,
  BankAccountInactivateUseCase,
]

@Module({
  imports: [
    InfrastructureValidatorModule,
    InfrastructureRepositoryModule,
    InfrastructureGeneratorCodeModule,
    InfrastructureObserverModule,
  ],
  providers: [...providers],
  exports: [...providers]
})
export class BankAccountUseCaseModule { }