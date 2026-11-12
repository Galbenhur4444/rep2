import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../auth'
import { supabase, type Slot } from '../lib/supabase'
import { DAYS, addDays, hhmm, iso, shortDate, weekStart } from '../lib/dates'
import { loadWeek, type Item } from '../lib/workouts'
import { Button, Card, Input, Page, Segmented } from '../ui'
import WorkoutCard from '../WorkoutCard'

export default function Workouts() {
  const { me } = useAuth()
  const [start, setStart] = useState(weekStart())
  const [items, setItems] = useState<Item[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [adding, setAdding] = useState(false)

  const refresh = useCallback(async () => {
    const r = await loadWeek(start)
    setItems(r.items); setSlots(r.slots)
  }, [start])
  useEffect(() => { refresh() }, [refresh])

  const today = iso(new Date())
  const doneCount = items.filter(i => i.status === 'done').length

  return (
    <Page title="אימונים">
      <div className="flex items-center justify-between">
        <Button variant="plain" onClick={() => setStart(addDays(start, -7))}>→ קודם</Button>
        <div className="text-center">
          <div className="text-[17px] font-semibold">{shortDate(iso(start))} – {shortDate(iso(addDays(start, 6)))}</div>
          <div className="text-[15px] text-secondary">{doneCount} מתוך {items.length} בוצעו</div>
        </div>
        <Button variant="plain" onClick={() => setStart(addDays(start, 7))}>הבא ←</Button>
      </div>

      {DAYS.map((day, i) => {
        const date = iso(addDays(start, i))
        const list = items.filter(it => it.date === date)
        if (!list.length) return null
        return (
          <Card key={date} title={`${day} · ${shortDate(date)}${date === today ? ' · היום' : ''}`}>
            <div className="divide-y divide-separator">
              {list.map(it => <WorkoutCard key={(it.id ?? it.slot_id) + it.date} item={it} onChange={refresh} />)}
            </div>
          </Card>
        )
      })}
      {!items.length && <Card><p className="text-secondary">אין אימונים השבוע. הוסיפו משבצת קבועה 👇</p></Card>}

      {adding
        ? <AddForm meId={me!.id} coupleId={me!.couple_id!} start={start} onDone={() => { setAdding(false); refresh() }} />
        : <Button onClick={() => setAdding(true)}>+ הוספת אימון</Button>}

      {slots.length > 0 && (
        <Card title="המשבצות הקבועות שלנו">
          <div className="divide-y divide-separator">
            {slots.map(s => (
              <div key={s.id} className="flex items-center py-2 gap-2">
                <div className="flex-1 text-[17px]">
                  {DAYS[s.weekday]} {hhmm(s.time)} · {s.type} · {s.together ? 'ביחד' : 'לבד'}
                </div>
                <button className="min-h-[44px] px-2 text-[17px] text-red-500"
                  onClick={async () => { if (confirm('למחוק את המשבצת הקבועה?')) { await supabase.from('workout_slots').delete().eq('id', s.id); refresh() } }}>
                  מחיקה
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </Page>
  )
}

function AddForm({ meId, coupleId, start, onDone }: { meId: string; coupleId: string; start: Date; onDone: () => void }) {
  const [kind, setKind] = useState<'fixed' | 'once'>('fixed')
  const [weekday, setWeekday] = useState(new Date().getDay())
  const [time, setTime] = useState('19:00')
  const [duration, setDuration] = useState(60)
  const [type, setType] = useState('סטודיו')
  const [together, setTogether] = useState<'yes' | 'no'>('yes')

  async function submit(e: FormEvent) {
    e.preventDefault()
    const base = { couple_id: coupleId, time, duration_min: duration, type, together: together === 'yes', owner_id: meId }
    if (kind === 'fixed') await supabase.from('workout_slots').insert({ ...base, weekday })
    else await supabase.from('sessions').insert({ ...base, date: iso(addDays(start, weekday)) })
    onDone()
  }

  return (
    <Card title="אימון חדש">
      <form onSubmit={submit} className="flex flex-col gap-3">
        <Segmented value={kind} onChange={setKind} options={[{ value: 'fixed', label: 'קבוע כל שבוע' }, { value: 'once', label: 'חד־פעמי' }]} />
        <div className="flex flex-wrap gap-1">
          {DAYS.map((d, i) => (
            <button type="button" key={d} onClick={() => setWeekday(i)}
              className={`min-h-[40px] px-3 rounded-full text-[17px] ${weekday === i ? 'bg-accent text-white' : 'bg-soft'}`}>{d}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input type="time" value={time} onChange={e => setTime(e.target.value)} required />
          <Input type="number" min={10} step={5} value={duration} onChange={e => setDuration(+e.target.value)} aria-label="משך בדקות" />
        </div>
        <Input placeholder="סוג (סטודיו, ריצה, פילאטיס...)" value={type} onChange={e => setType(e.target.value)} required />
        <Segmented value={together} onChange={setTogether} options={[{ value: 'yes', label: 'ביחד 👫' }, { value: 'no', label: 'רק אני' }]} />
        <div className="flex gap-2">
          <Button type="button" variant="tinted" className="flex-1" onClick={onDone}>ביטול</Button>
          <Button className="flex-1">שמירה</Button>
        </div>
      </form>
    </Card>
  )
}
