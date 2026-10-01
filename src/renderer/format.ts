export function formatPrice(value: number, currency: string): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(value)
}