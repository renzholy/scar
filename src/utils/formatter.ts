const numberFormat = Intl.NumberFormat()

export const formatNumber = numberFormat.format

export function formatBalance(value: string, factor: number) {
  if (factor === 0) {
    return value
  }
  if (factor >= value.length) {
    return `0.${value.padStart(factor, '0')}`
  }
  return `${value.slice(0, value.length - factor)}.${value.slice(value.length - factor)}`
}

export function formatTime(date: Date) {
  const offset = date.getTimezoneOffset()
  date = new Date(date.getTime() - offset * 60 * 1000)
  return date
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d{3}Z/, '')
}
