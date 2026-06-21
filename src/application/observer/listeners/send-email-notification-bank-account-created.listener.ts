import { Injectable } from '@nestjs/common'
import { BankAccountCreateEvent } from '@application/observer/events/bank-account/create.event'
import { EmailNotificationCreateUseCase } from '@application/use-cases/email-notification/create.use-case'
import { Listener } from '@domain/adapters/observer/listener'
import { Templates } from '@domain/templates/templates'
import { PeopleRepository } from '@domain/repositories/people.repository'
import { TemplateGeneratorService } from '@domain/adapters/generator/template/template.service'
import { env } from '@shared/env'

@Injectable()
export class SendEmailNotificationBankAccountCreatedListener extends Listener<BankAccountCreateEvent['events.bank-account.created']> {

  constructor(
    private readonly emailNotificationCreateUseCase: EmailNotificationCreateUseCase,
    private readonly templateGenerator: TemplateGeneratorService,
    private readonly peopleRepository: PeopleRepository,
  ) {
    super()
  }

  async perform(data: BankAccountCreateEvent['events.bank-account.created']) {
    const people = await this.peopleRepository.findById(data.user.peopleId)

    const template = Templates.Templates['mail/bank-account-created']
    const variablesTemplate: Templates.Variables['mail/bank-account-created'] = {
      name: people?.name || '(empty)',
      code: data.user.code,
    }

    const mailContent = this.templateGenerator.generate(template, variablesTemplate)

    await this.emailNotificationCreateUseCase.perform({
      sender: env('APP_MAIL'),
      recipients: [data.user.login],
      subject: 'New Bank Account registered!',
      body: mailContent
    })
  }
}