import { FinancialTransactionRule } from '@domain/rules/financial-transaction.rule'
import { FinancialTransactionSituation } from '@domain/enums/financial-transaction.enum'

export function isTransactionClosed(situation: FinancialTransactionSituation) {
  return FinancialTransactionRule.closedSituations.includes(situation)
}