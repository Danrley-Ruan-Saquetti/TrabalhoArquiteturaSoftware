import { Email as EmailPrisma } from '@prisma/client'
import { Notification, NotificationProps, NotificationConstructor } from '@domain/entities/notification.entity'
import { ObjectRequiredProps } from '@shared/types'

export type EmailNotificationProps = EmailPrisma

export type EmailNotificationConstructor = NotificationConstructor & ObjectRequiredProps<EmailNotificationProps, 'recipient' | 'sender'>

export class EmailNotification extends Notification implements EmailNotificationProps {

  private _recipient: string[]
  private _sender: string

  get recipient() { return this._recipient }
  get sender() { return this._sender }

  set recipient(value) { this._recipient = value }
  set sender(value) { this._sender = value }

  constructor(props: EmailNotificationConstructor) {
    super(props)

    this.recipient = props.recipient
    this.sender = props.sender
  }

  toJSON(): EmailNotificationProps & NotificationProps {
    return {
      ...super.toJSON(),
      id: this.id,
      recipient: this.recipient,
      sender: this.sender,
    }
  }
}