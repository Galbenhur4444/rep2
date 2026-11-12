import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth'
import TabBar from './TabBar'
import Today from './pages/Today'
import Workouts from './pages/Workouts'
import Food from './pages/Food'
import Shopping from './pages/Shopping'
import Me from './pages/Me'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'

export default function App() {
  const { session, me, loading } = useAuth()

  if (loading) return <div className="min-h-full flex items-center justify-center text-5xl font-extrabold text-accent">rep²</div>
  if (!session) return <Login />
  if (!me?.couple_id) return <div className="pt-[env(safe-area-inset-top)]"><Onboarding /></div>

  return (
    <div className="min-h-full pb-[calc(84px+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/food" element={<Food />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/me" element={<Me />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <TabBar />
    </div>
  )
}
