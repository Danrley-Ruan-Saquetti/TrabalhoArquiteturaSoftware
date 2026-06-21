import { Module, Provider } from '@nestjs/common'
import { CodeGeneratorServiceImplementation } from '@infrastructure/adapters/generator/code/code.service'
import { CodeGeneratorService } from '@domain/adapters/generator/code/code.service'

const providers: Provider[] = [
  {
    provide: CodeGeneratorService,
    useClass: CodeGeneratorServiceImplementation
  }
]

@Module({
  providers: [...providers],
  exports: [...providers]
})
export class InfrastructureGeneratorCodeModule { }