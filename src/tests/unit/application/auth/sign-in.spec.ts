import { beforeEach, describe, expect, test, vi } from 'vitest'
import { JwtModule } from '@nestjs/jwt'
import { InfrastructureJWTModule } from '@infrastructure/adapters/jwt/jwt.module'
import { InfrastructureHashModule } from '@infrastructure/adapters/crypto/crypto.module'
import { AuthUserSignInUseCase } from '@application/use-cases/auth/user/sign-in.use-case'
import { SignInCredentialInvalidException } from '@application/exceptions/sign-in-credential-invalid.exception'
import { User } from '@domain/entities/user.entity'
import { UserType } from '@domain/enums/user.enum'
import { HashService } from '@domain/adapters/crypto/hash.service'
import { UserRepository } from '@domain/repositories/user.repository'
import { UserRepositoryMock } from '@tests/unit/shared/mocks/user/repository.mock'
import { createApplicationMock } from '@tests/unit/shared/mocks/module.mock'

describe('Application - Auth - UseCase - SignIn', () => {
  let hash: HashService
  let authUserSignInUseCase: AuthUserSignInUseCase
  let userRepositoryMock: UserRepositoryMock

  beforeEach(async () => {
    userRepositoryMock = new UserRepositoryMock()

    const module = await createApplicationMock({
      imports: [
        JwtModule.register({}),
        InfrastructureHashModule,
        InfrastructureJWTModule
      ],
      providers: [
        AuthUserSignInUseCase,
        {
          provide: UserRepository,
          useValue: userRepositoryMock
        }
      ]
    })

    authUserSignInUseCase = module.get(AuthUserSignInUseCase)
    hash = module.get(HashService)
  })

  test('Should be a sign-in', async () => {
    const arrange = {
      login: 'dan@gmail.com',
      password: 'Dan!@#123',
      type: UserType.CLIENT,
    }

    vi.spyOn(userRepositoryMock, 'findMany').mockImplementation(async () => [
      new User({
        id: 1,
        peopleId: 1,
        login: arrange.login,
        type: arrange.type,
        code: 'USR-CODE_TEST',
        password: await hash.hash('Dan!@#123'),
      })
    ])

    const response = await authUserSignInUseCase.perform(arrange)

    expect(response.payload.sub).toEqual(1)
    expect(response.payload.peopleId).toEqual(1)
    expect(response.payload.code).toEqual('USR-CODE_TEST')
    expect(typeof response.token).toEqual('string')
  })

  test('Should dispatch an exception when login not registered', async () => {
    const arrange = {
      login: 'dan@gmail.com',
      password: 'Dan!@#123',
      type: UserType.CLIENT,
    }

    await expect(authUserSignInUseCase.perform(arrange)).rejects.toThrow(SignInCredentialInvalidException)
  })

  test('Should dispatch an exception when invalid password', async () => {
    const arrange = {
      login: 'dan@gmail.com',
      password: 'password_invalid',
      type: UserType.CLIENT,
    }

    vi.spyOn(userRepositoryMock, 'findByLoginAndType').mockImplementation(async (login: string, type: UserType) => new User({
      id: 1,
      peopleId: 1,
      login,
      type,
      code: 'USR-CODE_TEST',
      password: await hash.hash('Dan!@#123'),
    }))

    await expect(authUserSignInUseCase.perform(arrange)).rejects.toThrow(SignInCredentialInvalidException)
  })
})