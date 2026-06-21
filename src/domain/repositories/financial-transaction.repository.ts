import { FilterSchema } from '@domain/adapters/database/filters'
import { BankAccountFilterArgs } from '@domain/repositories/bank-account.repository'
import { QuerySchema, UpdateSchema } from '@domain/adapters/database/operations'
import { FinancialTransaction, FinancialTransactionProps } from '@domain/entities/financial-transaction.entity'

export interface FinancialTransactionFilterArgs extends Omit<FinancialTransactionProps, 'settings' | 'type' | 'situation'> {
  settings: 'json'
  type: 'enum'
  situation: 'enum'
  bankAccount: BankAccountFilterArgs
}

export type FinancialTransactionFilter = FilterSchema<FinancialTransactionFilterArgs>
export type FinancialTransactionQueryArgs = QuerySchema<FinancialTransactionFilterArgs>
export type FinancialTransactionUpdateArgs = UpdateSchema<FinancialTransactionFilterArgs, FinancialTransactionProps>

export abstract class FinancialTransactionRepository {

  abstract create(financialTransaction: FinancialTransaction): Promise<FinancialTransaction>
  abstract update(id: number, financialTransaction: FinancialTransaction): Promise<FinancialTransaction>
  abstract updateMany(args: FinancialTransactionUpdateArgs): Promise<void>
  abstract delete(id: number): Promise<void>
  abstract findById(id: number): Promise<FinancialTransaction | null>
  abstract findMany(args?: FinancialTransactionQueryArgs): Promise<FinancialTransaction[]>
  abstract count(args?: Pick<FinancialTransactionQueryArgs, 'where'>): Promise<number>
}