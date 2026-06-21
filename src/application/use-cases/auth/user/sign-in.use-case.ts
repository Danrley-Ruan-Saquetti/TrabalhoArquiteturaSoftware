import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { UserJWTPayload } from '@application/types/user-jwt-payload.type'
import { AuthUserSignInEvent } from '@application/observer/events/auth/user/sign-in.event'
import { UnauthorizedException } from '@application/exceptions/unauthorized.exception'
import { SignInCredentialInvalidException } from '@application/exceptions/sign-in-credential-invalid.exception'
import { AuthUserSignInDTO, authUserSignInSchema } from '@application/dto/auth/user/sign-in.dto'
import { User } from '@domain/entities/user.entity'
import { UserType } from '@domain/enums/user.enum'
import { JWTService } from '@domain/adapters/jwt/jwt.service'
import { HashService } from '@domain/adapters/crypto/hash.service'
import { UserRepository } from '@domain/repositories/user.repository'
import { env } from '@shared/env'
import { extractDigits } from '@shared/utils/string'

@Injectable()
export class AuthUserSignInUseCase extends UseCase<AuthUserSignInEvent> {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly hash: HashService,
    private readonly jwt: JWTService,
  ) {
    super()
  }

  async perform(args: AuthUserSignInDTO) {
    const { login, type, password } = this.validator.validate(authUserSignInSchema, args)

    const user = await this.getUser(login, type)

    await this.validatePassword(user, password)
    this.validateUserCanLogin(user)
    await this.updateStateUserOnLogin(user)

    const payload = this.createJWTPayloadUser(user)
    const token = this.generateJWTToken(payload)

    await this.observer.notify('events.auth.user.sign-in', { user })

    return { token, payload }
  }

  private async getUser(value: string, type: UserType) {
    const [user] = await this.userRepository.findMany({
      where: {
        type,
        OR: [
          { login: value },
          { code: value },
          { people: { cpfCnpj: extractDigits(value) } }
        ]
      },
      take: 1,
    })

    if (!user) {
      throw new SignInCredentialInvalidException()
    }

    return user
  }

  private async validatePassword(user: User, password: string) {
    const isSamePassword = await this.hash.compare(password, user.password)

    if (!isSamePassword) {
      throw new SignInCredentialInvalidException()
    }
  }

  private validateUserCanLogin(user: User) {
    if (!user.active) {
      throw new UnauthorizedException('This currently inactive user account')
    }
  }

  private async updateStateUserOnLogin(user: User) {
    user.lastAccess = new Date(Date.now())

    await this.userRepository.update(user.id, user)
  }

  private createJWTPayloadUser(user: User): UserJWTPayload {
    return {
      sub: user.id,
      peopleId: user.peopleId,
      code: user.code,
    }
  }

  private generateJWTToken(payload: UserJWTPayload) {
    return this.jwt.encode(payload, {
      secret: env('JWT_USER_SECRET'),
      exp: env('JWT_USER_EXPIRATION'),
    })
  }
}