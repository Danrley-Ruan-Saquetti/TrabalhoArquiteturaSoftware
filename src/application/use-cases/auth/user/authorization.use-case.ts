import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { UnauthorizedException } from '@application/exceptions/unauthorized.exception'
import { UserJWTPayload } from '@application/types/user-jwt-payload.type'
import { AuthUserAuthorizationDTO, authUserAuthorizationSchema } from '@application/dto/auth/user/authorization.dto'
import { JWTService } from '@domain/adapters/jwt/jwt.service'

@Injectable()
export class AuthUserAuthorizationUseCase extends UseCase {
  constructor(
    private readonly jwtService: JWTService
  ) {
    super()
  }

  perform(args: AuthUserAuthorizationDTO) {
    const { token: authorizationToken } = this.validator.validate(authUserAuthorizationSchema, args)

    if (!authorizationToken) {
      throw new UnauthorizedException('Unauthorized', [{ message: 'Authorization token not defined', path: ['authorization', 'required'] }])
    }

    if (authorizationToken.split(' ').length != 2) {
      throw new UnauthorizedException('Unauthorized', [{ message: 'Invalid authorization token', path: ['authorization', '_format', '_invalid'] }])
    }

    const [bearer, token] = authorizationToken.split(' ')

    if (bearer !== 'Bearer') {
      throw new UnauthorizedException('Unauthorized', [{ message: 'Invalid authorization bearer token format', path: ['bearer', '_invalid'] }])
    }

    try {
      const payload = this.jwtService.decode<UserJWTPayload>(token)

      if (!payload) {
        throw new UnauthorizedException('Unauthorized', [{ message: 'Invalid authorization token', path: ['token', '_invalid'] }])
      }

      return { payload }
    } catch {
      throw new UnauthorizedException('Unauthorized', [{ message: 'Invalid authorization token', path: ['token', '_invalid'] }])
    }
  }
}