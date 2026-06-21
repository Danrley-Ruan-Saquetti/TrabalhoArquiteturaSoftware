import { Email as EmailPrisma } from '@prisma/client'
import { NotificationModel } from '@infrastructure/models/notification.model'

export interface EmailNotificationModel extends EmailPrisma {
  notification: Omit<NotificationModel, 'id'>
}