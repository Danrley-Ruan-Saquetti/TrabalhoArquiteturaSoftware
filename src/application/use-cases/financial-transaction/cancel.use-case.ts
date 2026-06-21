import { Injectable } from '@nestjs/common'
import { FinancialTransactionUpdateSituationUseCase } from '@application/common/update-situation-financial-transaction.use-case'

@Injectable()
export class FinancialTransactionCancelUseCase extends FinancialTransactionUpdateSituationUseCase {

  protected async updateSituation() {
    this.financialTransaction.cancel()
  }
}