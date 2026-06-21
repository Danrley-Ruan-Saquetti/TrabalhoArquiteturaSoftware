import { EmailNotification } from '@domain/entities/email-notification.entity'
import { Exception } from '@shared/exceptions/exception'

export interface EmailNotificationSendEmailEvent {
  'events.email-notification.send.success': { emailNotification: EmailNotification }
  'events.email-notification.send.error': { emailNotification: EmailNotification, error: Exception }
}