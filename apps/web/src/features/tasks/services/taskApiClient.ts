import { ApiErrorResponse, Task, TaskFormValues, TaskResponse, TasksResponse } from '@nexatask/shared'

async function readJsonResponse<ResponseBody>(response: Response): Promise<ResponseBody> {
  const responseBody: unknown = await response.json()

  if (!response.ok) {
    const apiError = responseBody as ApiErrorResponse
    throw new Error(apiError.message || 'Nao foi possivel concluir a acao.')
  }

  return responseBody as ResponseBody
}

export async function listTasks(): Promise<Task[]> {
  const response = await fetch('/api/tasks')
  const responseBody = await readJsonResponse<TasksResponse>(response)

  return responseBody.tasks
}

export async function createTask(values: TaskFormValues): Promise<Task> {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })
  const responseBody = await readJsonResponse<TaskResponse>(response)

  return responseBody.task
}

export async function updateTask(taskId: string, values: TaskFormValues): Promise<Task> {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })
  const responseBody = await readJsonResponse<TaskResponse>(response)

  return responseBody.task
}

export async function deleteTask(taskId: string): Promise<void> {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'DELETE',
  })

  await readJsonResponse<{ ok: true }>(response)
}
