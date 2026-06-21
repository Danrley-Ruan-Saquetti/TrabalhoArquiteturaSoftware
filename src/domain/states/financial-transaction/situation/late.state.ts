import { InvalidStateException } from '@domain/exceptions/invalid-state.exception'
import { FinancialTransactionSituation } from '@domain/enums/financial-transaction.enum'
import { FinancialTransactionSituationState } from '@domain/states/financial-transaction/situation/situation.state'

export class FinancialTransactionLateState extends FinancialTransactionSituationState {

  pending() {
    if (this.financialTransaction.expiresIn && this.financialTransaction.expiresIn < new Date(Date.now())) {
      throw new InvalidStateException('It is not possible to make a Financial Transaction that is overdue as pending')
    }

    this.financialTransaction.situation = FinancialTransactionSituation.PENDING
  }

  conclude() {
    this.financialTransaction.situation = FinancialTransactionSituation.COMPLETED
  }

  late() { }

  cancel() {
    this.financialTransaction.situation = FinancialTransactionSituation.CANCELED
  }
}