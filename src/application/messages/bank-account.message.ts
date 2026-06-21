export const BankAccountMessage = {
  id: {
    required: 'ID Bank Account is required',
  },
  peopleId: {
    required: 'ID People is required',
  },
  name: {
    required: 'Name is required',
    rangeCharacters: 'The Name must be between 3 and 45 characters',
  },
  code: {
    required: 'Code is required',
  },
} as const