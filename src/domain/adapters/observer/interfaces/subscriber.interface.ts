import { Listener } from "@domain/adapters/observer/listener"
import { IEventsType, IListener, ListenerActionPerformed } from "@domain/adapters/observer/interfaces"

export type SubscriberListener<T = any> = Listener<T> | Omit<IListener<T>, 'id'> | ListenerActionPerformed<T>

export interface ISubscriber<Events extends IEventsType = any> {
  subscribe<EventName extends keyof Events>(event: EventName, listenerHandle: SubscriberListener<Events[EventName]>): Listener<Events[EventName]>
  unsubscribe(listener: IListener): boolean
}