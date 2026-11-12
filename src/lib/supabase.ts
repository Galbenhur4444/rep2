import { createClient } from '@supabase/supabase-js'

// המפתחות האלה ציבוריים בכוונה. האבטחה האמיתית היא ב-RLS שבמסד הנתונים.
const URL = 'https://ffpnprpnwztuckouviqq.supabase.co'
const KEY = 'sb_publishable_EhfKNFugYzMq-NnJ20p4DA_Ch0kOxrk'

export const supabase = createClient(URL, KEY)

export type Profile = { id: string; couple_id: string | null; name: string }
export type Slot = {
  id: string; couple_id: string; weekday: number; time: string; duration_min: number
  type: string; together: boolean; owner_id: string | null
}
export type Session = {
  id: string; couple_id: string; slot_id: string | null; original_date: string | null
  date: string; time: string; duration_min: number; type: string; together: boolean
  owner_id: string | null; status: 'planned' | 'done' | 'skipped'
}
