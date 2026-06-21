import { Injectable } from '@nestjs/common'
import { GenerateCodeUseCase } from '@application/common/generate-code.use-case'
import { CodeGenerationFailedException } from '@application/exceptions/code-generation-failed.exception'
import { BankAccountRepository } from '@domain/repositories/bank-account.repository'

@Injectable()
export class BankAccountGenerateCodeUseCase extends GenerateCodeUseCase {

  constructor(
    private readonly bankAccountRepository: BankAccountRepository,
  ) {
    super()
  }

  protected prepareGenerator() {
    this.codeGenerator.setLength(11)
    this.codeGenerator.setPrefix('BAK-')
  }

  protected async validateCode(code: string) {
    return !(await this.bankAccountRepository.findByCode(code))
  }

  protected async attemptsExceeded() {
    throw new CodeGenerationFailedException('bank account')
  }
}