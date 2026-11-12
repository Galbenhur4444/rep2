import { useState } from 'react'
import { useAuth } from '../auth'
import { supabase } from '../lib/supabase'
import { Button, Card, Input, Page } from '../ui'

export default function Me() {
  const { me, partner, inviteCode, reload } = useAuth()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  async function join() {
    setMsg('')
    const { data } = await supabase.rpc('join_couple', { code })
    if (!data) { setMsg('הקוד לא נמצא, או שהזוג כבר מלא'); return }
    await reload()
  }
  return (
    <Page title={me?.name || 'אני'}>
      <Card title="הזוג שלנו">
        {partner
          ? <p className="text-[19px]">מחובר/ת עם <b>{partner.name}</b> 💕</p>
          : <>
              <p className="text-[19px] mb-2">שלחו לבן/בת הזוג את הקוד:</p>
              <p className="text-[38px] font-extrabold tracking-[0.3em] text-center text-accent" dir="ltr">{inviteCode}</p>
              <p className="text-[15px] text-secondary mt-2">בהרשמה, הם בוחרים "קיבלתם קוד?" ומקלידים אותו.</p>
            </>}
      </Card>
      {!partner && <Card title="קיבלתם קוד מבן/בת הזוג?">
        <div className="flex gap-2">
          <Input placeholder="קוד הזמנה" dir="ltr" value={code} onChange={e => setCode(e.target.value)} className="uppercase tracking-widest text-center" />
          <Button variant="tinted" onClick={join} disabled={code.length < 4}>הצטרפות</Button>
        </div>
        {msg && <p className="text-[15px] text-red-500 mt-2">{msg}</p>}
      </Card>
      <Card title="בקרוב">
        <p className="text-secondary">מדדים, יעדים והגדרות שיתוף 🚧</p>
      </Card>
      <Button variant="tinted" onClick={() => supabase.auth.signOut()}>התנתקות</Button>
    </Page>
  )
}
