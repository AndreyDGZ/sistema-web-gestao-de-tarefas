import { CheckCircle2, Clock3, ListTodo, Timer } from 'lucide-react'
import { Task } from '../types/task.types'

interface TaskSummaryProps {
  tasks: Task[]
}

export function TaskSummary({ tasks }: TaskSummaryProps) {
  const totalTasks = tasks.length
  const todoTasks = tasks.filter(task => task.status === 'TODO').length
  const progressTasks = tasks.filter(task => task.status === 'IN_PROGRESS').length
  const doneTasks = tasks.filter(task => task.status === 'DONE').length

  return (
    <section className="summary-grid" aria-label="Resumo das tarefas">
      <article className="summary-card summary-card-featured">
        <span className="summary-icon">
          <ListTodo size={18} aria-hidden="true" />
        </span>
        <div>
          <strong>{totalTasks}</strong>
          <span>Total de tarefas</span>
        </div>
      </article>
      <article className="summary-card">
        <span className="summary-muted-icon">
          <Clock3 size={18} aria-hidden="true" />
        </span>
        <div>
          <strong>{todoTasks}</strong>
          <span>A fazer</span>
        </div>
      </article>
      <article className="summary-card">
        <span className="summary-muted-icon">
          <Timer size={18} aria-hidden="true" />
        </span>
        <div>
          <strong>{progressTasks}</strong>
          <span>Em andamento</span>
        </div>
      </article>
      <article className="summary-card">
        <span className="summary-muted-icon">
          <CheckCircle2 size={18} aria-hidden="true" />
        </span>
        <div>
          <strong>{doneTasks}</strong>
          <span>Concluidas</span>
        </div>
      </article>
    </section>
  )
}
