export const FinancialTransactionMessage = {
  id: {
    required: 'ID Financial Transaction is required',
  },
  bankAccountId: {
    required: 'ID Bank Account is required',
  },
  title: {
    required: 'Title is required',
    rangeCharacters: 'The Title must be between 3 and 55 characters',
  },
  value: {
    required: 'Value is required',
    mustBePositive: 'The value must be greater than 0 (zero)',
  },
  situation: {
    required: 'Situation is required',
    enumInvalid: 'Type must be Expense or Income'
  },
  senderRecipient: {
    required: 'Sender/Recipient is required',
  },
  type: {
    required: 'Type is required',
    enumInvalid: 'Type must be Expense or Income'
  },
  typeOccurrence: {
    required: 'Type Occurrence is required',
    enumInvalid: 'Type Occurrence must be Single or Programmatic',
  },
  timesToRepeat: {
    required: 'Times to Repeat is required',
    mustBePositive: 'The number of Times to Repeat must be greater than 0 (zero)',
  },
  frequency: {
    enumInvalid: 'The frequency of the occurrence must be one of the types: Daily, Weekly, Monthly, Quarterly, Semiannually or Annually',
  },
} as const