import { User as UserPrisma } from '@prisma/client'
import { UserType } from '@domain/enums/user.enum'
import { ObjectRequiredProps } from '@shared/types'

export interface UserProps extends UserPrisma {
  type: UserType
}

export type UserConstructor = ObjectRequiredProps<UserProps, 'type' | 'login' | 'password' | 'peopleId' | 'code'>

export class User {

  private _id: number
  private _peopleId: number
  private _type: UserType
  private _active: boolean
  private _code: string
  private _login: string
  private _password: string
  private _lastAccess: Date
  private _createdAt: Date
  private _updatedAt: Date

  get id() { return this._id }
  get peopleId() { return this._peopleId }
  get type() { return this._type }
  get active() { return this._active }
  get code() { return this._code }
  get login() { return this._login }
  get password() { return this._password }
  get lastAccess() { return this._lastAccess }
  get createdAt() { return this._createdAt }
  get updatedAt() { return this._updatedAt }

  set id(value) { this._id = value }
  set peopleId(value) { this._peopleId = value }
  set type(value) { this._type = value }
  set active(value) { this._active = value }
  set code(value) { this._code = value }
  set login(value) { this._login = value }
  set password(value) { this._password = value }
  set lastAccess(value) { this._lastAccess = value }
  set createdAt(value) { this._createdAt = value }
  set updatedAt(value) { this._updatedAt = value }

  constructor(props: UserConstructor) {
    this.id = props.id!
    this.peopleId = props.peopleId
    this.type = props.type
    this.login = props.login
    this.password = props.password
    this.code = props.code
    this.active = props.active ?? true
    this.lastAccess = props.lastAccess!
    this.updatedAt = props.updatedAt!
    this.createdAt = props.createdAt!
  }

  toJSON(): UserPrisma {
    return {
      id: this.id,
      peopleId: this.peopleId,
      type: this.type,
      login: this.login,
      password: this.password,
      code: this.code,
      active: this.active,
      lastAccess: this.lastAccess,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    }
  }
}