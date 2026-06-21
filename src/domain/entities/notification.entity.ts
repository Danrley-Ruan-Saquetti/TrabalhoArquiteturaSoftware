import { Notification as NotificationPrisma } from '@prisma/client'
import { ObjectRequiredProps } from '@shared/types'
import { NotificationSituation, NotificationType } from '@domain/enums/notification.enum'

export interface NotificationProps extends NotificationPrisma {
  type: NotificationType
  situation: NotificationSituation
}

export type NotificationConstructor = ObjectRequiredProps<NotificationProps, 'type' | 'subject' | 'body'>

export class Notification implements NotificationProps {

  private _id: number
  private _type: NotificationType
  private _subject: string
  private _body: string
  private _situation: NotificationSituation
  private _sendAt: Date | null
  private _updatedAt: Date
  private _createdAt: Date

  get id() { return this._id }
  get type() { return this._type }
  get subject() { return this._subject }
  get body() { return this._body }
  get situation() { return this._situation }
  get sendAt() { return this._sendAt }
  get updatedAt() { return this._updatedAt }
  get createdAt() { return this._createdAt }

  set id(value) { this._id = value }
  set type(value) { this._type = value }
  set subject(value) { this._subject = value }
  set body(value) { this._body = value }
  set situation(value) { this._situation = value }
  set sendAt(value) { this._sendAt = value }
  set updatedAt(value) { this._updatedAt = value }
  set createdAt(value) { this._createdAt = value }

  constructor(props: NotificationConstructor) {
    this.id = props.id!
    this.type = props.type
    this.subject = props.subject
    this.body = props.body
    this.situation = props.situation ?? NotificationSituation.IN_QUEUE
    this.sendAt = props.sendAt || null
    this.updatedAt = props.updatedAt!
    this.createdAt = props.createdAt!
  }

  toJSON(): NotificationProps {
    return {
      id: this.id,
      type: this.type,
      subject: this.subject,
      body: this.body,
      situation: this.situation,
      sendAt: this.sendAt,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    }
  }
}