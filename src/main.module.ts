import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ResultInterceptor } from '@presentation/interceptors/result.interceptor'
import { PresentationModule } from '@presentation/presentation.module'
import { CatchAllExceptionFilter } from '@presentation/filters/all-exception.filter'
import { InfrastructureModule } from '@infrastructure/infrastructure.module'
import { InfrastructureErrorLogModule } from '@infrastructure/adapters/error-log/error-log.module'
import { ApplicationModule } from '@application/application.module'
import { env } from '@shared/env'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: env('REDIS_HOST'),
        port: env('REDIS_PORT'),
        // password: env('REDIS_PASSWORD'),
      },
    }),
    ScheduleModule.forRoot(),
    InfrastructureModule,
    ApplicationModule,
    PresentationModule,
    InfrastructureErrorLogModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CatchAllExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResultInterceptor,
    },
  ],
})
export class MainModule { }
