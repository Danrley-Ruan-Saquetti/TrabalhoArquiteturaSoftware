export type MailSendOptions = {
  from: string
  to: string[]
  subject: string
  body: string
}

export abstract class MailService {

  abstract send(args: MailSendOptions): Promise<void>
}