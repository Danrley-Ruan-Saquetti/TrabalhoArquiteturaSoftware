import { z } from "zod";

export const emailNotificationSendEmailInQueueSchema = z.object({
  limit: z
    .number()
    .min(1, 'Limit must have greater than 0 (zero)')
    .optional()
})

export type EmailNotificationSendEmailInQueueDTO = z.input<typeof emailNotificationSendEmailInQueueSchema>