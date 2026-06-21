import { Injectable, Scope } from '@nestjs/common'
import { ListenerHandle } from '@infrastructure/adapters/observer/listener-handle'
import { Listener } from '@domain/adapters/observer/listener'
import { ObserverService } from '@domain/adapters/observer/observer.service'
import { IEventsType, SubscriberListener } from '@domain/adapters/observer/interfaces'

@Injectable({ scope: Scope.REQUEST })
export class ObserverListenerImplementation<Events extends IEventsType = any> extends ObserverService<Events> {

  private readonly Listeners = new Map<keyof Events, Listener[]>()

  subscribe<EventName extends keyof Events>(event: EventName, listenerHandle: SubscriberListener<Events[EventName]>) {
    const listener = this.createListener(listenerHandle)

    const listeners = this.getListenersByEvent(event)

    listeners.push(listener)

    this.Listeners.set(event, listeners)

    return listener
  }

  unsubscribe(listener: Listener) {
    for (const [key, value] of this.Listeners.entries()) {
      const filteredArray = value.filter(item => item.id !== listener.id)

      if (filteredArray.length !== value.length) {
        this.Listeners.set(key, filteredArray)

        return true
      }
    }

    return false
  }

  async notify<EventName extends keyof Events>(event: EventName, data: any) {
    const listeners = this.getListenersByEvent(event)

    for (let i = 0; i < listeners.length; i++) {
      await listeners[i].perform(data)
    }
  }

  getListeners() {
    return Array
      .from<any, Listener[]>(this.Listeners, ([_, handlers]) => handlers)
      .reduce((acc, handlers) => [...acc, ...handlers], [])
  }

  getListenersByEvent(event: keyof Events) {
    return this.Listeners.get(event) ?? []
  }

  clearAllListeners() {
    this.Listeners.clear()
  }

  private createListener(baseListener: SubscriberListener): Listener {
    if (baseListener instanceof Listener) {
      return baseListener
    }

    if (typeof baseListener == 'function') {
      return new ListenerHandle(baseListener)
    }

    return new ListenerHandle(async (data) => await baseListener.perform(data))
  }
}