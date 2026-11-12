import { useAuth } from '../auth'
import { supabase } from '../lib/supabase'
import { Button, Card, Page } from '../ui'

export default function Me() {
  const { me, partner, inviteCode } = useAuth()
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
      <Card title="בקרוב">
        <p className="text-secondary">מדדים, יעדים והגדרות שיתוף 🚧</p>
      </Card>
      <Button variant="tinted" onClick={() => supabase.auth.signOut()}>התנתקות</Button>
    </Page>
  )
}
