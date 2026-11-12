import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react'

export function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="px-4 max-w-xl mx-auto">
      <h1 className="text-[38px] font-extrabold tracking-tight pt-3 pb-4">{title}</h1>
      <div className="flex flex-col gap-4">{children}</div>
    </main>
  )
}

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="bg-card rounded-2xl p-4">
      {title && <h2 className="text-[15px] font-semibold text-secondary mb-2">{title}</h2>}
      {children}
    </section>
  )
}

export function Button({ variant = 'primary', className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'plain' | 'tinted' }) {
  const v = {
    primary: 'bg-accent text-white',
    tinted: 'bg-accent/15 text-accent',
    plain: 'text-accent',
  }[variant]
  return <button {...p} className={`min-h-[44px] px-4 rounded-xl text-[19px] font-semibold active:opacity-60 disabled:opacity-40 ${v} ${className}`} />
}

export function Input(p: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={`w-full min-h-[44px] px-3 rounded-xl bg-soft text-[19px] outline-none focus:ring-2 focus:ring-accent/40 ${p.className ?? ''}`} />
}

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex bg-soft rounded-xl p-0.5">
      {options.map(o => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)}
          className={`flex-1 min-h-[36px] rounded-[10px] text-[17px] font-semibold ${value === o.value ? 'bg-card shadow-sm' : 'text-secondary'}`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
