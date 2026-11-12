import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth'
import { Button, Card, Input, Page } from '../ui'

export default function Onboarding() {
  const { me, reload } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  async function create() {
    await supabase.rpc('create_couple')
    await reload()
  }
  async function join() {
    setError('')
    const { data } = await supabase.rpc('join_couple', { code })
    if (!data) { setError('הקוד לא נמצא, או שהזוג כבר מלא'); return }
    await reload()
  }

  return (
    <Page title={`היי ${me?.name || ''} 👋`}>
      <Card title="מתחילים זוג חדש">
        <p className="text-[15px] text-secondary mb-3">תקבלו קוד לשלוח לבן או לבת הזוג.</p>
        <Button className="w-full" onClick={create}>יצירת זוג</Button>
      </Card>
      <Card title="קיבלתם קוד?">
        <div className="flex gap-2">
          <Input placeholder="קוד הזמנה" dir="ltr" value={code} onChange={e => setCode(e.target.value)} className="uppercase tracking-widest text-center" />
          <Button variant="tinted" onClick={join} disabled={code.length < 4}>הצטרפות</Button>
        </div>
        {error && <p className="text-[15px] text-red-500 mt-2">{error}</p>}
      </Card>
    </Page>
  )
}
