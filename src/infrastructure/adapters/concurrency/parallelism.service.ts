import { Injectable, Scope } from '@nestjs/common'
import pLimit from 'p-limit'
import { InvalidLimitParallelismException } from '@infrastructure/adapters/concurrency/parallelism.exception'
import { ParallelismHandler, ParallelismService } from '@domain/adapters/concurrency/parallelism.service'

@Injectable({ scope: Scope.REQUEST })
export class ParallelismServiceImplementation extends ParallelismService {

  private handlers: ParallelismHandler[] = []
  private limit = 1

  registerHandler(handler: ParallelismHandler) {
    this.handlers.push(handler)
    return this
  }

  async run() {
    const handlers = this.getPromiseHandlers()

    await Promise.all(handlers)

    this.clearHandlers()
  }

  private getPromiseHandlers() {
    const limiter = pLimit(this.limit)

    return this.handlers.map(handler => limiter(handler))
  }

  private clearHandlers() {
    this.handlers = []
  }

  setLimit(limit: number) {
    if (limit < 1) {
      throw new InvalidLimitParallelismException('The threshold value cannot be less than 1')
    }

    this.limit = limit
  }
}