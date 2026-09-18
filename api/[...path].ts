import { taskItemHandler, tasksCollectionHandler } from '../apps/api/src/taskHandlers.js'
import { notFound } from '../apps/api/src/http.js'

function getApiPath(request: Request): string {
  const requestUrl = new URL(request.url)

  return requestUrl.pathname.replace(/^\/api\/?/, '')
}

export default async function handler(request: Request): Promise<Response> {
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
