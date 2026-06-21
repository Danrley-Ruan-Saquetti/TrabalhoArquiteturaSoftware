import { FinancialTransactionSituation } from '@domain/enums/financial-transaction.enum'
import { FinancialTransaction } from '@domain/entities/financial-transaction.entity'

export interface FinancialTransactionUpdateSituationEvent {
  'events.financial-transaction.update-situation': {
    financialTransaction: FinancialTransaction
    oldSituation: FinancialTransactionSituation
    newSituation: FinancialTransactionSituation
  }
}