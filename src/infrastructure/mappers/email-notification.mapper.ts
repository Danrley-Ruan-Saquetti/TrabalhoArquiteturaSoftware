import { NotificationMapper } from '@infrastructure/mappers/notification.mapper'
import { EmailNotificationModel } from '@infrastructure/models/email-notification.model'
import { EmailNotification } from '@domain/entities/email-notification.entity'
import { NotificationSituation, NotificationType } from '@domain/enums/notification.enum'

export class EmailNotificationMapper {

  static multiEntityToDatabase(entities: EmailNotification[]) {
    return entities.map(entity => EmailNotificationMapper.entityToDatabase(entity))
  }

  static multiDatabaseToEntity(databaseModels: EmailNotificationModel[]) {
    return databaseModels.map(databaseModel => EmailNotificationMapper.databaseToEntity(databaseModel))
  }

  static entityToDatabase(entity: EmailNotification) {
    const emailNotificationDatabase: EmailNotificationModel = {
      id: entity.id,
      recipient: entity.recipient,
      sender: entity.sender,
      notification: NotificationMapper.entityToDatabase(entity)
    }

    return emailNotificationDatabase
  }

  static databaseToEntity(databaseModel: EmailNotificationModel) {
    return new EmailNotification({
      id: databaseModel.id,
      recipient: databaseModel.recipient,
      sender: databaseModel.sender,
      body: databaseModel.notification.body,
      createdAt: databaseModel.notification.createdAt,
      sendAt: databaseModel.notification.sendAt,
      situation: databaseModel.notification.situation as NotificationSituation,
      subject: databaseModel.notification.subject,
      type: databaseModel.notification.type as NotificationType,
      updatedAt: databaseModel.notification.updatedAt,
    })
  }
}