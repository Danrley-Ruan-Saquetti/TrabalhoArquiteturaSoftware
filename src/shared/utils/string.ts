export function extractDigits(value: string) {
  return value.replace(/[^\d]+/g, '')
}