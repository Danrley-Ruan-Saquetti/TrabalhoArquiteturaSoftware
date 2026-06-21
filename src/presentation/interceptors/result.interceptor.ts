import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { map, Observable } from 'rxjs'

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse()

    return next
      .handle()
      .pipe(
        map(data => ({
          status: response.statusCode,
          ok: response.statusCode < 400,
          value: response.statusCode < 400 ? data : null,
          error: response.statusCode >= 400 ? data : null,
        }))
      )
  }
}