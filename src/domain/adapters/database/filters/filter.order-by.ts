type OrderArgs = 'asc' | 'desc'

export type OrderBySchema<Schema extends object> = {
  [x in keyof Schema]?:
  NonNullable<Schema[x]> extends Date
  ? OrderArgs
  : NonNullable<Schema[x]> extends Array<unknown>
  ? OrderArgs
  : NonNullable<Schema[x]> extends object
  ? OrderBySchema<NonNullable<Schema[x]>>
  : OrderArgs
} | OrderBySchema<Schema>[]