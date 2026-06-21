import { Module, Provider } from '@nestjs/common'
import { ZodValidatorServiceImplementation } from '@infrastructure/adapters/validator/zod.validator.service'
import { ValidatorService } from '@domain/adapters/validator/validator.service'

const providers: Provider[] = [
  {
    provide: ValidatorService,
    useClass: ZodValidatorServiceImplementation
  },
]

@Module({
  providers: [...providers],
  exports: [...providers]
})
export class InfrastructureValidatorModule { }