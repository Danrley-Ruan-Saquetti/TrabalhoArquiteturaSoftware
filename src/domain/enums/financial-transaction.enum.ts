export enum FinancialTransactionSituation {
  PENDING = 'PE',
  COMPLETED = 'CL',
  LATED = 'LT',
  CANCELED = 'CN',
}

export enum FinancialTransactionType {
  EXPENSE = 'E',
  INCOME = 'I',
}

export enum FinancialTransactionFrequency {
  DAILY = 'D',
  WEEKLY = 'W',
  MONTHLY = 'M',
  QUARTERLY = 'Q',
  SEMIANNUALLY = 'S',
  ANNUALLY = 'A',
}

export enum FinancialTransactionTypeOccurrence {
  SINGLE = 'S',
  PROGRAMMATIC = 'P',
}