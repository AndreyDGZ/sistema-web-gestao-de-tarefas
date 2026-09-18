import { z } from 'zod'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeName: string
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface TaskFormValues {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeName: string
  dueDate: string
}

export interface TaskFilters {
  query: string
  assigneeName: string
  priority: 'ALL' | TaskPriority
  status: 'ALL' | TaskStatus
}

export interface ApiErrorResponse {
  message: string
  issues?: string[]
}

export interface TasksResponse {
  tasks: Task[]
}

export interface TaskResponse {
  task: Task
}

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/

export const taskPayloadSchema = z.object({
  title: z.string().trim().min(1, 'Informe o titulo da tarefa.'),
  description: z.string().trim(),
  assigneeName: z.string().trim().min(1, 'Informe o nome do responsavel.'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    message: 'Informe a prioridade.',
  }),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'], {
    message: 'Informe o status.',
  }),
  dueDate: z
    .string()
    .trim()
    .refine(value => value === '' || isoDatePattern.test(value), 'Informe uma data valida.'),
})

export type TaskPayload = z.infer<typeof taskPayloadSchema>

export const taskStatusOrder: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

export const taskPriorityOrder: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH']

export const taskStatusLabels: Record<TaskStatus, string> = {
  TODO: 'A fazer',
  IN_PROGRESS: 'Em andamento',
  DONE: 'Concluidas',
}

export const taskPriorityLabels: Record<TaskPriority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Media',
  HIGH: 'Alta',
}
