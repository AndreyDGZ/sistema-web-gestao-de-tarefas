import { taskItemHandler } from '../../apps/api/src/taskHandlers'

function getTaskId(request: Request): string {
  const url = new URL(request.url)
  const segments = url.pathname.split('/').filter(Boolean)

  return segments[segments.length - 1] ?? ''
}

export default async function handler(request: Request): Promise<Response> {
  const taskId = getTaskId(request)

  return taskItemHandler(request, taskId)
}
