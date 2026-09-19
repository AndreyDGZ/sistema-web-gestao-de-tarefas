import { IncomingMessage, ServerResponse } from 'node:http'

type WebRequestHandler = (request: Request) => Promise<Response>

async function readRequestBody(request: IncomingMessage): Promise<ArrayBuffer | undefined> {
  const chunks: Buffer[] = []

  for await (const chunk of request) {
    const requestChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    chunks.push(requestChunk)
  }

  if (chunks.length === 0) {
    return undefined
  }

  const requestBody = Buffer.concat(chunks)

  return requestBody.buffer.slice(requestBody.byteOffset, requestBody.byteOffset + requestBody.byteLength)
}

function getRequestUrl(request: IncomingMessage): string {
  const host = request.headers.host ?? 'localhost'
  const protocol = request.headers['x-forwarded-proto'] ?? 'https'
  const requestPath = request.url ?? '/'
  const protocolValue = Array.isArray(protocol) ? protocol[0] : protocol

  return `${protocolValue}://${host}${requestPath}`
}

function getRequestHeaders(request: IncomingMessage): Headers {
  const headers = new Headers()

  for (const [headerName, headerValue] of Object.entries(request.headers)) {
    if (typeof headerValue === 'string') {
      headers.set(headerName, headerValue)
    }

    if (Array.isArray(headerValue)) {
      headers.set(headerName, headerValue.join(', '))
    }
  }

  return headers
}

async function createWebRequest(request: IncomingMessage): Promise<Request> {
  const requestBody = await readRequestBody(request)
  const method = request.method ?? 'GET'

  return new Request(getRequestUrl(request), {
    method,
    headers: getRequestHeaders(request),
    body: method === 'GET' || method === 'HEAD' ? undefined : requestBody,
  })
}

async function writeWebResponse(response: ServerResponse, webResponse: Response): Promise<void> {
  response.statusCode = webResponse.status

  webResponse.headers.forEach((headerValue, headerName) => {
    response.setHeader(headerName, headerValue)
  })

  const responseBody = Buffer.from(await webResponse.arrayBuffer())
  response.end(responseBody)
}

export async function handleVercelRequest(
  request: IncomingMessage,
  response: ServerResponse,
  handler: WebRequestHandler,
): Promise<void> {
  const webRequest = await createWebRequest(request)
  const webResponse = await handler(webRequest)

  await writeWebResponse(response, webResponse)
}
