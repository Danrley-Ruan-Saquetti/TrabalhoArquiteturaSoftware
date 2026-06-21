import { Inject, OnModuleInit } from '@nestjs/common'
import { Listener } from '@domain/adapters/observer/listener'
import { ObserverService } from '@domain/adapters/observer/observer.service'
import { ValidatorService } from '@domain/adapters/validator/validator.service'
import { IEventsType, SubscriberListener } from '@domain/adapters/observer/interfaces'

export class UseCase<Events extends IEventsType = any> implements OnModuleInit {

  @Inject(ValidatorService)
  protected validator: ValidatorService

  @Inject(ObserverService)
  private _observer: ObserverService<Events>

  get observer() {
    return {
      subscribe: <EventName extends keyof Events>(event: EventName, listener: SubscriberListener<Events[EventName]>) => this._observer.subscribe(event, listener),
      unsubscribe: (listener: Listener) => this._observer.unsubscribe(listener),
      notify: async<EventName extends keyof Events>(event: EventName, data: Events[EventName]) => await this._observer.notify(event, data),
      getListeners: () => this._observer.getListeners(),
      getListenersByEvent: (event: keyof Events) => this._observer.getListenersByEvent(event)
    }
  }

  onModuleInit() { }
}