import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, LoaderCircle, Mail } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export default function RecuperarSenha() {
  const [params] = useSearchParams()
  const [email, setEmail] = useState(params.get('email') ?? '')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const validate = () =>
    !email.trim()
      ? 'Informe seu e-mail.'
      : !emailRegex.test(email)
        ? 'Informe um e-mail válido.'
        : undefined
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const next = validate()
    setError(next)
    if (next) return
    setLoading(true)
    await new Promise((resolve) => window.setTimeout(resolve, 1200))
    setSent(true)
    setLoading(false)
  }

  return (
    <AuthLayout headline="Recupere o acesso à sua conta.">
      <Link
        to="/"
        className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#5B6B7C] transition-colors hover:text-[#059669]"
      >
        <ArrowLeft size={17} />
        Voltar para o login
      </Link>
      {sent ? (
        <div className="fade-item py-4 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ECFDF5] text-[#10B981]">
            <Check size={38} strokeWidth={2.5} className="success-check" />
          </span>
          <h2 className="mt-6 text-2xl font-extrabold tracking-[-0.02em] text-[#0F1E2E]">
            Confira seu e-mail
          </h2>
          <p className="mt-3 text-sm font-medium leading-6 text-[#5B6B7C]">
            Enviamos um link de recuperação para <strong className="text-[#0F1E2E]">{email}</strong>
            .
          </p>
          <p className="mt-2 text-xs font-medium text-slate-400">
            Esta é uma demonstração; nenhum e-mail real foi enviado.
          </p>
          <Button asChild className="primary-button mt-7">
            <Link to="/">
              Voltar para o login
              <ArrowRight />
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#10B981]">
              Recuperação de senha
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-[#0F1E2E]">
              Vamos ajudar você
            </h2>
            <p className="mt-2 text-sm font-medium leading-6 text-[#5B6B7C]">
              Informe seu e-mail e enviaremos as instruções para redefinir sua senha.
            </p>
          </div>
          <form onSubmit={submit} noValidate>
            <div className="auth-field">
              <Label htmlFor="recovery-email">E-mail</Label>
              <div className="input-wrap mt-2">
                <Mail className="input-icon" size={18} />
                <Input
                  id="recovery-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setError(undefined)
                  }}
                  onBlur={() => setError(validate())}
                  placeholder="voce@exemplo.com"
                  className={error ? 'input-error' : ''}
                />
              </div>
              {error && <p className="field-error">{error}</p>}
            </div>
            <Button disabled={loading} className="primary-button mt-6" type="submit">
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin-fast" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar link de recuperação
                  <ArrowRight />
                </>
              )}
            </Button>
          </form>
        </>
      )}
    </AuthLayout>
  )
}
