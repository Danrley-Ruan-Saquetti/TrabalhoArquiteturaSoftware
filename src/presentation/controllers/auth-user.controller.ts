import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthUserSignInUseCase } from '@application/use-cases/auth/user/sign-in.use-case'
import { CreatePeopleAndUserUseCase } from '@application/use-cases/shared/create-people-user.use-case'
import { SendEmailNotificationUserCreatedListener } from '@application/observer/listeners/send-email-notification-user-created.listener'
import { SendEmailNotificationUserLoggedInListener } from '@application/observer/listeners/send-email-notification-user-logged-in.listener'
import { UserType } from '@domain/enums/user.enum'

@Controller('/auth/user')
export class AuthUserController {

  constructor(
    private readonly createPeopleAndUserUseCase: CreatePeopleAndUserUseCase,
    private readonly authUserSignInUseCase: AuthUserSignInUseCase,
    private readonly sendEmailNotificationUserLoggedInListener: SendEmailNotificationUserLoggedInListener,
    private readonly sendEmailNotificationUserCreatedListener: SendEmailNotificationUserCreatedListener,
  ) {
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/sign-up')
  async signUp(@Body() body: any) {
    this.createPeopleAndUserUseCase.observerCreateUser.subscribe(
      'events.user.created',
      this.sendEmailNotificationUserCreatedListener
    )

    await this.createPeopleAndUserUseCase.perform({
      people: {
        ...body,
      },
      user: {
        ...body,
        type: UserType.CLIENT
      }
    })

    return { message: 'User successfully created' }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/sign-in')
  async signIn(@Body() body: any) {
    this.authUserSignInUseCase.observer.subscribe(
      'events.auth.user.sign-in',
      this.sendEmailNotificationUserLoggedInListener
    )

    const response = await this.authUserSignInUseCase.perform({ ...body, type: UserType.CLIENT })

    return { token: response.token }
  }
}