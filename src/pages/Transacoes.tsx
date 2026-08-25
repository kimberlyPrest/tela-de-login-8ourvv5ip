import { useState } from 'react'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Car,
  CreditCard,
  Filter,
  Gamepad2,
  Home,
  Plus,
  Search,
  ShoppingCart,
  BriefcaseBusiness,
  WalletCards,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type TransactionType = 'entrada' | 'saida'

interface Transaction {
  id: string
  name: string
  category: string
  date: string
  value: number
  type: TransactionType
  icon: any
  tone: string
}

const categoryIcons: Record<string, any> = {
  Alimentação: ShoppingCart,
  Transporte: Car,
  Moradia: Home,
  Lazer: Gamepad2,
  Receita: BriefcaseBusiness,
  Saúde: CreditCard,
  Educação: WalletCards,
}

const categoryTones: Record<string, string> = {
  Alimentação: 'bg-amber-50 text-amber-600',
  Transporte: 'bg-sky-50 text-sky-600',
  Moradia: 'bg-violet-50 text-violet-600',
  Lazer: 'bg-rose-50 text-rose-600',
  Receita: 'bg-emerald-50 text-emerald-600',
  Saúde: 'bg-pink-50 text-pink-600',
  Educação: 'bg-indigo-50 text-indigo-600',
}

const categories = [
  'Todas',
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Receita',
  'Saúde',
  'Educação',
]
const periods = ['Este mês', 'Último mês', 'Últimos 3 meses', 'Personalizado']

const initialTransactions: Transaction[] = [
  {
    id: '1',
    name: 'Supermercado Pão de Açúcar',
    category: 'Alimentação',
    date: 'Hoje, 14:32',
    value: -286.4,
    type: 'saida',
    icon: ShoppingCart,
    tone: 'bg-amber-50 text-amber-600',
  },
  {
    id: '2',
    name: 'Uber',
    category: 'Transporte',
    date: 'Hoje, 09:18',
    value: -32.9,
    type: 'saida',
    icon: Car,
    tone: 'bg-sky-50 text-sky-600',
  },
  {
    id: '3',
    name: 'Salário — TechCorp',
    category: 'Receita',
    date: '05 Jun, 08:00',
    value: 8420,
    type: 'entrada',
    icon: BriefcaseBusiness,
    tone: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: '4',
    name: 'Aluguel',
    category: 'Moradia',
    date: '03 Jun, 10:42',
    value: -1850,
    type: 'saida',
    icon: Home,
    tone: 'bg-violet-50 text-violet-600',
  },
  {
    id: '5',
    name: 'Steam',
    category: 'Lazer',
    date: '01 Jun, 21:15',
    value: -89.9,
    type: 'saida',
    icon: Gamepad2,
    tone: 'bg-rose-50 text-rose-600',
  },
  {
    id: '6',
    name: 'Farmácia Drogasil',
    category: 'Saúde',
    date: '28 Mai, 16:45',
    value: -156.8,
    type: 'saida',
    icon: CreditCard,
    tone: 'bg-pink-50 text-pink-600',
  },
  {
    id: '7',
    name: 'Curso Udemy',
    category: 'Educação',
    date: '25 Mai, 10:30',
    value: -27.9,
    type: 'saida',
    icon: WalletCards,
    tone: 'bg-indigo-50 text-indigo-600',
  },
  {
    id: '8',
    name: 'Freelance — App Mobile',
    category: 'Receita',
    date: '20 Mai, 14:22',
    value: 2500,
    type: 'entrada',
    icon: BriefcaseBusiness,
    tone: 'bg-emerald-50 text-emerald-600',
  },
]

export default function Transacoes() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [selectedPeriod, setSelectedPeriod] = useState('Este mês')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    name: '',
    category: 'Alimentação',
    value: '',
    type: 'saida' as TransactionType,
  })

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Todas' || t.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalEntradas = filteredTransactions
    .filter((t) => t.type === 'entrada')
    .reduce((sum, t) => sum + t.value, 0)
  const totalSaidas = filteredTransactions
    .filter((t) => t.type === 'saida')
    .reduce((sum, t) => sum + Math.abs(t.value), 0)
  const saldo = totalEntradas - totalSaidas

  const handleAddTransaction = () => {
    if (!newTransaction.name || !newTransaction.value) return

    const value = parseFloat(newTransaction.value)
    const Icon = categoryIcons[newTransaction.category] || WalletCards
    const tone = categoryTones[newTransaction.category] || 'bg-slate-50 text-slate-600'

    const transaction: Transaction = {
      id: Date.now().toString(),
      name: newTransaction.name,
      category: newTransaction.category,
      date: 'Agora',
      value: newTransaction.type === 'saida' ? -Math.abs(value) : Math.abs(value),
      type: newTransaction.type,
      icon: Icon,
      tone,
    }

    setTransactions([transaction, ...transactions])
    setNewTransaction({ name: '', category: 'Alimentação', value: '', type: 'saida' })
    setDialogOpen(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#10B981]">TRANSACÕES</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.03em]">
            Gerencie suas finanças
          </h1>
          <p className="mt-2 text-sm font-medium text-[#5B6B7C]">
            Visualize e adicione seus lançamentos financeiros.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="primary-button gap-2">
              <Plus size={18} />
              Nova transação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar transação</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={newTransaction.name}
                  onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
                  placeholder="Ex: Supermercado"
                />
              </div>
              <div className="grid gap-2">
                <Label>Categoria</Label>
                <Select
                  value={newTransaction.category}
                  onValueChange={(value) =>
                    setNewTransaction({ ...newTransaction, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Valor</Label>
                <Input
                  id="value"
                  type="number"
                  value={newTransaction.value}
                  onChange={(e) => setNewTransaction({ ...newTransaction, value: e.target.value })}
                  placeholder="0,00"
                />
              </div>
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={newTransaction.type === 'saida' ? 'default' : 'outline'}
                    className={`flex-1 gap-2 ${
                      newTransaction.type === 'saida'
                        ? 'bg-rose-500 text-white hover:bg-rose-600'
                        : ''
                    }`}
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'saida' })}
                  >
                    <ArrowDownCircle size={18} />
                    Saída
                  </Button>
                  <Button
                    type="button"
                    variant={newTransaction.type === 'entrada' ? 'default' : 'outline'}
                    className={`flex-1 gap-2 ${
                      newTransaction.type === 'entrada'
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : ''
                    }`}
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'entrada' })}
                  >
                    <ArrowUpCircle size={18} />
                    Entrada
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="primary-button" onClick={handleAddTransaction}>
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Total entradas</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowUpCircle size={20} />
            </span>
          </div>
          <p className="mt-4 text-[22px] font-extrabold tracking-[-0.025em] tabular-nums text-emerald-600">
            {formatCurrency(totalEntradas)}
          </p>
        </Card>
        <Card
          className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)]"
          style={{ animationDelay: '60ms' }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Total saídas</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <ArrowDownCircle size={20} />
            </span>
          </div>
          <p className="mt-4 text-[22px] font-extrabold tracking-[-0.025em] tabular-nums text-rose-500">
            {formatCurrency(totalSaidas)}
          </p>
        </Card>
        <Card
          className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)]"
          style={{ animationDelay: '120ms' }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Saldo</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <WalletCards size={20} />
            </span>
          </div>
          <p
            className={`mt-4 text-[22px] font-extrabold tracking-[-0.025em] tabular-nums ${saldo >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}
          >
            {formatCurrency(saldo)}
          </p>
        </Card>
      </section>

      <Card
        className="fade-up mt-5 overflow-hidden rounded-2xl border-[#E8EDF2] bg-white shadow-[0_4px_18px_rgba(15,30,46,0.04)]"
        style={{ animationDelay: '180ms' }}
      >
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-6 py-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar transação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <Filter size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[160px]">
              <Calendar size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <WalletCards size={48} className="text-slate-300" />
              <p className="mt-4 text-sm font-bold text-slate-500">Nenhuma transação encontrada</p>
              <p className="mt-1 text-xs text-slate-400">
                Tente ajustar os filtros ou adicione uma nova transação
              </p>
            </div>
          ) : (
            filteredTransactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50/70 sm:px-6"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.tone}`}
                >
                  <t.icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{t.name}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{t.category}</p>
                </div>
                <p className="hidden text-xs font-semibold text-slate-400 sm:block">{t.date}</p>
                <strong
                  className={`ml-2 min-w-[110px] text-right text-sm tabular-nums ${
                    t.type === 'entrada' ? 'text-emerald-600' : 'text-[#0F1E2E]'
                  }`}
                >
                  {t.type === 'entrada' ? '+' : '–'} {formatCurrency(Math.abs(t.value))}
                </strong>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
