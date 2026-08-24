import { Sparkles, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981] text-white shadow-lg shadow-emerald-950/20">
        <Sparkles size={21} fill="currentColor" />
      </span>
      <span className="text-xl font-extrabold tracking-[0.08em] text-white">Lumen</span>
    </div>
  )
}

export function AuthLayout({
  children,
  headline = 'Seu dinheiro, com clareza.',
}: {
  children: ReactNode
  headline?: string
}) {
  return (
    <main className="auth-shell min-h-screen bg-[#F5F7FA]">
      <section className="brand-panel relative overflow-hidden bg-[#0B1D33] px-10 py-9 text-white lg:px-16">
        <div className="brand-grid absolute inset-0 opacity-20" />
        <div className="glow-orb absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="glow-orb glow-delay absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-[#F5A524]/20 blur-3xl" />
        <div className="relative z-10 flex h-full flex-col">
          <Logo />
          <div className="brand-content my-auto max-w-xl pb-4 pt-12">
            <p className="mobile-tagline hidden text-sm font-semibold text-white/70">
              Seu dinheiro, com clareza.
            </p>
            <div className="brand-copy">
              <span className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-emerald-300">
                FINANÇAS SEM COMPLICAÇÃO
              </span>
              <h1 className="max-w-lg text-[clamp(2.25rem,4vw,3.6rem)] font-extrabold leading-[1.08] tracking-[-0.035em]">
                {headline}
              </h1>
              <p className="mt-5 max-w-lg text-base font-medium leading-7 text-slate-300">
                Acompanhe receitas, despesas e metas em um só painel. Simples, seguro e bonito.
              </p>
              <div className="dashboard-preview relative mt-10 max-w-lg">
                <div className="panel-float rounded-[24px] border border-white/10 bg-white/[0.09] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-300">Saldo total</p>
                      <p className="mt-2 text-2xl font-extrabold tabular-nums">R$ 24.580,90</p>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-bold text-emerald-300">
                      <TrendingUp size={14} /> +12,4%
                    </span>
                  </div>
                  <div className="mt-8 flex h-24 items-end gap-3">
                    {[42, 62, 48, 78, 67, 92, 74, 96].map((height, index) => (
                      <span
                        key={index}
                        style={{ height: `${height}%` }}
                        className={`flex-1 rounded-t-md ${index % 3 === 1 ? 'bg-[#F5A524]' : index % 3 === 2 ? 'bg-sky-400' : 'bg-[#10B981]'} opacity-90`}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between text-[10px] font-semibold text-slate-400">
                    <span>JAN</span>
                    <span>FEV</span>
                    <span>MAR</span>
                    <span>ABR</span>
                    <span>MAI</span>
                    <span>JUN</span>
                  </div>
                </div>
                <div className="panel-float chip-delay absolute -bottom-7 -left-4 rounded-full border border-white/10 bg-[#142A43]/95 px-4 py-3 text-xs font-bold shadow-xl">
                  <span className="mr-2 text-emerald-400">●</span>Economia de R$ 1.240 este mês
                </div>
                <div className="panel-float chip-delay-two absolute -right-4 -top-5 rounded-full border border-white/10 bg-[#142A43]/95 px-4 py-3 text-xs font-bold shadow-xl">
                  <span className="mr-2 text-[#F5A524]">●</span>Meta de investimentos 68% concluída
                </div>
              </div>
            </div>
          </div>
          <p className="brand-footer relative z-10 text-xs font-semibold text-slate-500">
            © 2025 Lumen. Clareza para suas escolhas.
          </p>
        </div>
      </section>
      <section className="form-panel flex min-h-screen items-center justify-center bg-[#F5F7FA] px-6 py-10 sm:px-10">
        <div className="auth-card w-full max-w-[420px] rounded-[20px] border border-white bg-white p-8 shadow-[0_1px_2px_rgba(15,30,46,0.04),0_8px_24px_rgba(15,30,46,0.06)]">
          {children}
        </div>
      </section>
    </main>
  )
}
