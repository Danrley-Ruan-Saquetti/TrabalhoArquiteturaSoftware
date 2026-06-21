import { UserCreatedTemplate, UserCreatedTemplateVariables } from '@domain/templates/mail/user-created.template'
import { UserLoggedInTemplate, UserLoggedInTemplateVariables } from '@domain/templates/mail/user-logged-in.template'
import { BankAccountCreatedTemplate, BankAccountCreatedTemplateVariables } from '@domain/templates/mail/bank-account-created.template'
import { BankAccountLoggedInTemplate, BankAccountLoggedInTemplateVariables } from '@domain/templates/mail/bank-account-logged-in.template'

export namespace Templates {
  export type Variables = {
    'mail/user-logged-in': UserLoggedInTemplateVariables,
    'mail/bank-account-logged-in': BankAccountLoggedInTemplateVariables,
    'mail/user-created': UserCreatedTemplateVariables,
    'mail/bank-account-created': BankAccountCreatedTemplateVariables,
  }

  export const Templates: Record<keyof Variables, string> = {
    'mail/user-logged-in': UserLoggedInTemplate,
    'mail/bank-account-logged-in': BankAccountLoggedInTemplate,
    'mail/user-created': UserCreatedTemplate,
    'mail/bank-account-created': BankAccountCreatedTemplate,
  }
}