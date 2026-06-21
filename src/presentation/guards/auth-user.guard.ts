import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthUserAuthorizationUseCase } from '@application/use-cases/auth/user/authorization.use-case'

@Injectable()
export class AuthUserGuard implements CanActivate {

  constructor(
    private readonly authUserAuthorizationUseCase: AuthUserAuthorizationUseCase
  ) { }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization || ''

    const { payload } = this.authUserAuthorizationUseCase.perform({ token })

    request.user = {
      id: payload.sub,
      code: payload.code,
      peopleId: payload.peopleId,
    }

    return true
  }
}
