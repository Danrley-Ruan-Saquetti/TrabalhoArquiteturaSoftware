import { BankAccount } from '@domain/entities/bank-account.entity'

export interface BankAccountInactivateBalanceEvent {
  'events.bank-account.inactivated': { bankAccount: BankAccount }
}