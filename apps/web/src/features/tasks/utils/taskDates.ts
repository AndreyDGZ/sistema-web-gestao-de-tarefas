export function formatDisplayDate(isoDate: string) {
  if (!isoDate) {
    return 'Sem prazo'
  }

  const [year, month, day] = isoDate.split('-')

  if (!year || !month || !day) {
    return 'Sem prazo'
  }

  return `${day}.${month}.${year}`
}
