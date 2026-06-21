import { z } from 'zod'

export type ValidatorOptions = {
  debugLogError?: boolean
}

export abstract class ValidatorService {

  abstract validate<Schema extends z.ZodSchema>(schema: Schema, args: unknown, options?: ValidatorOptions): z.output<Schema>
}