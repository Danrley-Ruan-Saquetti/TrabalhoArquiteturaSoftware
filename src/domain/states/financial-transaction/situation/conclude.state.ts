import { InvalidStateException } from '@domain/exceptions/invalid-state.exception'
import { FinancialTransactionSituation } from '@domain/enums/financial-transaction.enum'
import { FinancialTransactionSituationState } from '@domain/states/financial-transaction/situation/situation.state'

export class FinancialTransactionConcludeState extends FinancialTransactionSituationState {

  pending() {
    throw new InvalidStateException('It is not possible to make a Financial Transaction that is already completed as delayed')
  }

  conclude() { }

  late() {
    throw new InvalidStateException('It is not possible to delay a Financial Transaction that is already completed')
  }

  cancel() {
    this.financialTransaction.situation = FinancialTransactionSituation.CANCELED
  }
}