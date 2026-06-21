export type UserCreatedTemplateVariables = {
  name: string
  code: string
}

export const UserCreatedTemplate = `
Hello {{name}}. Your code is {{code}}
`