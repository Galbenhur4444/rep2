import { supabase, type Session, type Slot } from './supabase'
import { addDays, iso } from './dates'

// אימון בשבוע: או שורה שמורה (sessions) או אימון "וירטואלי" מתוך משבצת קבועה
export type Item = Omit<Session, 'id'> & { id: string | null }

export async function loadWeek(start: Date) {
  const from = iso(start), to = iso(addDays(start, 6))
  const [{ data: slots }, { data: sessions }] = await Promise.all([
    supabase.from('workout_slots').select('*').order('time'),
    supabase.from('sessions').select('*').or(`and(date.gte.${from},date.lte.${to}),and(original_date.gte.${from},original_date.lte.${to})`),
  ])
  const saved = (sessions ?? []) as Session[]
  const items: Item[] = saved.filter(s => s.date >= from && s.date <= to)
  for (const slot of (slots ?? []) as Slot[]) {
    const date = iso(addDays(start, slot.weekday))
    if (saved.some(s => s.slot_id === slot.id && s.original_date === date)) continue
    items.push({
      id: null, couple_id: slot.couple_id, slot_id: slot.id, original_date: date, date,
      time: slot.time, duration_min: slot.duration_min, type: slot.type,
      together: slot.together, owner_id: slot.owner_id, status: 'planned',
    })
  }
  items.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  return { items, slots: (slots ?? []) as Slot[] }
}

// שומר שינוי באימון (סימון/הזזה). אימון וירטואלי הופך לשורה שמורה.
export async function saveItem(item: Item, patch: Partial<Session>) {
  if (item.id) return supabase.from('sessions').update(patch).eq('id', item.id)
  const { id: _id, ...rest } = item
  return supabase.from('sessions').insert({ ...rest, ...patch })
}
