import { Injectable } from '@nestjs/common'
import { z } from 'zod'
import { CriticalException } from '@shared/exceptions'
import { ValidatorException } from '@infrastructure/adapters/validator/exception.validator'
import { ValidatorService, ValidatorOptions } from '@domain/adapters/validator/validator.service'

@Injectable()
export class ZodValidatorServiceImplementation extends ValidatorService {

  validate<Schema extends z.ZodSchema>(schema: Schema, args: unknown, options?: ValidatorOptions): z.output<Schema> {
    const { success, data, error } = schema.safeParse(args)

    if (!success) {
      this.resolveValidateError(error, options)
    }

    return data as Schema
  }

  private resolveValidateError(err: any, options: ValidatorOptions = {}): never {
    if (!(err instanceof z.ZodError)) {
      if (options.debugLogError) {
        console.log(err)
      }

      throw new CriticalException(err.message)
    }

    const causes = err.issues.map(issue => ({
      message: issue.message,
      path: [...issue.path, ...(issue.code == 'custom' ? [] : [issue.code])],
    }))

    if (options.debugLogError) {
      console.log({
        issues: err.issues.map(({ path, ...rest }) => ({ ...rest, path: path.join(', ') })),
        causes: causes.map(({ path, ...rest }) => ({ ...rest, path: path.join(', ') }))
      })
    }

    throw new ValidatorException('Invalid data', { causes })
  }
}