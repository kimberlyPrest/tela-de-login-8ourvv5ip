import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type User = { nome: string; email: string }
type StoredAccount = User & { senha: string }
type AuthContextValue = {
  user: User | null
  login: (email: string, senha: string) => Promise<boolean>
  register: (nome: string, email: string, senha: string) => Promise<void>
  logout: () => void
}

const SESSION_KEY = 'lumen.auth'
const ACCOUNT_KEY = 'lumen.account'

const AuthContext = createContext<AuthContextValue | null>(null)

function getStoredUser(): User | null {
  try {
    const value = localStorage.getItem(SESSION_KEY)
    return value ? (JSON.parse(value) as User) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser)

  // A autenticação simulada pode ser substituída por Supabase ou Skip Cloud sem alterar a UI.
  const login = async (email: string, senha: string) => {
    await new Promise((resolve) => window.setTimeout(resolve, 1400))
    const normalizedEmail = email.trim().toLowerCase()
    let registered: StoredAccount | null = null
    try {
      const value = localStorage.getItem(ACCOUNT_KEY)
      registered = value ? (JSON.parse(value) as StoredAccount) : null
    } catch {
      registered = null
    }

    const isDemo = normalizedEmail === 'demo@lumen.app' && senha === 'demo123'
    const isRegistered =
      registered?.email.toLowerCase() === normalizedEmail && registered.senha === senha
    if (!isDemo && !isRegistered) return false

    const nextUser = isDemo
      ? { nome: 'Visitante', email: normalizedEmail }
      : { nome: registered!.nome, email: registered!.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
    return true
  }

  const register = async (nome: string, email: string, senha: string) => {
    await new Promise((resolve) => window.setTimeout(resolve, 1200))
    const account: StoredAccount = { nome: nome.trim(), email: email.trim().toLowerCase(), senha }
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account))
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
