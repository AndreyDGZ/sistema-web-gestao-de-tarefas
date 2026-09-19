import { taskItemHandler, tasksCollectionHandler } from '../apps/api/src/taskHandlers.js'
import { notFound } from '../apps/api/src/http.js'
import { handleVercelRequest } from '../apps/api/src/vercelAdapter.js'
import { IncomingMessage, ServerResponse } from 'node:http'

function getApiPath(request: Request): string {
  const requestUrl = new URL(request.url, 'https://nexatask.local')

  return requestUrl.pathname.replace(/^\/api\/?/, '')
}

async function apiHandler(request: Request): Promise<Response> {
  const apiPath = getApiPath(request)

  if (apiPath === 'tasks') {
    return tasksCollectionHandler(request)
  }

  const taskPathMatch = /^tasks\/([^/]+)$/.exec(apiPath)

  if (taskPathMatch) {
    const taskId = taskPathMatch[1]

    return taskItemHandler(request, taskId)
  }

  return notFound()
}

export default async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  await handleVercelRequest(request, response, apiHandler)
}
