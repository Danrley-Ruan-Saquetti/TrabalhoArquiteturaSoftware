import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, Scope } from '@nestjs/common'
import { SendMailException } from '@infrastructure/adapters/mail/mail.exception'
import { MailService, MailSendOptions } from '@domain/adapters/mail/mail.service'

@Injectable({ scope: Scope.REQUEST })
export class MailServiceImplementation extends MailService {

  constructor(
    private readonly mailerService: MailerService
  ) {
    super()
  }

  async send({ from, to, subject, body }: MailSendOptions) {
    try {
      await this.mailerService.sendMail({
        from,
        to,
        subject,
        html: body,
      })
    } catch (error: any) {
      throw new SendMailException(error.message || 'Error')
    }
  }
}