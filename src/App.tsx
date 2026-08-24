import { Navigate, Route, Routes } from 'react-router-dom'
import Index from '@/pages/Index'
import Cadastro from '@/pages/Cadastro'
import RecuperarSenha from '@/pages/RecuperarSenha'
import Inicio from '@/pages/Inicio'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
