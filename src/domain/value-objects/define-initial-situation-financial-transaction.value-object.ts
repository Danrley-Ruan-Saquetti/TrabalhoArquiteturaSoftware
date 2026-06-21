import { FinancialTransactionSituation } from '@domain/enums/financial-transaction.enum'

export class DefineInitialSituationFinancialTransactionValueObject {

  constructor(
    private readonly financialTransaction: { expiresIn?: Date | null }
  ) { }

  getSituation(): FinancialTransactionSituation {
    if (this.financialTransaction.expiresIn && this.financialTransaction.expiresIn < new Date(Date.now())) {
      return FinancialTransactionSituation.LATED
    }

    return FinancialTransactionSituation.PENDING
  }
}