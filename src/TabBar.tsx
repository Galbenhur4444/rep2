import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'היום', icon: '☀️' },
  { to: '/workouts', label: 'אימונים', icon: '🏋️' },
  { to: '/food', label: 'אוכל', icon: '🍽️' },
  { to: '/shopping', label: 'קניות', icon: '🛒' },
  { to: '/me', label: 'אני', icon: '👤' },
]

export default function TabBar() {
  return (
    <nav className="fixed bottom-0 inset-x-0 border-t border-separator bg-card/80 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <ul className="flex justify-around">
        {tabs.map(t => (
          <li key={t.to} className="flex-1">
            <NavLink
              to={t.to}
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 pt-2 pb-1 min-h-[52px] text-[10px] font-medium ${isActive ? 'text-accent' : 'text-secondary'}`
              }
            >
              <span className="text-2xl leading-none">{t.icon}</span>
              {t.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
