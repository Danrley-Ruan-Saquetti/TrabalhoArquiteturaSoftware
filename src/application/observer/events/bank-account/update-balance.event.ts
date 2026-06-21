import { BankAccount } from '@domain/entities/bank-account.entity'

export interface BankAccountUpdateBalanceEvent {
  'events.bank-account.balance-changed': { bankAccount: BankAccount, type: 'IN' | 'OUT', value: number }
}