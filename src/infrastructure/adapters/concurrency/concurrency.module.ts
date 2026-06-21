import { Module, Provider } from '@nestjs/common'
import { ParallelismServiceImplementation } from '@infrastructure/adapters/concurrency/parallelism.service'
import { ParallelismService } from '@domain/adapters/concurrency/parallelism.service'

const providers: Provider[] = [
  {
    provide: ParallelismService,
    useClass: ParallelismServiceImplementation
  }
]

@Module({
  providers: [...providers],
  exports: [...providers]
})
export class InfrastructureConcurrencyModule { }