import { Task } from '../types/task.types'
import { taskStatusLabels, taskStatusOrder } from '../utils/taskLabels'
import { TaskCard } from './TaskCard'

interface TaskBoardProps {
  tasks: Task[]
  activeMobileStatus: Task['status']
  onMobileStatusChange: (status: Task['status']) => void
  onTaskSelect: (task: Task) => void
}

export function TaskBoard({ tasks, activeMobileStatus, onMobileStatusChange, onTaskSelect }: TaskBoardProps) {
  return (
    <section className="board-section" aria-label="Quadro de tarefas">
      <div className="mobile-tabs" role="tablist" aria-label="Status das tarefas">
        {taskStatusOrder.map(status => (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={activeMobileStatus === status}
            className={activeMobileStatus === status ? 'mobile-tab active' : 'mobile-tab'}
            onClick={() => onMobileStatusChange(status)}
          >
            {taskStatusLabels[status]}
          </button>
        ))}
      </div>
      <div className="task-board">
        {taskStatusOrder.map(status => {
          const columnTasks = tasks.filter(task => task.status === status)
          const isActiveMobileColumn = activeMobileStatus === status

          return (
            <section key={status} className={isActiveMobileColumn ? 'task-column active-mobile-column' : 'task-column'} aria-labelledby={`${status}-heading`}>
              <div className="task-column-header">
                <h2 id={`${status}-heading`}>{taskStatusLabels[status]}</h2>
                <span>{columnTasks.length}</span>
              </div>
              <div className="task-column-list">
                {columnTasks.map(task => (
                  <TaskCard key={task.id} task={task} onSelect={onTaskSelect} />
                ))}
                {columnTasks.length === 0 ? <p className="column-empty">Nenhuma tarefa nesta etapa.</p> : null}
              </div>
            </section>
          )
        })}
      </div>
    </section>
  )
}
