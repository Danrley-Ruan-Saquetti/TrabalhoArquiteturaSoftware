import { Injectable } from '@nestjs/common'
import { GenerateCodeUseCase } from '@application/common/generate-code.use-case'
import { CodeGenerationFailedException } from '@application/exceptions/code-generation-failed.exception'
import { UserRepository } from '@domain/repositories/user.repository'

@Injectable()
export class UserGenerateCodeUseCase extends GenerateCodeUseCase {

  constructor(
    private readonly userRepository: UserRepository,
  ) {
    super()
  }

  protected prepareGenerator() {
    this.codeGenerator.setLength(11)
    this.codeGenerator.setPrefix('USR-')
  }

  protected async validateCode(code: string) {
    return !(await this.userRepository.findByCode(code))
  }

  protected async attemptsExceeded() {
    throw new CodeGenerationFailedException('user')
  }
}