import { z } from 'zod'
import { EmailNotificationMessage } from '@application/messages/email-notification.message'

export const emailNotificationCreateSchema = z.object({
  subject: z
    .string({ 'required_error': EmailNotificationMessage.subject.required })
    .min(1, EmailNotificationMessage.subject.required),
  body: z
    .string({ 'required_error': EmailNotificationMessage.body.required })
    .min(1, EmailNotificationMessage.body.required),
  recipients: z
    .array(
      z
        .string({ 'required_error': EmailNotificationMessage.recipient.required })
        .trim()
        .min(1, EmailNotificationMessage.recipient.required)
    )
    .min(1, EmailNotificationMessage.recipient.required),
  sender: z
    .string({ 'required_error': EmailNotificationMessage.sender.required })
    .min(1, EmailNotificationMessage.sender.required),
})

export type EmailNotificationCreateDTO = z.input<typeof emailNotificationCreateSchema>