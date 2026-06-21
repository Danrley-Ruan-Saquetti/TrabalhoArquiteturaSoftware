import { HttpAdapterHost } from '@nestjs/core'
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { Result } from '@presentation/util/result'
import { UnauthorizedException } from '@application/exceptions/unauthorized.exception'
import { ErrorLogService } from '@domain/adapters/error-log/error-log.service'
import { env } from '@shared/env'
import { CriticalException, RuntimeException } from '@shared/exceptions'

@Catch()
export class CatchAllExceptionFilter implements ExceptionFilter {

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly errorLogService: ErrorLogService
  ) { }

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()

    const httpStatus = CatchAllExceptionFilter.getStatusCode(exception)
    const responseBody = CatchAllExceptionFilter.getResponseException(exception).toJSON()

    await this.saveErrorLog(exception, {
      method: ctx.getRequest().method,
      router: ctx.getRequest().url,
      statusCode: httpStatus,
      params: ctx.getRequest().params,
      query: ctx.getRequest().query,
      body: ctx.getRequest().body,
    })

    this.httpAdapterHost.httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }

  private static getResponseException(exception: any) {
    return Result.failure(
      CatchAllExceptionFilter.getResponseBody(exception),
      CatchAllExceptionFilter.getStatusCode(exception)
    )
  }

  private static getResponseBody(exception: any) {
    if (env('ENVIRONMENT') == 'PRODUCTION') {
      if (exception instanceof CriticalException || (exception instanceof HttpException && exception.getStatus() >= 500)) {
        return { message: 'Internal Server Error. Try again later' }
      }
    }

    if (exception instanceof HttpException) {
      return { message: exception.message }
    }

    return { message: exception?.message || 'Error', ...exception }
  }

  private static getStatusCode(exception: unknown) {
    if (exception instanceof UnauthorizedException) return HttpStatus.UNAUTHORIZED
    if (exception instanceof RuntimeException) return HttpStatus.BAD_REQUEST
    if (exception instanceof CriticalException) return HttpStatus.INTERNAL_SERVER_ERROR
    if (exception instanceof HttpException) return exception.getStatus()

    return HttpStatus.INTERNAL_SERVER_ERROR
  }

  async saveErrorLog(exception: any, context: { method: string, router: string, statusCode: number, params?: Record<string, any>, query?: Record<string, any>, body?: Record<string, any> }) {
    await this.errorLogService.save({
      type: 'HTTP',
      origin: `http.${context.method.toLowerCase()}.${context.router}`,
      message: exception.message ?? 'Error',
      details: {
        error: exception.details,
        HTTP: context
      }
    })
  }
}