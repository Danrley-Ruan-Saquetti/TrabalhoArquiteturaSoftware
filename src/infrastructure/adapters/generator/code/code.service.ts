import { Injectable, Scope } from '@nestjs/common'
import { CodeGeneratorService, CodeGeneratorOptions } from '@domain/adapters/generator/code/code.service'

@Injectable({ scope: Scope.REQUEST })
export class CodeGeneratorServiceImplementation extends CodeGeneratorService {

  private options: CodeGeneratorOptions = {
    prefix: '',
    suffix: '',
    length: 8,
    charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  }

  constructor() {
    super()
  }

  generate(): string {
    const randomPart = Array.from({ length: this.options.length }, () =>
      this.options.charset.charAt(Math.floor(Math.random() * this.options.charset.length))
    ).join('')

    return `${this.options.prefix}${randomPart}${this.options.suffix}`
  }

  setPrefix(prefix: string) {
    this.options.prefix = prefix
  }

  setSuffix(suffix: string) {
    this.options.suffix = suffix
  }

  setLength(length: number) {
    this.options.length = length
  }

  setCharset(charset: string) {
    this.options.charset = charset
  }
}