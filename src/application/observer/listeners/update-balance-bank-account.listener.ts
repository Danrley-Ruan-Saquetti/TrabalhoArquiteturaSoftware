import { Injectable } from '@nestjs/common'
import { BankAccountUpdateBalanceUseCase } from '@application/use-cases/bank-account/update-balance.use-case'
import { FinancialTransactionUpdateSituationEvent } from '@application/observer/events/financial-transaction/update-situation.event'
import { Listener } from '@domain/adapters/observer/listener'
import { FinancialTransactionSituation, FinancialTransactionType } from '@domain/enums/financial-transaction.enum'

@Injectable()
export class UpdateBalanceBankAccountListener extends Listener<FinancialTransactionUpdateSituationEvent['events.financial-transaction.update-situation']> {

  constructor(
    private readonly bankAccountUpdateBalance: BankAccountUpdateBalanceUseCase
  ) {
    super()
  }

  async perform(data: FinancialTransactionUpdateSituationEvent['events.financial-transaction.update-situation']) {
    const type = this.getTypeUpdate(data)

    if (!type) {
      return
    }

    await this.bankAccountUpdateBalance.perform({
      type,
      value: data.financialTransaction.value,
      bankAccountId: data.financialTransaction.bankAccountId,
    })
  }

  private getTypeUpdate({ financialTransaction, newSituation, oldSituation }: FinancialTransactionUpdateSituationEvent['events.financial-transaction.update-situation']) {
    if (oldSituation == newSituation) {
      return null
    }

    if (newSituation == FinancialTransactionSituation.COMPLETED) {
      return financialTransaction.type == FinancialTransactionType.INCOME ? 'IN' : 'OUT'
    }

    if (oldSituation == FinancialTransactionSituation.COMPLETED && newSituation == FinancialTransactionSituation.CANCELED) {
      return financialTransaction.type == FinancialTransactionType.INCOME ? 'OUT' : 'IN'
    }

    return null
  }
}