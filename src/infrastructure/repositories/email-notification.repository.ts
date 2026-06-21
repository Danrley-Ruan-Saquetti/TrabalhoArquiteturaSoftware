import { Injectable } from '@nestjs/common'
import { EmailNotificationMapper } from '@infrastructure/mappers/email-notification.mapper'
import { NotificationProps } from '@domain/entities/notification.entity'
import { DatabaseService, SchemaFilterQuery } from '@domain/adapters/database/database.service'
import { EmailNotification, EmailNotificationProps } from '@domain/entities/email-notification.entity'
import { EmailNotificationQueryArgs, EmailNotificationRepository } from '@domain/repositories/email-notification.repository'

@Injectable()
export class EmailNotificationRepositoryImplementation extends EmailNotificationRepository {

  static QUERY_SCHEMA_FILTER: SchemaFilterQuery<EmailNotificationProps & { notification: NotificationProps }> = {
    recipient: 'string',
    sender: 'string',
    notification: 'object',
    id: 'number',
  }

  constructor(
    private readonly database: DatabaseService
  ) {
    super()
  }

  async create(emailNotification: EmailNotification) {
    try {
      const emailNotificationModel = EmailNotificationMapper.entityToDatabase(emailNotification)

      const emailNotificationDatabase = await this.database.email.create({
        data: {
          sender: emailNotificationModel.sender,
          recipient: emailNotificationModel.recipient,
          notification: {
            create: {
              body: emailNotificationModel.notification.body,
              subject: emailNotificationModel.notification.subject,
              type: emailNotificationModel.notification.type,
              sendAt: emailNotificationModel.notification.sendAt,
              situation: emailNotificationModel.notification.situation,
            }
          },
        },
        include: {
          notification: true
        }
      })

      return EmailNotificationMapper.databaseToEntity(emailNotificationDatabase)
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async update(id: number, emailNotification: EmailNotification) {
    try {
      const emailNotificationModel = EmailNotificationMapper.entityToDatabase(emailNotification)

      const emailNotificationDatabase = await this.database.email.update({
        where: { id },
        data: {
          sender: emailNotificationModel.sender,
          recipient: emailNotificationModel.recipient,
          notification: {
            update: {
              body: emailNotificationModel.notification.body,
              subject: emailNotificationModel.notification.subject,
              type: emailNotificationModel.notification.type,
              sendAt: emailNotificationModel.notification.sendAt,
              situation: emailNotificationModel.notification.situation,
            }
          },
        },
        include: {
          notification: true
        }
      })

      return EmailNotificationMapper.databaseToEntity(emailNotificationDatabase)
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async delete(id: number) {
    try {
      await this.database.email.delete({ where: { id } })
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async findMany(args: EmailNotificationQueryArgs = {}) {
    try {
      const emailNotificationsDatabase = await this.database.email.findMany({
        ...args as any,
        where: this.database.pipeWhere(args.where, EmailNotificationRepositoryImplementation.QUERY_SCHEMA_FILTER),
        include: {
          notification: true
        }
      })

      return EmailNotificationMapper.multiDatabaseToEntity(emailNotificationsDatabase as any)
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async findById(id: number) {
    try {
      const emailNotificationDatabase = await this.database.email.findUnique({ where: { id }, include: { notification: true } })

      return emailNotificationDatabase ? EmailNotificationMapper.databaseToEntity(emailNotificationDatabase) : null
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }
}