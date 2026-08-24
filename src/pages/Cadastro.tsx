import { useState, type FormEvent } from 'react'
import { ArrowRight, Eye, EyeOff, LoaderCircle, Lock, Mail, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { useLumenToast } from '@/contexts/ToastContext'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
type Fields = 'nome' | 'email' | 'senha' | 'confirmacao'
type Errors = Partial<Record<Fields, string>>

export default function Cadastro() {
  const { register } = useAuth()
  const { showToast } = useLumenToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmacao: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const validate = (field: Fields, value = form[field]) => {
    if (field === 'nome') return value.trim().length < 2 ? 'Informe seu nome.' : undefined
    if (field === 'email')
      return !value.trim()
        ? 'Informe seu e-mail.'
        : !emailRegex.test(value)
          ? 'Informe um e-mail válido.'
          : undefined
    if (field === 'senha')
      return value.length < 8 || !/[a-zA-ZÀ-ÿ]/.test(value) || !/\d/.test(value)
        ? 'A senha deve ter pelo menos 8 caracteres, com letras e números.'
        : undefined
    return value !== form.senha ? 'As senhas não coincidem.' : undefined
  }
  const strength =
    form.senha.length === 0
      ? 0
      : form.senha.length < 8
        ? 1
        : /[a-zA-ZÀ-ÿ]/.test(form.senha) &&
            /\d/.test(form.senha) &&
            /[^a-zA-ZÀ-ÿ\d]/.test(form.senha)
          ? 3
          : 2
  const update = (field: Fields, value: string) => {
    setForm((old) => ({ ...old, [field]: value }))
    if (errors[field]) setErrors((old) => ({ ...old, [field]: undefined }))
  }
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: Errors = {
      nome: validate('nome'),
      email: validate('email'),
      senha: validate('senha'),
      confirmacao: validate('confirmacao'),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      setShake(true)
      window.setTimeout(() => setShake(false), 450)
      return
    }
    setLoading(true)
    await register(form.nome, form.email, form.senha)
    showToast('Conta criada com sucesso! Faça login com suas credenciais.')
    navigate(`/?email=${encodeURIComponent(form.email)}`)
  }

  return (
    <AuthLayout headline="Comece a organizar suas finanças hoje.">
      <div className={shake ? 'animate-shake' : ''}>
        <div className="mb-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#10B981]">
            Sua jornada começa aqui
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-[#0F1E2E]">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm font-medium text-[#5B6B7C]">Leva menos de um minuto.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Field
            id="nome"
            label="Nome completo"
            icon={<UserRound size={18} />}
            value={form.nome}
            placeholder="Como podemos chamar você?"
            error={errors.nome}
            onChange={(v) => update('nome', v)}
            onBlur={() => setErrors((old) => ({ ...old, nome: validate('nome') }))}
          />
          <Field
            id="email"
            label="E-mail"
            type="email"
            icon={<Mail size={18} />}
            value={form.email}
            placeholder="voce@exemplo.com"
            error={errors.email}
            onChange={(v) => update('email', v)}
            onBlur={() => setErrors((old) => ({ ...old, email: validate('email') }))}
          />
          <div>
            <Field
              id="senha"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              icon={<Lock size={18} />}
              value={form.senha}
              placeholder="Mínimo de 8 caracteres"
              error={errors.senha}
              onChange={(v) => update('senha', v)}
              onBlur={() => setErrors((old) => ({ ...old, senha: validate('senha') }))}
              action={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="password-toggle"
                  aria-label="Alternar visibilidade da senha"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
            <div className="mt-2 flex gap-1.5">
              {[1, 2, 3].map((level) => (
                <span
                  key={level}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${strength >= level ? (strength === 1 ? 'bg-[#E5484D]' : strength === 2 ? 'bg-[#F5A524]' : 'bg-[#10B981]') : 'bg-slate-200'}`}
                />
              ))}
            </div>
            <p
              className={`mt-1 text-right text-[11px] font-bold ${strength === 1 ? 'text-[#E5484D]' : strength === 2 ? 'text-[#D88908]' : strength === 3 ? 'text-[#059669]' : 'text-slate-400'}`}
            >
              {strength === 1
                ? 'Fraca'
                : strength === 2
                  ? 'Média'
                  : strength === 3
                    ? 'Forte'
                    : 'Força da senha'}
            </p>
          </div>
          <Field
            id="confirmacao"
            label="Confirmar senha"
            type="password"
            icon={<Lock size={18} />}
            value={form.confirmacao}
            placeholder="Repita sua senha"
            error={errors.confirmacao}
            onChange={(v) => update('confirmacao', v)}
            onBlur={() => setErrors((old) => ({ ...old, confirmacao: validate('confirmacao') }))}
          />
          <Button disabled={loading} className="primary-button" type="submit">
            {loading ? (
              <>
                <LoaderCircle className="animate-spin-fast" />
                Criando...
              </>
            ) : (
              <>
                Criar conta
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm font-medium text-[#5B6B7C]">
          Já tem uma conta?{' '}
          <Link to="/" className="font-extrabold text-[#059669]">
            Entrar
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

function Field({
  id,
  label,
  icon,
  action,
  error,
  onChange,
  onBlur,
  ...props
}: {
  id: string
  label: string
  icon: React.ReactNode
  action?: React.ReactNode
  error?: string
  value: string
  placeholder: string
  type?: string
  onChange: (value: string) => void
  onBlur: () => void
}) {
  return (
    <div className="auth-field">
      <Label htmlFor={id}>{label}</Label>
      <div className="input-wrap mt-2">
        <span className="input-icon">{icon}</span>
        <Input
          id={id}
          {...props}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`${action ? 'pr-11' : ''} ${error ? 'input-error' : ''}`}
        />
        {action}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
