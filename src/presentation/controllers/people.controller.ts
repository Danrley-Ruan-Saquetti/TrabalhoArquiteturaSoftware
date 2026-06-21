import { Body, Controller, Put, UseGuards } from '@nestjs/common'
import { User } from '@presentation/decorators/user.decorator'
import { UserSession } from '@presentation/types/user-session.type'
import { AuthUserGuard } from '@presentation/guards/auth-user.guard'
import { PeopleUpdateUseCase } from '@application/use-cases/people/update.use-case'

@Controller('/peoples')
export class PeopleController {

  constructor(
    private readonly peopleUpdateUseCase: PeopleUpdateUseCase
  ) { }

  @UseGuards(AuthUserGuard)
  @Put('/update')
  async update(@Body() body: any, @User() user: UserSession) {
    await this.peopleUpdateUseCase.perform({ ...body, id: user.peopleId })

    return { message: 'People successfully updated' }
  }
}