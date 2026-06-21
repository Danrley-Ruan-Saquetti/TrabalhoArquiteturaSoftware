import { ErrorLog as ErrorLogPrisma } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'
import { ObjectRequiredProps } from '@shared/types'

export type ErrorLogProps = ErrorLogPrisma

export type ErrorLogConstructor = ObjectRequiredProps<ErrorLogProps, 'type' | 'origin' | 'message'>

export class ErrorLog implements ErrorLogProps {

  private _id: string
  private _origin: string
  private _type: string
  private _message: string
  private _details: JsonValue
  private _createdAt: Date

  get id() { return this._id }
  get origin() { return this._origin }
  get type() { return this._type }
  get message() { return this._message }
  get details() { return this._details }
  get createdAt() { return this._createdAt }

  set id(value) { this._id = value }
  set origin(value) { this._origin = value }
  set type(value) { this._type = value }
  set message(value) { this._message = value }
  set details(value) { this._details = value }
  set createdAt(value) { this._createdAt = value }

  constructor(props: ErrorLogConstructor) {
    this.id = props.id!
    this.origin = props.origin
    this.type = props.type
    this.message = props.message
    this.details = props.details || null
    this.createdAt = props.createdAt!
  }

  toJSON(): ErrorLogProps {
    return {
      id: this.id,
      type: this.type,
      origin: this.origin,
      message: this.message,
      details: this.details,
      createdAt: this.createdAt,
    }
  }
}