import { User } from '@domain/entities/user.entity'
import { People } from '@domain/entities/people.entity'

export interface UserCreateEvent {
  'events.user.created': { user: User, people: People }
}