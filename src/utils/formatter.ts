export const formatNumber = Intl.NumberFormat()

export function formatBalance(value: string, factor: number) {
  if (factor === 0) {
    return value
  }
  if (factor >= value.length) {
    return `0.${value.padStart(factor, '0')}`
  }
  return `${value.slice(0, value.length - factor)}.${value.slice(value.length - factor)}`
}
