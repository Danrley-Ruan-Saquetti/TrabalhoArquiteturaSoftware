import { FinancialTransactionSituation } from '@domain/enums/financial-transaction.enum'
import { FinancialTransactionSituationState } from '@domain/states/financial-transaction/situation/situation.state'

export class FinancialTransactionPendingState extends FinancialTransactionSituationState {

  pending() { }

  conclude() {
    this.financialTransaction.situation = FinancialTransactionSituation.COMPLETED
  }

  late() {
    this.financialTransaction.situation = FinancialTransactionSituation.LATED
  }

  cancel() {
    this.financialTransaction.situation = FinancialTransactionSituation.CANCELED
  }
}