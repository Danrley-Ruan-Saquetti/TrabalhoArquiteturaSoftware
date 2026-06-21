export type TemplateGeneratorOptions = {}

export abstract class TemplateGeneratorService {

  abstract generate(template: string, variables?: Record<string, any>, options?: TemplateGeneratorOptions): string
}