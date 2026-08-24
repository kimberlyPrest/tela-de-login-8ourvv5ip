import { useEffect, useState, type FormEvent } from 'react'
import { AlertCircle, ArrowRight, Check, Eye, EyeOff, LoaderCircle, Lock, Mail } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

type Errors = { email?: string; senha?: string }
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Index() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const initialEmail = new URLSearchParams(location.search).get('email') ?? ''
  const [email, setEmail] = useState(initialEmail)
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [authError, setAuthError] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail)
  }, [initialEmail])
  if (user) return <Navigate to="/inicio" replace />

  const validateEmail = (value: string) =>
    !value.trim()
      ? 'Informe seu e-mail.'
      : !emailRegex.test(value)
        ? 'Informe um e-mail válido.'
        : undefined
  const validatePassword = (value: string) =>
    !value
      ? 'Informe sua senha.'
      : value.length < 6
        ? 'A senha deve ter pelo menos 6 caracteres.'
        : undefined
  const triggerShake = () => {
    setShake(false)
    window.requestAnimationFrame(() => setShake(true))
    window.setTimeout(() => setShake(false), 450)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = { email: validateEmail(email), senha: validatePassword(senha) }
    setErrors(nextErrors)
    setAuthError(false)
    if (nextErrors.email || nextErrors.senha) {
      triggerShake()
      return
    }
    setStatus('loading')
    const ok = await login(email, senha)
    if (!ok) {
      setStatus('idle')
      setAuthError(true)
      triggerShake()
      return
    }
    setStatus('success')
    window.setTimeout(() => navigate('/inicio'), 800)
  }

  return (
    <AuthLayout>
      <div className={shake ? 'animate-shake' : ''}>
        <div className="mb-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#10B981]">
            Bem-vindo de volta
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-[#0F1E2E]">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-sm font-medium text-[#5B6B7C]">
            Sua vida financeira, mais clara a cada acesso.
          </p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="auth-field fade-item">
            <Label htmlFor="email">E-mail</Label>
            <div className="input-wrap mt-2">
              <Mail className="input-icon" size={18} />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((old) => ({ ...old, email: undefined }))
                }}
                onBlur={() => setErrors((old) => ({ ...old, email: validateEmail(email) }))}
                placeholder="voce@exemplo.com"
                className={errors.email ? 'input-error' : ''}
              />
            </div>
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
          <div className="auth-field fade-item">
            <Label htmlFor="senha">Senha</Label>
            <div className="input-wrap mt-2">
              <Lock className="input-icon" size={18} />
              <Input
                id="senha"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value)
                  if (errors.senha) setErrors((old) => ({ ...old, senha: undefined }))
                }}
                onBlur={() => setErrors((old) => ({ ...old, senha: validatePassword(senha) }))}
                placeholder="••••••••"
                className={`pr-11 ${errors.senha ? 'input-error' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="password-toggle"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.senha && <p className="field-error">{errors.senha}</p>}
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex cursor-pointer items-center gap-2 font-semibold text-[#5B6B7C]">
              <Checkbox
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked === true)}
                className="h-5 w-5 rounded-md border-[#CBD5E1] data-[state=checked]:border-[#10B981] data-[state=checked]:bg-[#10B981]"
              />
              Lembrar de mim
            </label>
            <Link
              to={`/recuperar-senha?email=${encodeURIComponent(email)}`}
              className="font-bold text-[#059669] hover:text-[#047857]"
            >
              Esqueceu a senha?
            </Link>
          </div>
          {authError && (
            <div className="flex gap-2 rounded-xl border border-[#F5C6C7] bg-[#FDECEC] p-3 text-sm font-semibold leading-5 text-[#B4232A]">
              <AlertCircle className="mt-0.5 shrink-0" size={17} />
              Credenciais inválidas. Verifique seu e-mail e senha.
            </div>
          )}
          <Button
            disabled={status !== 'idle'}
            className={`primary-button ${status === 'success' ? 'bg-[#047857]' : ''}`}
            type="submit"
          >
            {status === 'loading' ? (
              <>
                <LoaderCircle className="animate-spin-fast" />
                Entrando...
              </>
            ) : status === 'success' ? (
              <>
                <Check className="success-check" />
                Conectado!
              </>
            ) : (
              <>
                Entrar
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
        <p className="mt-7 text-center text-sm font-medium text-[#5B6B7C]">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="font-extrabold text-[#059669] hover:text-[#047857]">
            Cadastre-se
          </Link>
        </p>
        <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-center text-xs font-semibold leading-5 text-slate-500">
          Demonstração: use <strong className="text-slate-700">demo@lumen.app</strong> com a senha{' '}
          <strong className="text-slate-700">demo123</strong>.
        </div>
      </div>
    </AuthLayout>
  )
}
