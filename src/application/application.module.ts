import { Module } from '@nestjs/common'
import { CronJobModule } from '@application/jobs/cron-jobs/cron-job.module'
import { ConsumerModule } from '@application/jobs/queues/consumer.module'

@Module({
  imports: [
    ConsumerModule,
    CronJobModule,
  ]
})
export class ApplicationModule { }