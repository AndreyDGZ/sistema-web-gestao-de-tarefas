import { Task, TaskFilters } from '../types/task.types'

export function filterTasks(tasks: Task[], filters: TaskFilters) {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase('pt-BR')

  return tasks.filter(task => {
    const titleMatches = task.title.toLocaleLowerCase('pt-BR').includes(normalizedQuery)
    const assigneeMatches = filters.assigneeName === 'ALL' || task.assigneeName === filters.assigneeName
    const priorityMatches = filters.priority === 'ALL' || task.priority === filters.priority
    const statusMatches = filters.status === 'ALL' || task.status === filters.status

    return titleMatches && assigneeMatches && priorityMatches && statusMatches
  })
}

export function getTaskAssignees(tasks: Task[]) {
  return Array.from(new Set(tasks.map(task => task.assigneeName).filter(Boolean))).sort((firstName, secondName) =>
    firstName.localeCompare(secondName, 'pt-BR'),
  )
}

export function hasActiveFilters(filters: TaskFilters) {
  return (
    filters.query.trim().length > 0 ||
    filters.assigneeName !== 'ALL' ||
    filters.priority !== 'ALL' ||
    filters.status !== 'ALL'
  )
}
