import { Route, Routes } from 'react-router-dom'
import Cadastro from './pages/Cadastro'
import Descanso from './pages/Descanso'
import Home from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Descanso />} />
      <Route path="/inicio" element={<Home />} />
      <Route path="/cadastro" element={<Cadastro />} />
    </Routes>
  )
}
