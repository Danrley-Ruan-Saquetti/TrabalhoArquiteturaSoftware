import { QuerySchema } from '@domain/adapters/database/operations'
import { FilterSchema } from '@domain/adapters/database/filters'
import { NotificationFilterArgs } from '@domain/repositories/notification.repository'
import { EmailNotification, EmailNotificationProps } from '@domain/entities/email-notification.entity'

interface EmailNotificationFilterArgs extends EmailNotificationProps {
  notification: NotificationFilterArgs
}

export type EmailNotificationFilter = FilterSchema<EmailNotificationFilterArgs>
export type EmailNotificationQueryArgs = QuerySchema<EmailNotificationFilterArgs>

export abstract class EmailNotificationRepository {

  abstract create(emailNotification: EmailNotification): Promise<EmailNotification>
  abstract update(id: number, emailNotification: EmailNotification): Promise<EmailNotification>
  abstract delete(id: number): Promise<void>
  abstract findById(id: number): Promise<EmailNotification | null>
  abstract findMany(args?: EmailNotificationQueryArgs): Promise<EmailNotification[]>
}