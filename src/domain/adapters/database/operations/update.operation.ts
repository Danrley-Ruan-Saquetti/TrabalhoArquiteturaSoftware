import { FilterSchema } from '@domain/adapters/database/filters/filter.schema'

export type UpdateSchema<SchemaFilter extends object, SchemaData extends object> = {
  where?: FilterSchema<SchemaFilter>
  data: Partial<SchemaData>
}