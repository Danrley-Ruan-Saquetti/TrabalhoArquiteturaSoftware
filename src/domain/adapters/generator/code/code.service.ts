export type CodeGeneratorOptions = {
  prefix: string
  suffix: string
  length: number
  charset: string
}

export abstract class CodeGeneratorService {

  abstract generate(): string
  abstract setPrefix(prefix: string): void
  abstract setSuffix(suffix: string): void
  abstract setLength(length: number): void
  abstract setCharset(charset: string): void
}