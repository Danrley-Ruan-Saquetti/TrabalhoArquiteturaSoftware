export type ParallelismHandler = () => Promise<void> | void

export abstract class ParallelismService {

  abstract setLimit(limit: number): void
  abstract registerHandler(handler: ParallelismHandler): this
  abstract run(): Promise<void>
}