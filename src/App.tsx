import { Routes, Route, Navigate } from 'react-router-dom'
import TabBar from './TabBar'
import Today from './pages/Today'
import Workouts from './pages/Workouts'
import Food from './pages/Food'
import Shopping from './pages/Shopping'
import Me from './pages/Me'

export default function App() {
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
