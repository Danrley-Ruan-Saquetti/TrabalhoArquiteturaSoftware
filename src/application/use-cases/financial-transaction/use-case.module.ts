import { Module, Provider } from '@nestjs/common'
import { FinancialTransactionFindUseCase } from '@application/use-cases/financial-transaction/find.use-case'
import { FinancialTransactionQueryUseCase } from '@application/use-cases/financial-transaction/query.use-case'
import { FinancialTransactionCancelUseCase } from '@application/use-cases/financial-transaction/cancel.use-case'
import { FinancialTransactionUpdateUseCase } from '@application/use-cases/financial-transaction/update.use-case'
import { FinancialTransactionCreateUseCase } from '@application/use-cases/financial-transaction/create.use-case'
import { FinancialTransactionDeleteUseCase } from '@application/use-cases/financial-transaction/delete.use-case'
import { FinancialTransactionConcludeUseCase } from '@application/use-cases/financial-transaction/conclude.use-case'
import { FinancialTransactionUpdateDelayedUseCase } from '@application/use-cases/financial-transaction/update-delayed.use-case'
import { InfrastructureObserverModule } from '@infrastructure/adapters/observer/observer.module'
import { InfrastructureValidatorModule } from '@infrastructure/adapters/validator/validator.module'
import { InfrastructureRepositoryModule } from '@infrastructure/repositories/repository.module'

const providers: Provider[] = [
  FinancialTransactionCreateUseCase,
  FinancialTransactionQueryUseCase,
  FinancialTransactionCancelUseCase,
  FinancialTransactionConcludeUseCase,
  FinancialTransactionUpdateUseCase,
  FinancialTransactionUpdateDelayedUseCase,
  FinancialTransactionDeleteUseCase,
  FinancialTransactionFindUseCase,
]

@Module({
  imports: [
    InfrastructureValidatorModule,
    InfrastructureRepositoryModule,
    InfrastructureObserverModule,
  ],
  providers: [...providers],
  exports: [...providers]
})
export class FinancialTransactionUseCaseModule { }