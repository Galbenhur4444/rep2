import { useAuth } from './auth'
import { hhmm } from './lib/dates'
import { saveItem, type Item } from './lib/workouts'
import { addDays, iso, parse } from './lib/dates'

export default function WorkoutCard({ item, onChange }: { item: Item; onChange: () => void }) {
  const { me, partner } = useAuth()
  const who = item.together ? 'ביחד 👫' : item.owner_id === me?.id ? 'רק אני' : partner?.name || 'בן/בת הזוג'
  const done = item.status === 'done'
  const moved = item.original_date && item.original_date !== item.date

  async function act(patch: Parameters<typeof saveItem>[1]) {
    await saveItem(item, patch)
    onChange()
  }

  return (
    <div className={`flex items-center gap-3 py-2 ${done ? 'opacity-60' : ''}`}>
      <div className="w-14 text-center">
        <div className="text-[19px] font-semibold tabular-nums">{hhmm(item.time)}</div>
        <div className="text-[14px] text-secondary">{item.duration_min} דק׳</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-[19px] font-semibold ${done ? 'line-through' : ''}`}>{item.type}</div>
        <div className="text-[15px] text-secondary">{who}{moved ? ' · הוזז' : ''}</div>
      </div>
      {done ? (
        <button onClick={() => act({ status: 'planned' })} className="min-h-[44px] px-3 text-[17px] text-secondary">ביטול</button>
      ) : (
        <div className="flex gap-1">
          <button aria-label="הזז למחר" onClick={() => act({ date: iso(addDays(parse(item.date), 1)) })}
            className="min-h-[44px] min-w-[44px] rounded-full bg-soft text-[15px] font-semibold px-3">מחר ↩</button>
          <button aria-label="התאמנתי" onClick={() => act({ status: 'done' })}
            className="min-h-[44px] min-w-[44px] rounded-full bg-accent text-white text-xl">✓</button>
        </div>
      )}
    </div>
  )
}
