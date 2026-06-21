import { FinancialTransaction } from '@domain/entities/financial-transaction.entity'

export interface FinancialTransactionDeleteEvent {
  'events.financial-transaction.deleted': { financialTransaction: FinancialTransaction }
}