import { Injectable } from '@nestjs/common'
import { UserCreateEvent } from '@application/observer/events/user/create.event'
import { EmailNotificationCreateUseCase } from '@application/use-cases/email-notification/create.use-case'
import { Listener } from '@domain/adapters/observer/listener'
import { Templates } from '@domain/templates/templates'
import { TemplateGeneratorService } from '@domain/adapters/generator/template/template.service'
import { env } from '@shared/env'

@Injectable()
export class SendEmailNotificationUserCreatedListener extends Listener<UserCreateEvent['events.user.created']> {

  constructor(
    private readonly emailNotificationCreateUseCase: EmailNotificationCreateUseCase,
    private readonly templateGenerator: TemplateGeneratorService,
  ) {
    super()
  }

  async perform(data: UserCreateEvent['events.user.created']) {
    const template = Templates.Templates['mail/user-created']
    const variablesTemplate: Templates.Variables['mail/user-created'] = {
      name: data.people.name,
      code: data.user.code,
    }

    const mailContent = this.templateGenerator.generate(template, variablesTemplate)

    await this.emailNotificationCreateUseCase.perform({
      sender: env('APP_MAIL'),
      recipients: [data.user.login],
      subject: 'Welcome to Liph Bank!',
      body: mailContent
    })
  }
}