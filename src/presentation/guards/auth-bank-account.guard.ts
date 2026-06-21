
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthBankAccountAuthorizationUseCase } from '@application/use-cases/auth/bank-account/authorization.use-case'

@Injectable()
export class AuthBankAccountGuard implements CanActivate {

  constructor(
    private readonly authBankAccountAuthorizationUseCase: AuthBankAccountAuthorizationUseCase
  ) { }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const token = request.headers['authorizationbankaccount'] || ''

    const { payload } = this.authBankAccountAuthorizationUseCase.perform({ token })

    request.bankAccount = {
      id: payload.sub,
      code: payload.code,
    }

    return true
  }
}
