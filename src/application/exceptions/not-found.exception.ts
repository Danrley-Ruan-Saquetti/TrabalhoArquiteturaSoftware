import { RuntimeException } from '@shared/exceptions/runtime.exception'

export class NotFoundException extends RuntimeException {

  constructor(resource: string, identifier: string, details: Record<string, any> = {}) {
    super(`The ${resource} "${identifier}" could not be found`, { ...details, identifier })
  }
}