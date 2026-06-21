import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { CronJob } from '@application/jobs/cron-jobs/cron-job'
import { FinancialTransactionUpdateDelayedUseCase } from '@application/use-cases/financial-transaction/update-delayed.use-case'

@Injectable()
export class UpdateSituationFinancialTransactionCronJob extends CronJob {

  constructor(
    private readonly financialTransactionUpdateDelayedUseCase: FinancialTransactionUpdateDelayedUseCase
  ) {
    super()
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async updateFinancialTransactionDelayed() {
    await this.financialTransactionUpdateDelayedUseCase.perform({ limit: 100 })
  }
}