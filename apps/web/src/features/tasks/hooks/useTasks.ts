import { useEffect, useMemo, useState } from 'react'
import { createTask as createTaskRequest, deleteTask as deleteTaskRequest, listTasks, updateTask as updateTaskRequest } from '../services/taskApiClient'
import { Task, TaskFilters, TaskFormValues } from '../types/task.types'
import { filterTasks, getTaskAssignees } from '../utils/taskFilters'

const initialFilters: TaskFilters = {
  query: '',
  assigneeName: 'ALL',
  priority: 'ALL',
  status: 'ALL',
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filters, setFilters] = useState<TaskFilters>(initialFilters)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  async function hydrateTasks(): Promise<void> {
    setIsLoading(true)
    setLoadError(false)

    try {
      const loadedTasks = await listTasks()
      setTasks(loadedTasks)
    } catch {
      setLoadError(true)
    } finally {
      window.setTimeout(() => setIsLoading(false), 250)
    }
  }

  useEffect(() => {
    void hydrateTasks()
  }, [])

  const filteredTasks = useMemo(() => filterTasks(tasks, filters), [tasks, filters])
  const assigneeOptions = useMemo(() => getTaskAssignees(tasks), [tasks])

  async function createTask(values: TaskFormValues): Promise<void> {
    const createdTask = await createTaskRequest(values)
    setTasks(currentTasks => [createdTask, ...currentTasks])
  }

  async function updateTask(taskId: string, values: TaskFormValues): Promise<void> {
    const updatedTask = await updateTaskRequest(taskId, values)

    setTasks(currentTasks =>
      currentTasks.map(task => {
        if (task.id !== taskId) {
          return task
        }

        return updatedTask
      }),
    )
  }

  async function deleteTask(taskId: string): Promise<void> {
    await deleteTaskRequest(taskId)
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId))
  }

  function resetFilters(): void {
    setFilters(initialFilters)
  }

  return {
    tasks,
    filters,
    filteredTasks,
    assigneeOptions,
    isLoading,
    loadError,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
    resetFilters,
    retryLoad: hydrateTasks,
  }
}
