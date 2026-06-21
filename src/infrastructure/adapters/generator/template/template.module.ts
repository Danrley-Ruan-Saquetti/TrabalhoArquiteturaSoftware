import { Module, Provider } from '@nestjs/common'
import { TemplateGeneratorServiceImplementation } from '@infrastructure/adapters/generator/template/template.service'
import { TemplateGeneratorService } from '@domain/adapters/generator/template/template.service'

const providers: Provider[] = [
  {
    provide: TemplateGeneratorService,
    useClass: TemplateGeneratorServiceImplementation
  }
]

@Module({
  providers: [...providers],
  exports: [...providers]
})
export class InfrastructureGeneratorTemplateModule { }