import { FilterSchema } from '@domain/adapters/database/filters/filter.schema'
import { OrderBySchema } from '@domain/adapters/database/filters/filter.order-by'

export type QuerySchema<Schema extends object> = {
  where?: FilterSchema<Schema>
  orderBy?: OrderBySchema<Schema>
  take?: number
  skip?: number
}