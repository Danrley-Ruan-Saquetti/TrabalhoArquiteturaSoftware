import { Module, Provider } from '@nestjs/common'
import { ObserverService } from '@domain/adapters/observer/observer.service'
import { ObserverListenerImplementation } from '@infrastructure/adapters/observer/observer.service'

const providers: Provider[] = [
  {
    provide: ObserverService,
    useClass: ObserverListenerImplementation
  }
]

@Module({
  providers: [...providers],
  exports: [...providers]
})
export class InfrastructureObserverModule { }