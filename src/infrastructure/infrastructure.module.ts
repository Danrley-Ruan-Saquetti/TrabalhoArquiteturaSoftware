import { Module } from '@nestjs/common'
import { InfrastructureErrorLogModule } from '@infrastructure/adapters/error-log/error-log.module'

@Module({
  imports: [
    InfrastructureErrorLogModule,
  ]
})
export class InfrastructureModule { }