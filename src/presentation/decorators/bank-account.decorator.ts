import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const BankAccount = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()

    return request.bankAccount || null
  },
)