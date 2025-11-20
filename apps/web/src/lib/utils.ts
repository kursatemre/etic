export function formatCurrency(amount: number, currency: string = 'TRY'): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function getMultiLanguageValue(value: any, lang: string = 'tr'): string {
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[lang] || value['tr'] || value['en'] || ''
  }
  return ''
}
