import { useState, type ComponentType, type ReactNode } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  BriefcaseBusiness,
  Car,
  CreditCard,
  Gamepad2,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  ShoppingCart,
  Sparkles,
  Target,
  TrendingUp,
  WalletCards,
  X,
} from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

const chartData = [
  { mes: 'Jan', receitas: 6200, despesas: 4100 },
  { mes: 'Fev', receitas: 6800, despesas: 4700 },
  { mes: 'Mar', receitas: 7100, despesas: 4300 },
  { mes: 'Abr', receitas: 6900, despesas: 5200 },
  { mes: 'Mai', receitas: 7800, despesas: 4900 },
  { mes: 'Jun', receitas: 8420, despesas: 5130 },
]
const categoryData = [
  { name: 'Moradia', value: 1900, color: '#10B981' },
  { name: 'Alimentação', value: 1280, color: '#F5A524' },
  { name: 'Transporte', value: 840, color: '#38BDF8' },
  { name: 'Lazer', value: 650, color: '#8B5CF6' },
  { name: 'Outros', value: 460, color: '#FB7185' },
]
const transactions = [
  {
    name: 'Supermercado Pão de Açúcar',
    category: 'Alimentação',
    date: 'Hoje, 14:32',
    value: '– R$ 286,40',
    icon: ShoppingCart,
    tone: 'bg-amber-50 text-amber-600',
  },
  {
    name: 'Uber',
    category: 'Transporte',
    date: 'Hoje, 09:18',
    value: '– R$ 32,90',
    icon: Car,
    tone: 'bg-sky-50 text-sky-600',
  },
  {
    name: 'Salário — TechCorp',
    category: 'Receita',
    date: '05 Jun, 08:00',
    value: '+ R$ 8.420,00',
    icon: BriefcaseBusiness,
    tone: 'bg-emerald-50 text-emerald-600',
    income: true,
  },
  {
    name: 'Aluguel',
    category: 'Moradia',
    date: '03 Jun, 10:42',
    value: '– R$ 1.850,00',
    icon: Home,
    tone: 'bg-violet-50 text-violet-600',
  },
  {
    name: 'Steam',
    category: 'Lazer',
    date: '01 Jun, 21:15',
    value: '– R$ 89,90',
    icon: Gamepad2,
    tone: 'bg-rose-50 text-rose-600',
  },
]

type View = 'Visão geral' | 'Transações' | 'Metas' | 'Relatórios'
const navItems: { label: View; icon: ComponentType<{ size?: number }> }[] = [
  { label: 'Visão geral', icon: LayoutDashboard },
  { label: 'Transações', icon: ReceiptText },
  { label: 'Metas', icon: Target },
  { label: 'Relatórios', icon: TrendingUp },
]

export default function Inicio() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [view, setView] = useState<View>('Visão geral')
  const [drawer, setDrawer] = useState(false)
  if (!user) return <Navigate to="/" replace />
  const initials = user.nome
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
  const firstName = user.nome.split(' ')[0]
  const signOut = () => {
    logout()
    navigate('/')
  }
  const chooseView = (nextView: View) => {
    setView(nextView)
    setDrawer(false)
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0F1E2E]">
      <header className="mobile-topbar sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur-xl">
        <LumenLogo dark />
        <button
          onClick={() => setDrawer(true)}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-600"
          aria-label="Abrir menu"
        >
          <Menu size={21} />
        </button>
      </header>
      {drawer && (
        <button
          className="fixed inset-0 z-40 bg-[#071426]/45 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawer(false)}
          aria-label="Fechar menu"
        />
      )}
      <aside
        className={`app-sidebar fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#0B1D33] px-5 py-7 text-white shadow-xl transition-transform ${drawer ? 'translate-x-0' : 'max-lg:-translate-x-full'}`}
      >
        <div className="flex items-center justify-between">
          <LumenLogo />
          <button
            onClick={() => setDrawer(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>
        <p className="mb-3 mt-12 px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
          Menu principal
        </p>
        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => chooseView(label)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-colors ${view === label ? 'bg-[#10B981] text-white shadow-lg shadow-emerald-950/20' : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'}`}
            >
              <Icon size={19} />
              {label}
              {label !== 'Visão geral' && (
                <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px] uppercase">
                  Breve
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-5">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/[0.05] p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15 text-xs font-extrabold text-emerald-300">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user.nome}</p>
              <p className="truncate text-[10px] font-medium text-slate-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-400 hover:bg-white/[0.06] hover:text-white"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>
      <main className="app-main ml-[260px] min-h-screen p-6 md:p-9 xl:p-10">
        {view !== 'Visão geral' ? (
          <ComingSoon view={view} onBack={() => setView('Visão geral')} />
        ) : (
          <Dashboard firstName={firstName} />
        )}
      </main>
    </div>
  )
}

function Dashboard({ firstName }: { firstName: string }) {
  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#10B981]">VISÃO GERAL</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.03em]">
            Olá, {firstName}! <span aria-hidden>👋</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-[#5B6B7C]">
            Aqui está o resumo das suas finanças hoje.
          </p>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm">
          Atualizado agora mesmo
        </div>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          delay="0ms"
          title="Saldo total"
          value="R$ 24.580,90"
          icon={<WalletCards />}
          accent="emerald"
        >
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-extrabold text-emerald-600">
            +12,4%
          </span>
          <span className="text-[11px] font-semibold text-slate-400">este mês</span>
        </SummaryCard>
        <SummaryCard
          delay="60ms"
          title="Receitas do mês"
          value="R$ 8.420,00"
          icon={<TrendingUp />}
          accent="blue"
        >
          <span className="text-xs font-semibold text-emerald-600">+ R$ 820,00</span>
          <span className="text-[11px] font-semibold text-slate-400">vs. mês anterior</span>
        </SummaryCard>
        <SummaryCard
          delay="120ms"
          title="Despesas do mês"
          value="R$ 5.130,00"
          icon={<CreditCard />}
          accent="gold"
        >
          <span className="text-xs font-semibold text-rose-500">+ R$ 240,00</span>
          <span className="text-[11px] font-semibold text-slate-400">vs. mês anterior</span>
        </SummaryCard>
        <SummaryCard
          delay="180ms"
          title="Meta de economia"
          value="68%"
          icon={<Target />}
          accent="purple"
        >
          <div className="w-full">
            <div className="mb-1.5 flex justify-between text-[10px] font-bold text-slate-400">
              <span>R$ 3.400</span>
              <span>R$ 5.000</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[68%] rounded-full bg-[#10B981]" />
            </div>
          </div>
        </SummaryCard>
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <ChartCard title="Receitas vs Despesas" subtitle="Evolução nos últimos 6 meses">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 15, right: 5, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5A524" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F5A524" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#EDF1F5" strokeDasharray="4 4" />
                <XAxis
                  dataKey="mes"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B3', fontSize: 11, fontWeight: 700 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B3', fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E3E9EF',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="receitas"
                  name="Receitas"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#income)"
                />
                <Area
                  type="monotone"
                  dataKey="despesas"
                  name="Despesas"
                  stroke="#F5A524"
                  strokeWidth={3}
                  fill="url(#expense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs font-bold text-slate-500">
            <span>
              <i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-[#10B981]" />
              Receitas
            </span>
            <span>
              <i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-[#F5A524]" />
              Despesas
            </span>
          </div>
        </ChartCard>
        <ChartCard title="Despesas por categoria" subtitle="Distribuição deste mês">
          <div className="grid items-center sm:grid-cols-[1fr_1fr] xl:grid-cols-1 2xl:grid-cols-[1fr_1fr]">
            <div className="relative mx-auto h-[230px] w-full max-w-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    innerRadius={67}
                    outerRadius={91}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                    contentStyle={{ borderRadius: 12, border: '1px solid #E3E9EF', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[11px] font-bold text-slate-400">TOTAL</span>
                <strong className="mt-1 text-lg font-extrabold tabular-nums">R$ 5.130</strong>
              </div>
            </div>
            <div className="space-y-3">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2.5 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="flex-1 font-semibold text-slate-500">{item.name}</span>
                  <strong className="tabular-nums text-slate-700">
                    R$ {item.value.toLocaleString('pt-BR')}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </section>
      <Card className="fade-up mt-5 overflow-hidden rounded-2xl border-[#E8EDF2] bg-white shadow-[0_4px_18px_rgba(15,30,46,0.04)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="font-extrabold">Transações recentes</h2>
            <p className="mt-1 text-xs font-medium text-slate-400">Seus últimos lançamentos</p>
          </div>
          <button className="text-xs font-extrabold text-[#059669]">Ver todas</button>
        </div>
        <div className="divide-y divide-slate-100">
          {transactions.map(({ name, category, date, value, icon: Icon, tone, income }) => (
            <div
              key={name}
              className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50/70 sm:px-6"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
              >
                <Icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{name}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{category}</p>
              </div>
              <p className="hidden text-xs font-semibold text-slate-400 sm:block">{date}</p>
              <strong
                className={`ml-2 min-w-[110px] text-right text-sm tabular-nums ${income ? 'text-emerald-600' : 'text-[#0F1E2E]'}`}
              >
                {value}
              </strong>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon,
  accent,
  delay,
  children,
}: {
  title: string
  value: string
  icon: ReactNode
  accent: string
  delay: string
  children: ReactNode
}) {
  const tones: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-sky-50 text-sky-600',
    gold: 'bg-amber-50 text-amber-600',
    purple: 'bg-violet-50 text-violet-600',
  }
  return (
    <Card
      style={{ animationDelay: delay }}
      className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,30,46,0.08)]"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-500">{title}</p>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl [&>svg]:h-5 [&>svg]:w-5 ${tones[accent]}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-4 text-[22px] font-extrabold tracking-[-0.025em] tabular-nums">{value}</p>
      <div className="mt-4 flex min-h-5 items-center gap-2">{children}</div>
    </Card>
  )
}
function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <Card className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)] sm:p-6">
      <h2 className="font-extrabold">{title}</h2>
      <p className="mb-4 mt-1 text-xs font-medium text-slate-400">{subtitle}</p>
      {children}
    </Card>
  )
}
function ComingSoon({ view, onBack }: { view: View; onBack: () => void }) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
      <Card className="max-w-md rounded-3xl border-slate-200 p-10 text-center shadow-sm">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Sparkles size={28} />
        </span>
        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-[#10B981]">
          Em breve
        </p>
        <h1 className="mt-2 text-2xl font-extrabold">{view}</h1>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
          Estamos preparando esta área para deixar sua vida financeira ainda mais clara.
        </p>
        <Button onClick={onBack} className="primary-button mt-7">
          Voltar à visão geral
        </Button>
      </Card>
    </div>
  )
}
function LumenLogo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981] text-white">
        <Sparkles size={18} fill="currentColor" />
      </span>
      <span
        className={`text-lg font-extrabold tracking-[0.08em] ${dark ? 'text-[#0B1D33]' : 'text-white'}`}
      >
        Lumen
      </span>
    </div>
  )
}
