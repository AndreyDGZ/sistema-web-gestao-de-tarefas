import { CalendarDays, UserRound } from 'lucide-react'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { Task } from '../types/task.types'
import { formatDisplayDate } from '../utils/taskDates'
import { taskPriorityLabels, taskStatusLabels } from '../utils/taskLabels'

interface TaskCardProps {
  task: Task
  onSelect: (task: Task) => void
}

function getPriorityTone(priority: Task['priority']) {
  if (priority === 'HIGH') {
    return 'danger'
  }

  if (priority === 'MEDIUM') {
    return 'warning'
  }

  return 'info'
}

export function TaskCard({ task, onSelect }: TaskCardProps) {
  return (
    <button className="task-card" type="button" onClick={() => onSelect(task)}>
      <span className="task-card-title">{task.title}</span>
      {task.description ? <span className="task-card-description">{task.description}</span> : null}
      <div className="task-card-badges">
        <StatusBadge tone={getPriorityTone(task.priority)}>{taskPriorityLabels[task.priority]} prioridade</StatusBadge>
        <StatusBadge tone="neutral">{taskStatusLabels[task.status]}</StatusBadge>
      </div>
      <div className="task-card-meta">
        <span>
          <UserRound size={16} aria-hidden="true" />
          {task.assigneeName}
        </span>
        <span>
          <CalendarDays size={16} aria-hidden="true" />
          {formatDisplayDate(task.dueDate)}
        </span>
      </div>
    </button>
  )
}
