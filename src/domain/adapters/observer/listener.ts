import { uuidV4 } from '@shared/utils/uuid'
import { IListener } from '@domain/adapters/observer/interfaces'

export abstract class Listener<T = any> implements IListener<T> {

  readonly id = uuidV4()

  abstract perform(data: T): Promise<void | any> | void | any
}