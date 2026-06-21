export function formatCPF(value: string) {
  return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
}

export function formatCNPJ(value: string) {
  return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

export function validateFormatCPF(value: string) {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)
}

export function validateFormatCNPJ(value: string) {
  return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value)
}