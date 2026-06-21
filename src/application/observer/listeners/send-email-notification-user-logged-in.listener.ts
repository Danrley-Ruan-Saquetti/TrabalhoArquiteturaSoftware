import { Injectable } from '@nestjs/common'
import { AuthUserSignInEvent } from '@application/observer/events/auth/user/sign-in.event'
import { EmailNotificationCreateUseCase } from '@application/use-cases/email-notification/create.use-case'
import { Listener } from '@domain/adapters/observer/listener'
import { Templates } from '@domain/templates/templates'
import { TemplateGeneratorService } from '@domain/adapters/generator/template/template.service'
import { env } from '@shared/env'

@Injectable()
export class SendEmailNotificationUserLoggedInListener extends Listener<AuthUserSignInEvent['events.auth.user.sign-in']> {

  constructor(
    private readonly emailNotificationCreateUseCase: EmailNotificationCreateUseCase,
    private readonly templateGenerator: TemplateGeneratorService,
  ) {
    super()
  }

  async perform(data: AuthUserSignInEvent['events.auth.user.sign-in']) {
    const template = Templates.Templates['mail/user-logged-in']

    const mailContent = this.templateGenerator.generate(template)

    await this.emailNotificationCreateUseCase.perform({
      sender: env('APP_MAIL'),
      recipients: [data.user.login],
      subject: 'New login in your account',
      body: mailContent
    })
  }
}