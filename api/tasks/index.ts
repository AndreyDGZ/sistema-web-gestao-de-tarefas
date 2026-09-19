import { tasksCollectionHandler } from '../../apps/api/src/taskHandlers.js'
import { handleVercelRequest } from '../../apps/api/src/vercelAdapter.js'
import { IncomingMessage, ServerResponse } from 'node:http'

export default async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  await handleVercelRequest(request, response, tasksCollectionHandler)
}
