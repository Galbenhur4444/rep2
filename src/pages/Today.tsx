import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import { iso, weekStart, addDays, DAYS, parse } from '../lib/dates'
import { loadWeek, type Item } from '../lib/workouts'
import { Card, Page } from '../ui'
import WorkoutCard from '../WorkoutCard'

export default function Today() {
  const { me } = useAuth()
  const [items, setItems] = useState<Item[]>([])

  const refresh = useCallback(async () => {
    const s = weekStart()
    const [a, b] = await Promise.all([loadWeek(s), loadWeek(addDays(s, 7))])
    setItems([...a.items, ...b.items])
  }, [])
  useEffect(() => { refresh() }, [refresh])

  const today = iso(new Date())
  const todays = items.filter(i => i.date === today)
  const next = items.find(i => i.date > today && i.status === 'planned')
  const weekDone = items.filter(i => i.date <= iso(addDays(weekStart(), 6)) && i.status === 'done').length

  return (
    <Page title={`בוקר טוב ${me?.name ?? ''}`}>
      <Card title="האימונים של היום">
        {todays.length
          ? <div className="divide-y divide-separator">{todays.map(it => <WorkoutCard key={(it.id ?? it.slot_id) + it.date} item={it} onChange={refresh} />)}</div>
          : <p className="text-[19px]">אין אימון היום 😌</p>}
      </Card>
      {next && (
        <Card title="הבא בתור">
          <p className="text-[19px]">{next.type} · יום {DAYS[parse(next.date).getDay()]} {next.time.slice(0, 5)}</p>
        </Card>
      )}
      <Card title="השבוע">
        <p className="text-[34px] font-extrabold">{weekDone} 🔥</p>
        <p className="text-[17px] text-secondary">אימונים שבוצעו השבוע</p>
      </Card>
      <Link to="/workouts" className="text-accent text-[19px] text-center py-2">לכל האימונים ←</Link>
    </Page>
  )
}
