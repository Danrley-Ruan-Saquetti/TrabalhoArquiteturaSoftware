import { FinancialTransactionRule } from '@domain/rules/financial-transaction.rule'
import { FinancialTransactionFrequency } from '@domain/enums/financial-transaction.enum'

export class CalculateFinancialTransactionFrequencyDate {

  constructor(
    private frequency: FinancialTransactionFrequency,
    private timesToRepeat = 1
  ) { }

  calculateDates() {
    const frequencyInDay = FinancialTransactionRule.frequencyInDays[this.frequency]

    console.log(this, frequencyInDay)
  }
}