const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31536000],
  ['month', 2592000],
  ['week', 604800],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1],
]

export function formatRelativeTime(isoDate: string): string {
  const elapsed = (Date.now() - new Date(isoDate).getTime()) / 1000
  for (const [unit, seconds] of UNITS) {
    if (elapsed >= seconds) {
      return rtf.format(-Math.round(elapsed / seconds), unit)
    }
  }
  return rtf.format(0, 'second')
}
