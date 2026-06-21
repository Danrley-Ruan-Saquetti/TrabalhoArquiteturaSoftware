import { RuntimeException } from '@shared/exceptions/runtime.exception'

export class ConflictException extends RuntimeException {

  constructor(resource: string, value: string, details: Record<string, any> = {}) {
    super(`The ${resource} "${value}" already exists`, { ...details, value })
  }
}