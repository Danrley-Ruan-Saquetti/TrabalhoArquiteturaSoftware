import { Injectable } from '@nestjs/common'
import { FinancialTransactionUpdateSituationUseCase } from '@application/common/update-situation-financial-transaction.use-case'

@Injectable()
export class FinancialTransactionConcludeUseCase extends FinancialTransactionUpdateSituationUseCase {

  protected async updateSituation() {
    this.financialTransaction.conclude()
  }
}