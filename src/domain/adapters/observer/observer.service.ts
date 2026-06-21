import { Listener } from '@domain/adapters/observer/listener'
import { IEventsType, IListener, IPublisher, ISubscriber, SubscriberListener } from '@domain/adapters/observer/interfaces'

export abstract class ObserverService<Events extends IEventsType = any> implements IPublisher<Events>, ISubscriber<Events> {

  abstract subscribe<EventName extends keyof Events>(event: EventName, listenerHandle: SubscriberListener<Events[EventName]>): Listener<Events[EventName]>
  abstract unsubscribe(listener: IListener): boolean
  abstract notify<EventName extends keyof Events>(event: EventName, data: Events[EventName]): Promise<void>
  abstract clearAllListeners(): void
  abstract getListeners(): Listener[]
  abstract getListenersByEvent(event: keyof Events): Listener[]
}