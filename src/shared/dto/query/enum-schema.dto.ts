import { z } from 'zod'

export const enumQuerySchema = (enumValue: readonly [string, ...string[]]) => {
  const baseZodEnum = z.enum(enumValue)
  const baseUnionZodEnum = z.union([baseZodEnum, z.array(baseZodEnum)]).optional().transform(val => !val ? undefined : Array.isArray(val) ? val : [val])

  return z.object({
    equals: baseZodEnum.optional(),
    not: baseZodEnum.optional(),
    in: baseUnionZodEnum,
    notIn: baseUnionZodEnum,
  }).optional()
}