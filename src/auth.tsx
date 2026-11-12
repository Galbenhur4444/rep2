import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { Session as AuthSession } from '@supabase/supabase-js'
import { supabase, type Profile } from './lib/supabase'

type Ctx = {
  session: AuthSession | null
  me: Profile | null
  partner: Profile | null
  inviteCode: string | null
  loading: boolean
  reload: () => Promise<void>
}

const AuthCtx = createContext<Ctx>(null as unknown as Ctx)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [me, setMe] = useState<Profile | null>(null)
  const [partner, setPartner] = useState<Profile | null>(null)
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setSession(session)
    if (!session) { setMe(null); setPartner(null); setLoading(false); return }
    const { data: profiles } = await supabase.from('profiles').select('id, couple_id, name')
    const mine = profiles?.find(p => p.id === session.user.id) ?? null
    setMe(mine)
    setPartner(profiles?.find(p => p.id !== session.user.id) ?? null)
    if (mine?.couple_id) {
      const { data } = await supabase.from('couples').select('invite_code').single()
      setInviteCode(data?.invite_code ?? null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    reload()
    const { data } = supabase.auth.onAuthStateChange(() => { reload() })
    return () => data.subscription.unsubscribe()
  }, [reload])

  return (
    <AuthCtx.Provider value={{ session, me, partner, inviteCode, loading, reload }}>
      {children}
    </AuthCtx.Provider>
  )
}
