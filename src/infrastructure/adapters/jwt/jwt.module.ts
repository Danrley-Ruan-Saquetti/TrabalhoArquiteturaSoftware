import { JwtModule } from '@nestjs/jwt'
import { Module, Provider } from '@nestjs/common'
import { JWTServiceImplementation } from '@infrastructure/adapters/jwt/jwt.service'
import { JWTService } from '@domain/adapters/jwt/jwt.service'

const providers: Provider[] = [
  {
    provide: JWTService,
    useClass: JWTServiceImplementation
  }
]

@Module({
  imports: [
    JwtModule.register({})
  ],
  providers: [...providers],
  exports: [...providers]
})
export class InfrastructureJWTModule { }