import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { NotFoundException } from '@application/exceptions/not-found.exception'
import { UnauthorizedException } from '@application/exceptions/unauthorized.exception'
import { BankAccountJWTPayload } from '@application/types/bank-account-jwt-payload.type'
import { AuthBankAccountSignInEvent } from '@application/observer/events/auth/bank-account/sign-in.event'
import { AuthBankAccountSignInDTO, authBankAccountSignInSchema } from '@application/dto/auth/bank-account/sign-in.dto'
import { JWTService } from '@domain/adapters/jwt/jwt.service'
import { BankAccount } from '@domain/entities/bank-account.entity'
import { BankAccountRepository } from '@domain/repositories/bank-account.repository'
import { env } from '@shared/env'

@Injectable()
export class AuthBankAccountSignInUseCase extends UseCase<AuthBankAccountSignInEvent> {

  constructor(
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly jwt: JWTService,
  ) {
    super()
  }

  async perform(args: AuthBankAccountSignInDTO) {
    const { peopleId, code } = this.validator.validate(authBankAccountSignInSchema, args)

    const bankAccount = await this.findBankAccount(code, peopleId)
    const payload = this.createJWTPayloadBankAccount(bankAccount)
    const token = this.generateJWTToken(payload)

    await this.observer.notify('events.auth.bank-account.sign-in', { bankAccount })

    return { token, payload }
  }

  private async findBankAccount(code: string, peopleId: number) {
    const bankAccount = await this.bankAccountRepository.findByCode(code)

    if (!bankAccount) {
      throw new NotFoundException('Bank Account', code)
    }

    if (bankAccount.peopleId != peopleId) {
      throw new UnauthorizedException('You do not have permission to access this bank account')
    }

    if (!bankAccount.active) {
      throw new UnauthorizedException('This currently inactive bank account')
    }

    return bankAccount
  }

  private createJWTPayloadBankAccount(bankAccount: BankAccount): BankAccountJWTPayload {
    return {
      sub: bankAccount.id,
      code: bankAccount.code,
    }
  }

  private generateJWTToken(payload: BankAccountJWTPayload) {
    return this.jwt.encode(payload, {
      secret: env('JWT_USER_SECRET'),
      exp: env('JWT_USER_EXPIRATION'),
    })
  }
}