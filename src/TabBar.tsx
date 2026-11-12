import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

// אייקוני קו נקיים (בסגנון Lucide), בלי ספרייה חיצונית
const icons: Record<string, ReactNode> = {
  today: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></>,
  workouts: <><path d="M14.4 14.4 9.6 9.6" /><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" /><path d="m21.5 21.5-1.4-1.4M3.9 3.9 2.5 2.5" /><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" /></>,
  food: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></>,
  shopping: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></>,
  me: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
}

const tabs = [
  { to: '/', label: 'היום', icon: 'today' },
  { to: '/workouts', label: 'אימונים', icon: 'workouts' },
  { to: '/food', label: 'אוכל', icon: 'food' },
  { to: '/shopping', label: 'קניות', icon: 'shopping' },
  { to: '/me', label: 'אני', icon: 'me' },
]

export default function TabBar() {
  return (
    <nav className="fixed bottom-0 inset-x-0 border-t border-separator bg-card/85 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <ul className="flex justify-around max-w-xl mx-auto">
        {tabs.map(t => (
          <li key={t.to} className="flex-1">
            <NavLink to={t.to} end
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 pt-2 pb-1.5 min-h-[56px] text-[12px] font-bold transition-colors ${isActive ? 'text-accent' : 'text-secondary'}`}>
              {({ isActive }) => (
                <>
                  <span className={`flex items-center justify-center w-14 h-8 rounded-full transition-all ${isActive ? 'bg-soft scale-105' : ''}`}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
                      strokeWidth={isActive ? 2.3 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {icons[t.icon]}
                    </svg>
                  </span>
                  {t.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
