import { TaskResponse, TasksResponse, taskPayloadSchema } from '@nexatask/shared'
import { badRequest, jsonResponse, methodNotAllowed, notFound, serverError } from './http.js'
import { createTask, deleteTask, listTasks, updateTask } from './taskRepository.js'

async function readRequestBody(request: Request): Promise<unknown> {
  return request.json()
}

export async function tasksCollectionHandler(request: Request): Promise<Response> {
  try {
    if (request.method === 'GET') {
      const tasks = await listTasks()
      const body: TasksResponse = { tasks }

      return jsonResponse(body)
    }

    if (request.method === 'POST') {
      const requestBody = await readRequestBody(request)
      const validationResult = taskPayloadSchema.safeParse(requestBody)

      if (!validationResult.success) {
        return badRequest(validationResult.error)
      }

      const task = await createTask(validationResult.data)
      const body: TaskResponse = { task }

      return jsonResponse(body, { status: 201 })
    }

    return methodNotAllowed()
  } catch (error) {
    return serverError(error)
  }
}

export async function taskItemHandler(request: Request, taskId: string): Promise<Response> {
  try {
    if (request.method === 'PUT') {
      const requestBody = await readRequestBody(request)
      const validationResult = taskPayloadSchema.safeParse(requestBody)

      if (!validationResult.success) {
        return badRequest(validationResult.error)
      }

      const task = await updateTask(taskId, validationResult.data)

      if (!task) {
        return notFound()
      }

      const body: TaskResponse = { task }

      return jsonResponse(body)
    }

    if (request.method === 'DELETE') {
      const deletedTask = await deleteTask(taskId)

      if (!deletedTask) {
        return notFound()
      }

      return jsonResponse({ ok: true })
    }

    return methodNotAllowed()
  } catch (error) {
    return serverError(error)
  }
}
