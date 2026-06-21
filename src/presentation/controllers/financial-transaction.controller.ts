import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { BankAccount } from '@presentation/decorators/bank-account.decorator'
import { AuthUserGuard } from '@presentation/guards/auth-user.guard'
import { BankAccountSession } from '@presentation/types/bank-account-session.type'
import { AuthBankAccountGuard } from '@presentation/guards/auth-bank-account.guard'
import { FinancialTransactionFindUseCase } from '@application/use-cases/financial-transaction/find.use-case'
import { UpdateBalanceBankAccountListener } from '@application/observer/listeners/update-balance-bank-account.listener'
import { FinancialTransactionQueryUseCase } from '@application/use-cases/financial-transaction/query.use-case'
import { FinancialTransactionCancelUseCase } from '@application/use-cases/financial-transaction/cancel.use-case'
import { FinancialTransactionCreateUseCase } from '@application/use-cases/financial-transaction/create.use-case'
import { FinancialTransactionUpdateUseCase } from '@application/use-cases/financial-transaction/update.use-case'
import { FinancialTransactionDeleteUseCase } from '@application/use-cases/financial-transaction/delete.use-case'
import { FinancialTransactionConcludeUseCase } from '@application/use-cases/financial-transaction/conclude.use-case'

@Controller('/bank-accounts/financial-transactions')
export class FinancialTransactionController {

  constructor(
    private readonly financialTransactionCreateUseCase: FinancialTransactionCreateUseCase,
    private readonly financialTransactionQueryUseCase: FinancialTransactionQueryUseCase,
    private readonly financialTransactionFindUseCase: FinancialTransactionFindUseCase,
    private readonly financialTransactionConcludeUseCase: FinancialTransactionConcludeUseCase,
    private readonly financialTransactionCancelUseCase: FinancialTransactionCancelUseCase,
    private readonly financialTransactionUpdateUseCase: FinancialTransactionUpdateUseCase,
    private readonly financialTransactionDeleteUseCase: FinancialTransactionDeleteUseCase,
    private readonly updateBalanceBankAccountListener: UpdateBalanceBankAccountListener,
  ) { }

  @UseGuards(AuthUserGuard)
  @UseGuards(AuthBankAccountGuard)
  @Get('')
  async query(@Query() filters: any, @BankAccount() bankAccount: BankAccountSession) {
    const { financialTransactions, metadata } = await this.financialTransactionQueryUseCase.perform({ ...filters, bankAccountId: bankAccount.id })

    return { financialTransactions, metadata }
  }

  @UseGuards(AuthUserGuard)
  @UseGuards(AuthBankAccountGuard)
  @Get('/:id')
  async find(@BankAccount() bankAccount: BankAccountSession, @Param('id') id: number) {
    const { financialTransaction } = await this.financialTransactionFindUseCase.perform({ bankAccountId: bankAccount.id, id })

    return { financialTransaction }
  }

  @UseGuards(AuthUserGuard)
  @UseGuards(AuthBankAccountGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/create')
  async create(@Body() body: any, @BankAccount() bankAccount: BankAccountSession) {
    await this.financialTransactionCreateUseCase.perform({ ...body, bankAccountId: bankAccount.id })

    return { message: 'Financial Transaction successfully created' }
  }

  @UseGuards(AuthUserGuard)
  @UseGuards(AuthBankAccountGuard)
  @Put('/:id/update')
  async update(@Body() body: any, @BankAccount() bankAccount: BankAccountSession, @Param('id') id: number) {
    await this.financialTransactionUpdateUseCase.perform({ ...body, id, bankAccountId: bankAccount.id })

    return { message: 'Financial Transaction successfully updated' }
  }

  @UseGuards(AuthUserGuard)
  @UseGuards(AuthBankAccountGuard)
  @Put('/:id/conclude')
  async conclude(@BankAccount() bankAccount: BankAccountSession, @Param('id') id: number) {
    this.financialTransactionConcludeUseCase.observer.subscribe(
      'events.financial-transaction.update-situation',
      this.updateBalanceBankAccountListener
    )

    await this.financialTransactionConcludeUseCase.perform({ id, bankAccountId: bankAccount.id })

    return { message: 'Financial Transaction successfully completed' }
  }

  @UseGuards(AuthUserGuard)
  @UseGuards(AuthBankAccountGuard)
  @Put('/:id/cancel')
  async cancel(@BankAccount() bankAccount: BankAccountSession, @Param('id') id: number) {
    this.financialTransactionCancelUseCase.observer.subscribe(
      'events.financial-transaction.update-situation',
      this.updateBalanceBankAccountListener
    )

    await this.financialTransactionCancelUseCase.perform({ bankAccountId: bankAccount.id, id })

    return { message: 'Financial Transaction successfully canceled' }
  }

  @UseGuards(AuthUserGuard)
  @UseGuards(AuthBankAccountGuard)
  @Delete('/:id/delete')
  async delete(@BankAccount() bankAccount: BankAccountSession, @Param('id') id: number) {
    await this.financialTransactionDeleteUseCase.perform({ bankAccountId: bankAccount.id, id })

    return { message: 'Financial Transaction successfully deleted' }
  }
}