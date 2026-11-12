import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { Button, Card, Input, Segmented } from '../ui'

export default function Login() {
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true); setError('')
    const res = mode === 'up'
      ? await supabase.auth.signUp({ email, password, options: { data: { name } } })
      : await supabase.auth.signInWithPassword({ email, password })
    if (res.error) setError(translate(res.error.message))
    setBusy(false)
  }

  return (
    <main className="min-h-full flex flex-col justify-center px-6 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="text-7xl font-black text-accent">rep²</div>
        <p className="text-secondary mt-2">אימונים ואוכל, לשנינו</p>
      </div>
      <Card>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <Segmented value={mode} onChange={setMode} options={[{ value: 'in', label: 'התחברות' }, { value: 'up', label: 'הרשמה' }]} />
          {mode === 'up' && <Input placeholder="שם" value={name} onChange={e => setName(e.target.value)} required />}
          <Input type="email" placeholder="אימייל" dir="ltr" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input type="password" placeholder="סיסמה (6 תווים לפחות)" dir="ltr" autoComplete={mode === 'up' ? 'new-password' : 'current-password'} minLength={6} value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p className="text-[17px] text-red-500">{error}</p>}
          <Button disabled={busy}>{mode === 'up' ? 'יצירת חשבון' : 'כניסה'}</Button>
        </form>
      </Card>
    </main>
  )
}

function translate(msg: string) {
  if (msg.includes('Invalid login')) return 'אימייל או סיסמה שגויים'
  if (msg.includes('already registered')) return 'המייל הזה כבר רשום. נסו להתחבר.'
  if (msg.includes('Email not confirmed')) return 'צריך לאשר את המייל קודם (בדקו בתיבת הדואר)'
  return msg
}
