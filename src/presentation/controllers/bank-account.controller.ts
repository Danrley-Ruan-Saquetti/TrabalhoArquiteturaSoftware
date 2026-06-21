import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common'
import { User } from '@presentation/decorators/user.decorator'
import { UserSession } from '@presentation/types/user-session.type'
import { AuthUserGuard } from '@presentation/guards/auth-user.guard'
import { BankAccountSession } from '@presentation/types/bank-account-session.type'
import { AuthBankAccountGuard } from '@presentation/guards/auth-bank-account.guard'
import { BankAccountFindUseCase } from '@application/use-cases/bank-account/find.use-case'
import { BankAccountQueryUseCase } from '@application/use-cases/bank-account/query.use-case'
import { BankAccountUpdateUseCase } from '@application/use-cases/bank-account/update.use-case'
import { BankAccountCreateUseCase } from '@application/use-cases/bank-account/create.use-case'
import { BankAccountInactivateUseCase } from '@application/use-cases/bank-account/inactivate.use-case'
import { SendEmailNotificationBankAccountCreatedListener } from '@application/observer/listeners/send-email-notification-bank-account-created.listener'
import { BankAccount } from '@presentation/decorators/bank-account.decorator'

@Controller('/bank-accounts')
export class BankAccountController {

  constructor(
    private readonly bankAccountCreateUseCase: BankAccountCreateUseCase,
    private readonly bankAccountUpdateUseCase: BankAccountUpdateUseCase,
    private readonly bankAccountQueryUseCase: BankAccountQueryUseCase,
    private readonly bankAccountFindUseCase: BankAccountFindUseCase,
    private readonly bankAccountInactivateUseCase: BankAccountInactivateUseCase,
    private readonly sendEmailNotificationBankAccountCreatedListener: SendEmailNotificationBankAccountCreatedListener,
  ) { }

  @UseGuards(AuthUserGuard)
  @Get('')
  async query(@Query() query: any, @User() user: UserSession) {
    const { bankAccounts, metadata } = await this.bankAccountQueryUseCase.perform({ ...query, peopleId: user.peopleId })

    return {
      bankAccounts: bankAccounts.map(bankAccount => ({
        id: bankAccount.id,
        name: bankAccount.name,
        code: bankAccount.code,
        active: bankAccount.active,
        createdAt: bankAccount.createdAt,
        updatedAt: bankAccount.updatedAt,
      })),
      metadata
    }
  }

  @UseGuards(AuthUserGuard)
  @UseGuards(AuthBankAccountGuard)
  @Get('/current')
  async find(@BankAccount() bankAccountSession: BankAccountSession) {
    const { bankAccount } = await this.bankAccountFindUseCase.perform({ id: bankAccountSession.id })

    return { bankAccount }
  }

  @UseGuards(AuthUserGuard)
  @Post('/create')
  async create(@Body() body: any, @User() user: UserSession) {
    this.bankAccountCreateUseCase.observer.subscribe(
      'events.bank-account.created',
      this.sendEmailNotificationBankAccountCreatedListener
    )

    await this.bankAccountCreateUseCase.perform({ ...body, peopleId: user.peopleId })

    return { message: 'Bank Account successfully created' }
  }

  @UseGuards(AuthUserGuard)
  @UseGuards(AuthBankAccountGuard)
  @Post('/inactivate')
  async inactivate(@BankAccount() bankAccountSession: BankAccountSession) {
    await this.bankAccountInactivateUseCase.perform({ id: bankAccountSession.id })

    return { message: 'Bank Account successfully created' }
  }

  @UseGuards(AuthUserGuard)
  @UseGuards(AuthBankAccountGuard)
  @Put('/update')
  async update(@Body() body: any, @BankAccount() bankAccount: BankAccountSession) {
    await this.bankAccountUpdateUseCase.perform({ ...body, id: bankAccount.id })

    return { message: 'Bank Account successfully updated' }
  }
}