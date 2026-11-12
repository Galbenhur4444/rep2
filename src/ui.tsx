import type { ReactNode } from 'react'

export function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="px-4">
      <h1 className="text-[34px] font-bold tracking-tight pt-3 pb-4">{title}</h1>
      <div className="flex flex-col gap-4">{children}</div>
    </main>
  )
}

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="bg-card rounded-2xl p-4">
      {title && <h2 className="text-[13px] font-semibold text-secondary uppercase mb-2">{title}</h2>}
      {children}
    </section>
  )
}
