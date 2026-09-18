import { tasksCollectionHandler } from '../../apps/api/src/taskHandlers.js'

export default async function handler(request: Request): Promise<Response> {
  return tasksCollectionHandler(request)
}
