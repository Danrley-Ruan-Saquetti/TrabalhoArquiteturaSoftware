import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { User } from '@presentation/decorators/user.decorator'
import { UserSession } from '@presentation/types/user-session.type'
import { AuthUserGuard } from '@presentation/guards/auth-user.guard'
import { UserFindUseCase } from '@application/use-cases/user/find.use-case'
import { UserCreateUseCase } from '@application/use-cases/user/create.use-case'
import { UserType } from '@domain/enums/user.enum'

@Controller('/users')
export class UserController {

  constructor(
    private readonly userCreateUseCase: UserCreateUseCase,
    private readonly userFindUseCase: UserFindUseCase,
  ) { }

  @Post('/create')
  async create(@Body() body: any) {
    await this.userCreateUseCase.perform({ ...body, type: UserType.CLIENT })

    return { message: 'User successfully created' }
  }

  @UseGuards(AuthUserGuard)
  @Get('/current')
  async find(@User() user: UserSession) {
    const response = await this.userFindUseCase.perform({ id: user.id })

    return {
      user: {
        id: response.user.id,
        type: response.user.type,
        active: response.user.active,
        code: response.user.code,
        login: response.user.login,
        lastAccess: response.user.lastAccess,
        createdAt: response.user.createdAt,
        updatedAt: response.user.updatedAt,
        people: response.people
      }
    }
  }
}