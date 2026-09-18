import { Search } from 'lucide-react'
import { SelectField } from '../../../shared/components/Field'
import { TaskFilters as TaskFiltersType } from '../types/task.types'
import { taskPriorityLabels, taskPriorityOrder, taskStatusLabels, taskStatusOrder } from '../utils/taskLabels'

interface TaskFiltersProps {
  filters: TaskFiltersType
  assigneeOptions: string[]
  onFiltersChange: (filters: TaskFiltersType) => void
}

export function TaskFilters({ filters, assigneeOptions, onFiltersChange }: TaskFiltersProps) {
  return (
    <section className="filters-panel" aria-label="Busca e filtros">
      <label className="search-field" htmlFor="task-search">
        <Search size={18} aria-hidden="true" />
        <input
          id="task-search"
          type="search"
          placeholder="Pesquisar tarefas..."
          value={filters.query}
          onChange={event => onFiltersChange({ ...filters, query: event.target.value })}
        />
      </label>
      <div className="filters-grid">
        <SelectField
          id="assignee-filter"
          label="Responsavel"
          value={filters.assigneeName}
          onChange={event => onFiltersChange({ ...filters, assigneeName: event.target.value })}
        >
          <option value="ALL">Todos</option>
          {assigneeOptions.map(assigneeName => (
            <option key={assigneeName} value={assigneeName}>
              {assigneeName}
            </option>
          ))}
        </SelectField>
        <SelectField
          id="priority-filter"
          label="Prioridade"
          value={filters.priority}
          onChange={event => onFiltersChange({ ...filters, priority: event.target.value as TaskFiltersType['priority'] })}
        >
          <option value="ALL">Todas</option>
          {taskPriorityOrder.map(priority => (
            <option key={priority} value={priority}>
              {taskPriorityLabels[priority]}
            </option>
          ))}
        </SelectField>
        <SelectField
          id="status-filter"
          label="Status"
          value={filters.status}
          onChange={event => onFiltersChange({ ...filters, status: event.target.value as TaskFiltersType['status'] })}
        >
          <option value="ALL">Todos</option>
          {taskStatusOrder.map(status => (
            <option key={status} value={status}>
              {taskStatusLabels[status]}
            </option>
          ))}
        </SelectField>
      </div>
    </section>
  )
}
