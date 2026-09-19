import { taskItemHandler } from '../../apps/api/src/taskHandlers.js'
import { handleVercelRequest } from '../../apps/api/src/vercelAdapter.js'
import { IncomingMessage, ServerResponse } from 'node:http'

function getTaskId(request: Request): string {
  const url = new URL(request.url)
  const segments = url.pathname.split('/').filter(Boolean)

  return segments[segments.length - 1] ?? ''
}

async function taskHandler(request: Request): Promise<Response> {
  const taskId = getTaskId(request)

  return taskItemHandler(request, taskId)
}

export default async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  await handleVercelRequest(request, response, taskHandler)
}
