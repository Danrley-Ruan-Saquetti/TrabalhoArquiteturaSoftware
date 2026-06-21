import { Module, Provider } from '@nestjs/common'
import { HashServiceImplementation } from '@infrastructure/adapters/crypto/hash.service'
import { HashService } from '@domain/adapters/crypto/hash.service'

const providers: Provider[] = [
  {
    provide: HashService,
    useClass: HashServiceImplementation
  }
]

@Module({
  providers: [...providers],
  exports: [...providers]
})
export class InfrastructureHashModule { }