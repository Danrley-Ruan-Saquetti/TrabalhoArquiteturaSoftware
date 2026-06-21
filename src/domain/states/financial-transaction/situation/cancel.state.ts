import { InvalidStateException } from '@domain/exceptions/invalid-state.exception'
import { FinancialTransactionSituationState } from '@domain/states/financial-transaction/situation/situation.state'

export class FinancialTransactionCancelState extends FinancialTransactionSituationState {

  pending() {
    throw new InvalidStateException('It is not possible to make a Financial Transaction that is already canceled as delayed')
  }

  conclude() {
    throw new InvalidStateException('It is not possible to conclude a Financial Transaction that is already canceled')
  }

  late() {
    throw new InvalidStateException('It is not possible to delay a Financial Transaction that is already canceled')
  }

  cancel() { }
}