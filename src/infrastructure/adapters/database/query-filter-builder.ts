import { SchemaFilterQuery } from '@domain/adapters/database/database.service'

export type WhereCondition = Record<string, Record<string, any> | Record<string, any>[]>

export class QueryFilterBuilder {

  static readonly TYPES_THAT_ARE_NOT_THE_OBJECT_OPERATORS = ['string', 'boolean', 'number', 'bigint']

  private filters: Record<string, any> = {}

  constructor(
    private readonly queryFilterSchema: SchemaFilterQuery = {}
  ) { }

  build(whereConditions: WhereCondition) {
    for (const field in whereConditions) {
      if (field == 'OR' || field == 'AND') {
        this.parseConditionsAndOr(field, whereConditions[field] as any)
      } else {
        this.parseConditionsOperators(field, whereConditions[field])
      }
    }

    return this.filters
  }

  private parseConditionsAndOr(type: 'AND' | 'OR', whereConditions: WhereCondition) {
    const conditions = this.parseOrAndConditions(whereConditions as any)

    this.addFilter(type, {
      superFilters: {
        BASE: {
          [type]: conditions,
        }
      }
    })
  }

  private parseOrAndConditions(andOrConditions: Record<string, Record<string, any>>[]) {
    return andOrConditions.map(andOrCondition => new QueryFilterBuilder(this.queryFilterSchema).build(andOrCondition))
  }

  private parseConditionsOperators(field: string, whereConditions: Record<string, any>) {
    if (QueryFilterBuilder.TYPES_THAT_ARE_NOT_THE_OBJECT_OPERATORS.includes(typeof whereConditions)) {
      whereConditions = { equals: whereConditions }
    }

    const operators = whereConditions

    for (const operator in operators) {
      const value = operators[operator]

      const { filters, superFilters } = this.parseOperatorField(field, operator, value)

      this.addFilter(field, { filters, superFilters })
    }
  }

  private parseOperatorField(field: string, operator: string, value: any) {
    const type = this.queryFilterSchema[field]

    if (!type) return {}

    type FilterHandler = () => { filters?: any, superFilters?: { BASE?: any, NOT?: any } }

    const SCHEMA_TYPE: Record<string, Record<string, FilterHandler>> = {
      string: {
        notContains: () => ({ superFilters: { NOT: { contains: value } } }),
        fil: () => ({}),
      },
      number: {
        fil: () => ({}),
      },
      boolean: {
        fil: () => ({}),
      },
      date: {
        between: () => ({ filters: { lte: value[0], gte: value[1] } }),
        notBetween: () => ({ superFilters: { NOT: { lte: value[0], gte: value[1] } } }),
        fil: () => ({}),
      },
      json: {
        fil: () => ({}),
      },
      enum: {
        fil: () => ({}),
      },
      object: {}
    }

    const schemaType = SCHEMA_TYPE[type]

    if (!schemaType) return {}

    const schemaOperator = schemaType[operator] || (() => ({
      filters: { [operator]: value }
    }))

    return schemaOperator()
  }

  private addFilter(field: string, { filters, superFilters }: { filters?: any, superFilters?: { NOT?: any, BASE?: any } }) {
    if (filters) {
      this.filters[field] = { ...this.filters[field], ...filters }
    }

    if (superFilters) {
      if (superFilters.NOT) {
        this.filters.NOT = {
          ...this.filters?.NOT,
          [field]: {
            ...this.filters?.NOT?.[field],
            ...superFilters.NOT,
          }
        }
      }

      if (superFilters.BASE) {
        this.filters = {
          ...this.filters,
          ...superFilters.BASE,
          AND: [...(this.filters.AND ?? []), ...(superFilters.BASE.AND ?? [])],
          OR: [...(this.filters.OR ?? []), ...(superFilters.BASE.OR ?? [])],
        }
      }
    }
  }
}