import { JwtService } from '@nestjs/jwt'
import { Injectable, Scope } from '@nestjs/common'
import { JWTService, JWTOptions } from '@domain/adapters/jwt/jwt.service'

@Injectable({ scope: Scope.REQUEST })
export class JWTServiceImplementation extends JWTService {

  constructor(
    private jwtService: JwtService
  ) {
    super()
  }

  encode(payload: Record<string, unknown>, { secret, exp, algorithm = 'HS256' }: JWTOptions) {
    return this.jwtService.sign(payload, { algorithm, secret, expiresIn: exp })
  }

  decode<Payload extends object = any>(token: string) {
    return this.jwtService.decode<Payload>(token)
  }
}