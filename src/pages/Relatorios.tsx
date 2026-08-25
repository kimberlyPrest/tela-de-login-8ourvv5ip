import { useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Calendar, Download, TrendingDown, TrendingUp, WalletCards } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const monthlyData = [
  { mes: 'Jan', receitas: 8200, despesas: 5100 },
  { mes: 'Fev', receitas: 8500, despesas: 5800 },
  { mes: 'Mar', receitas: 8800, despesas: 5400 },
  { mes: 'Abr', receitas: 9100, despesas: 6200 },
  { mes: 'Mai', receitas: 9500, despesas: 5900 },
  { mes: 'Jun', receitas: 10200, despesas: 6500 },
]

const categoryData = [
  { name: 'Moradia', value: 2100, color: '#8B5CF6' },
  { name: 'Alimentação', value: 1650, color: '#F5A524' },
  { name: 'Transporte', value: 920, color: '#38BDF8' },
  { name: 'Lazer', value: 780, color: '#FB7185' },
  { name: 'Saúde', value: 450, color: '#EC4899' },
  { name: 'Educação', value: 380, color: '#6366F1' },
  { name: 'Outros', value: 620, color: '#94A3B8' },
]

const incomeVsExpenseByMonth = [
  { month: 'Jan', entrada: 8200, saida: 5100 },
  { month: 'Fev', entrada: 8500, saida: 5800 },
  { month: 'Mar', entrada: 8800, saida: 5400 },
  { month: 'Abr', entrada: 9100, saida: 6200 },
  { month: 'Mai', entrada: 9500, saida: 5900 },
  { month: 'Jun', entrada: 10200, saida: 6500 },
]

const topExpenses = [
  { name: 'Aluguel', value: 1850, percent: 28.4 },
  { name: 'Supermercado', value: 680, percent: 10.5 },
  { name: 'Condomínio', value: 420, percent: 6.5 },
  { name: 'Internet', value: 180, percent: 2.8 },
  { name: 'Academia', value: 150, percent: 2.3 },
]

const periods = ['Este mês', 'Último mês', 'Últimos 3 meses', 'Este ano']

export default function Relatorios() {
  const [period, setPeriod] = useState('Este mês')

  const totalReceitas = monthlyData.reduce((sum, d) => sum + d.receitas, 0)
  const totalDespesas = monthlyData.reduce((sum, d) => sum + d.despesas, 0)
  const totalEconomia = totalReceitas - totalDespesas
  const mediaMensalReceitas = totalReceitas / monthlyData.length
  const mediaMensalDespesas = totalDespesas / monthlyData.length

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const currentMonth = monthlyData[monthlyData.length - 1]
  const previousMonth = monthlyData[monthlyData.length - 2]
  const receitasVariacao =
    ((currentMonth.receitas - previousMonth.receitas) / previousMonth.receitas) * 100
  const despesasVariacao =
    ((currentMonth.despesas - previousMonth.despesas) / previousMonth.despesas) * 100

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#10B981]">RELATÓRIOS</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.03em]">Análise financeira</h1>
          <p className="mt-2 text-sm font-medium text-[#5B6B7C]">
            Visualize seus indicadores e tendências financeiras.
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download size={18} />
            Exportar
          </Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Total receitas</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp size={20} />
            </span>
          </div>
          <p className="mt-4 text-[22px] font-extrabold tracking-[-0.025em] tabular-nums text-emerald-600">
            {formatCurrency(totalReceitas)}
          </p>
          <div className="mt-2 flex items-center gap-1">
            <TrendingUp size={14} className="text-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-500">
              +{receitasVariacao.toFixed(1)}%
            </span>
            <span className="text-[11px] font-semibold text-slate-400">vs. mês anterior</span>
          </div>
        </Card>

        <Card
          className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)]"
          style={{ animationDelay: '60ms' }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Total despesas</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown size={20} />
            </span>
          </div>
          <p className="mt-4 text-[22px] font-extrabold tracking-[-0.025em] tabular-nums text-rose-500">
            {formatCurrency(totalDespesas)}
          </p>
          <div className="mt-2 flex items-center gap-1">
            <TrendingUp size={14} className="text-rose-500" />
            <span className="text-[11px] font-bold text-rose-500">
              +{despesasVariacao.toFixed(1)}%
            </span>
            <span className="text-[11px] font-semibold text-slate-400">vs. mês anterior</span>
          </div>
        </Card>

        <Card
          className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)]"
          style={{ animationDelay: '120ms' }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Economia total</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <WalletCards size={20} />
            </span>
          </div>
          <p className="mt-4 text-[22px] font-extrabold tracking-[-0.025em] tabular-nums text-sky-600">
            {formatCurrency(totalEconomia)}
          </p>
          <p className="mt-2 text-[11px] font-semibold text-slate-400">
            {((totalEconomia / totalReceitas) * 100).toFixed(1)}% de taxa de economia
          </p>
        </Card>

        <Card
          className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)]"
          style={{ animationDelay: '180ms' }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Média mensal</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Calendar size={20} />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-slate-400">Receitas</p>
            <p className="text-lg font-extrabold tabular-nums text-emerald-600">
              {formatCurrency(mediaMensalReceitas)}
            </p>
          </div>
          <div className="mt-2">
            <p className="text-[11px] font-semibold text-slate-400">Despesas</p>
            <p className="text-lg font-extrabold tabular-nums text-rose-500">
              {formatCurrency(mediaMensalDespesas)}
            </p>
          </div>
        </Card>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <Card className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)] sm:p-6">
          <h2 className="font-extrabold">Evolução mensal</h2>
          <p className="mb-4 mt-1 text-xs font-medium text-slate-400">Receitas vs Despesas</p>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={incomeVsExpenseByMonth}
                margin={{ top: 15, right: 5, left: -18, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="#EDF1F5" strokeDasharray="4 4" />
                <XAxis
                  dataKey="month"
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
                <Legend
                  wrapperStyle={{ paddingTop: 20 }}
                  formatter={(value) => (
                    <span className="text-xs font-bold text-slate-500">{value}</span>
                  )}
                />
                <Bar dataKey="entrada" name="Receitas" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saida" name="Despesas" fill="#FB7185" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)] sm:p-6">
          <h2 className="font-extrabold">Despesas por categoria</h2>
          <p className="mb-4 mt-1 text-xs font-medium text-slate-400">Distribuição do período</p>
          <div className="relative mx-auto h-[240px] w-full max-w-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  innerRadius={72}
                  outerRadius={98}
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
              <strong className="mt-1 text-xl font-extrabold tabular-nums">
                {formatCurrency(categoryData.reduce((sum, d) => sum + d.value, 0))}
              </strong>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center gap-2.5 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                <span className="flex-1 font-semibold text-slate-500">{item.name}</span>
                <strong className="tabular-nums text-slate-700">
                  {formatCurrency(item.value)}
                </strong>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-5">
        <Card className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)] sm:p-6">
          <h2 className="font-extrabold">Maiores despesas</h2>
          <p className="mb-4 mt-1 text-xs font-medium text-slate-400">Top 5 gastos do período</p>
          <div className="space-y-4">
            {topExpenses.map((expense, index) => (
              <div key={expense.name} className="flex items-center gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-extrabold text-slate-500">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-bold">{expense.name}</p>
                    <strong className="ml-2 text-sm tabular-nums">
                      {formatCurrency(expense.value)}
                    </strong>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#10B981]"
                      style={{ width: `${expense.percent}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">{expense.percent}%</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-5">
        <Card className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)] sm:p-6">
          <h2 className="font-extrabold">Tendência de economia</h2>
          <p className="mb-4 mt-1 text-xs font-medium text-slate-400">
            Evolução da taxa de economia mensal
          </p>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData.map((d) => ({
                  mes: d.mes,
                  economia: d.receitas - d.despesas,
                  taxa: ((d.receitas - d.despesas) / d.receitas) * 100,
                }))}
                margin={{ top: 15, right: 5, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="economiaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
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
                  formatter={(value: number, name: string) => [
                    name === 'economia'
                      ? `R$ ${value.toLocaleString('pt-BR')}`
                      : `${value.toFixed(1)}%`,
                    name === 'economia' ? 'Economia' : 'Taxa',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="economia"
                  name="economia"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#economiaGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#10B981]" />
            Economia mensal (receitas - despesas)
          </div>
        </Card>
      </section>
    </div>
  )
}
