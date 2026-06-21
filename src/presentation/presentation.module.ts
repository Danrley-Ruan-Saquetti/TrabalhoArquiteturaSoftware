import { Module } from '@nestjs/common'
import { ControllerModule } from '@presentation/controllers/controller.module'

@Module({
  imports: [
    ControllerModule
  ]
})
export class PresentationModule { }