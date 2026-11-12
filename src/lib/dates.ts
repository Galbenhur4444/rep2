export const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

export function iso(d: Date) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
export function parse(s: string) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
export function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x }
export function weekStart(d = new Date()) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); return addDays(x, -x.getDay()) }
export function hhmm(t: string) { return t.slice(0, 5) }
export function shortDate(s: string) { const d = parse(s); return `${d.getDate()}.${d.getMonth() + 1}` }
