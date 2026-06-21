import { Listener } from '@domain/adapters/observer/listener'
import { ListenerActionPerformed } from '@domain/adapters/observer/interfaces'

export class ListenerHandle<T = any> extends Listener<T> {

  constructor(
    public perform: ListenerActionPerformed<T>
  ) {
    super()
  }
}