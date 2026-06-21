import { IEventsType } from '@domain/adapters/observer/interfaces'

export interface IPublisher<Events extends IEventsType = any> {
  notify<EventName extends keyof Events>(event: EventName, data: Events[EventName]): Promise<void>
}