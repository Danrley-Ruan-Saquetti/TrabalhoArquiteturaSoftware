import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { User } from '@presentation/decorators/user.decorator'
import { UserSession } from '@presentation/types/user-session.type'
import { AuthUserGuard } from '@presentation/guards/auth-user.guard'
import { AuthBankAccountSignInUseCase } from '@application/use-cases/auth/bank-account/sign-in.use-case'
import { SendEmailNotificationBankAccountLoggedInListener } from '@application/observer/listeners/send-email-notification-bank-account-logged-in.listener'

@Controller('/auth/bank-account')
export class AuthBankAccountController {

  constructor(
    private readonly authBankAccountSignInUseCase: AuthBankAccountSignInUseCase,
    private readonly sendEmailNotificationBankAccountLoggedInListener: SendEmailNotificationBankAccountLoggedInListener,

  ) { }

  @UseGuards(AuthUserGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/sign-in')
  async signIn(@Body() body: any, @User() user: UserSession) {
    this.authBankAccountSignInUseCase.observer.subscribe(
      'events.auth.bank-account.sign-in',
      this.sendEmailNotificationBankAccountLoggedInListener
    )

    const response = await this.authBankAccountSignInUseCase.perform({ ...body, peopleId: user.peopleId })

    return { token: response.token }
  }
}