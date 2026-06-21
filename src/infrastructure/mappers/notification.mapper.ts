import { NotificationModel } from '@infrastructure/models/notification.model'
import { Notification } from '@domain/entities/notification.entity'
import { NotificationType, NotificationSituation } from '@domain/enums/notification.enum'

export class NotificationMapper {

  static multiEntityToDatabase(entities: Notification[]) {
    return entities.map(entity => NotificationMapper.databaseToEntity(entity))
  }

  static multiDatabaseToEntity(databaseModels: NotificationModel[]) {
    return databaseModels.map(databaseModel => NotificationMapper.databaseToEntity(databaseModel))
  }

  static entityToDatabase(entity: Notification) {
    const notificationDatabase: NotificationModel = {
      id: entity.id,
      type: entity.type,
      body: entity.body,
      createdAt: entity.createdAt,
      sendAt: entity.sendAt,
      situation: entity.situation,
      subject: entity.subject,
      updatedAt: entity.updatedAt,
    }

    return notificationDatabase
  }

  static databaseToEntity(databaseModel: NotificationModel) {
    return new Notification({
      id: databaseModel.id,
      type: databaseModel.type as NotificationType,
      body: databaseModel.body,
      createdAt: databaseModel.createdAt,
      sendAt: databaseModel.sendAt,
      situation: databaseModel.situation as NotificationSituation,
      subject: databaseModel.subject,
      updatedAt: databaseModel.updatedAt,
    })
  }
}