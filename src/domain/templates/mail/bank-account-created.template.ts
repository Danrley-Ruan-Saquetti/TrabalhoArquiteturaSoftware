export type BankAccountCreatedTemplateVariables = {
  name: string
  code: string
}

export const BankAccountCreatedTemplate = `
Hello {{name}}. New bank account registered for your user. Follow the bank account code {{code}}
`