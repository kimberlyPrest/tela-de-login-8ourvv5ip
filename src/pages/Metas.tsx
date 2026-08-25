import { useState } from 'react'
import {
  AlertCircle,
  Car,
  CheckCircle2,
  Edit2,
  Gift,
  GraduationCap,
  Home,
  Landmark,
  Loader2,
  Plus,
  Target,
  WalletCards,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

type GoalStatus = 'em_andamento' | 'concluida' | 'pausada'

interface Goal {
  id: string
  name: string
  icon: any
  target: number
  current: number
  deadline: string
  status: GoalStatus
  color: string
  bgColor: string
}

const goalIcons: Record<string, any> = {
  Viagem: Car,
  Casa: Home,
  Educação: GraduationCap,
  Reserva: Landmark,
  Investimento: WalletCards,
  Presente: Gift,
}

const goalColors: Record<string, { color: string; bg: string }> = {
  Viagem: { color: 'text-sky-600', bg: 'bg-sky-50' },
  Casa: { color: 'text-violet-600', bg: 'bg-violet-50' },
  Educação: { color: 'text-indigo-600', bg: 'bg-indigo-50' },
  Reserva: { color: 'text-emerald-600', bg: 'bg-emerald-50' },
  Investimento: { color: 'text-amber-600', bg: 'bg-amber-50' },
  Presente: { color: 'text-rose-600', bg: 'bg-rose-50' },
}

const initialGoals: Goal[] = [
  {
    id: '1',
    name: 'Viagem Europa',
    icon: Car,
    target: 15000,
    current: 8500,
    deadline: 'Dez 2026',
    status: 'em_andamento',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
  },
  {
    id: '2',
    name: 'Reserva de Emergência',
    icon: Landmark,
    target: 25000,
    current: 25000,
    deadline: 'Jun 2026',
    status: 'concluida',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    id: '3',
    name: 'Curso MBA',
    icon: GraduationCap,
    target: 12000,
    current: 3200,
    deadline: 'Mar 2027',
    status: 'em_andamento',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    id: '4',
    name: 'Entrada Apartamento',
    icon: Home,
    target: 50000,
    current: 18750,
    deadline: 'Jun 2028',
    status: 'em_andamento',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
  },
  {
    id: '5',
    name: 'Notebook Novo',
    icon: WalletCards,
    target: 8000,
    current: 8000,
    deadline: 'Abr 2026',
    status: 'concluida',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
]

export default function Metas() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [newGoal, setNewGoal] = useState({
    name: '',
    category: 'Viagem',
    target: '',
    deadline: '',
  })

  const activeGoals = goals.filter((g) => g.status === 'em_andamento')
  const completedGoals = goals.filter((g) => g.status === 'concluida')
  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0)
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getProgress = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100))
  }

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target || !newGoal.deadline) return

    const colors = goalColors[newGoal.category] || { color: 'text-slate-600', bg: 'bg-slate-50' }
    const Icon = goalIcons[newGoal.category] || Target

    const goal: Goal = {
      id: Date.now().toString(),
      name: newGoal.name,
      icon: Icon,
      target: parseFloat(newGoal.target),
      current: 0,
      deadline: newGoal.deadline,
      status: 'em_andamento',
      color: colors.color,
      bgColor: colors.bg,
    }

    setGoals([...goals, goal])
    setNewGoal({ name: '', category: 'Viagem', target: '', deadline: '' })
    setDialogOpen(false)
  }

  const handleEditGoal = () => {
    if (!editingGoal) return

    setGoals(goals.map((g) => (g.id === editingGoal.id ? editingGoal : g)))
    setEditingGoal(null)
    setEditDialogOpen(false)
  }

  const handleAddValue = (goalId: string, amount: number) => {
    setGoals(
      goals.map((g) => {
        if (g.id === goalId) {
          const newCurrent = Math.min(g.target, g.current + amount)
          return {
            ...g,
            current: newCurrent,
            status: newCurrent >= g.target ? 'concluida' : g.status,
          }
        }
        return g
      }),
    )
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#10B981]">METAS</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.03em]">
            Seus objetivos financeiros
          </h1>
          <p className="mt-2 text-sm font-medium text-[#5B6B7C]">
            Acompanhe o progresso das suas metas e conquistas.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="primary-button gap-2">
              <Plus size={18} />
              Nova meta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar nova meta</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="goalName">Nome da meta</Label>
                <Input
                  id="goalName"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="Ex: Viagem Europa"
                />
              </div>
              <div className="grid gap-2">
                <Label>Categoria</Label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  {Object.keys(goalIcons).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goalTarget">Valor alvo</Label>
                <Input
                  id="goalTarget"
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  placeholder="0,00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goalDeadline">Prazo</Label>
                <Input
                  id="goalDeadline"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  placeholder="Ex: Dez 2026"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="primary-button" onClick={handleAddGoal}>
                Criar meta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Total economizado</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <WalletCards size={20} />
            </span>
          </div>
          <p className="mt-4 text-[22px] font-extrabold tracking-[-0.025em] tabular-nums">
            {formatCurrency(totalSaved)}
          </p>
          <p className="mt-2 text-[11px] font-semibold text-slate-400">
            de {formatCurrency(totalTarget)} total
          </p>
        </Card>
        <Card
          className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)]"
          style={{ animationDelay: '60ms' }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Metas ativas</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Target size={20} />
            </span>
          </div>
          <p className="mt-4 text-[22px] font-extrabold tracking-[-0.025em] tabular-nums">
            {activeGoals.length}
          </p>
          <p className="mt-2 text-[11px] font-semibold text-slate-400">em andamento</p>
        </Card>
        <Card
          className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)]"
          style={{ animationDelay: '120ms' }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Concluídas</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <CheckCircle2 size={20} />
            </span>
          </div>
          <p className="mt-4 text-[22px] font-extrabold tracking-[-0.025em] tabular-nums">
            {completedGoals.length}
          </p>
          <p className="mt-2 text-[11px] font-semibold text-slate-400">metas alcançadas</p>
        </Card>
      </section>

      <div className="mt-6">
        <h2 className="mb-4 text-lg font-extrabold">Metas ativas</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {activeGoals.map((goal) => {
            const progress = getProgress(goal.current, goal.target)
            return (
              <Card
                key={goal.id}
                className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,30,46,0.08)]"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${goal.bgColor}`}
                  >
                    <goal.icon size={24} className={goal.color} />
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-600"
                    onClick={() => {
                      setEditingGoal(goal)
                      setEditDialogOpen(true)
                    }}
                  >
                    <Edit2 size={16} />
                  </Button>
                </div>
                <h3 className="mt-4 text-lg font-extrabold">{goal.name}</h3>
                <p className="mt-1 text-xs font-semibold text-slate-400">Prazo: {goal.deadline}</p>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
                    <span>{formatCurrency(goal.current)}</span>
                    <span>{formatCurrency(goal.target)}</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <p className="mt-2 text-right text-[11px] font-extrabold text-slate-500">
                    {progress}%
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAddValue(goal.id, 500)}
                  >
                    + R$ 500
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAddValue(goal.id, 1000)}
                  >
                    + R$ 1.000
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {completedGoals.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-extrabold">Metas concluídas</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {completedGoals.map((goal) => (
              <Card
                key={goal.id}
                className="fade-up rounded-2xl border-[#E8EDF2] bg-white p-5 shadow-[0_4px_18px_rgba(15,30,46,0.04)] opacity-80"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${goal.bgColor}`}
                  >
                    <goal.icon size={24} className={goal.color} />
                  </span>
                  <CheckCircle2 size={24} className="text-emerald-500" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold">{goal.name}</h3>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Concluída em {goal.deadline}
                </p>
                <div className="mt-4">
                  <Progress value={100} className="h-3" />
                  <p className="mt-2 text-center text-xs font-extrabold text-emerald-600">
                    {formatCurrency(goal.target)} economizados!
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar meta</DialogTitle>
          </DialogHeader>
          {editingGoal && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input
                  value={editingGoal.name}
                  onChange={(e) => setEditingGoal({ ...editingGoal, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Valor alvo</Label>
                <Input
                  type="number"
                  value={editingGoal.target}
                  onChange={(e) =>
                    setEditingGoal({ ...editingGoal, target: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Valor atual</Label>
                <Input
                  type="number"
                  value={editingGoal.current}
                  onChange={(e) =>
                    setEditingGoal({ ...editingGoal, current: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Prazo</Label>
                <Input
                  value={editingGoal.deadline}
                  onChange={(e) => setEditingGoal({ ...editingGoal, deadline: e.target.value })}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="primary-button" onClick={handleEditGoal}>
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
