import { FinancialTransaction } from '@domain/entities/financial-transaction.entity'

export interface IFinancialTransactionSituationState {
  pending(): void
  conclude(): void
  late(): void
  cancel(): void
}

export abstract class FinancialTransactionSituationState implements IFinancialTransactionSituationState {

  constructor(
    protected financialTransaction: FinancialTransaction
  ) { }

  abstract pending(): void
  abstract conclude(): void
  abstract late(): void
  abstract cancel(): void
}