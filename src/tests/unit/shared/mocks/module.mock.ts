import { Test } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { ModuleMetadata } from '@nestjs/common'
import { InfrastructureObserverModule } from '@infrastructure/adapters/observer/observer.module'
import { InfrastructureValidatorModule } from '@infrastructure/adapters/validator/validator.module'

export const createApplicationMock = async (
  {
    controllers = [],
    exports = [],
    imports = [],
    providers = [],
  }: ModuleMetadata = {}
) => {
  return await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        envFilePath: ['.env'],
        isGlobal: true,
      }),
      InfrastructureValidatorModule,
      InfrastructureObserverModule,
      ...imports
    ],
    controllers,
    providers,
    exports,
  }).compile()
}