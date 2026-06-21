import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { InfrastructureMailModule } from '@infrastructure/adapters/mail/mail.module'
import { InfrastructureErrorLogModule } from '@infrastructure/adapters/error-log/error-log.module'
import { InfrastructureRepositoryModule } from '@infrastructure/repositories/repository.module'
import { InfrastructureGeneratorTemplateModule } from '@infrastructure/adapters/generator/template/template.module'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'queue.email-notification',
    }),
    InfrastructureMailModule,
    InfrastructureGeneratorTemplateModule,
    InfrastructureRepositoryModule,
    InfrastructureErrorLogModule
  ],
  providers: [],
  exports: [
    BullModule,
  ],
})
export class ConsumerModule { }