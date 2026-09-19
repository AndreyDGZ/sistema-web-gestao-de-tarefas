import { ApiErrorResponse } from '@nexatask/shared'
import { ZodError } from 'zod'

export interface JsonResponseOptions {
  status?: number
}

export function jsonResponse<ResponseBody>(body: ResponseBody, options: JsonResponseOptions = {}): Response {
  return Response.json(body, {
    status: options.status ?? 200,
  })
}

export function methodNotAllowed(): Response {
  const body: ApiErrorResponse = {
    message: 'Metodo nao permitido.',
  }

  return jsonResponse(body, { status: 405 })
}

export function badRequest(error: ZodError): Response {
  const body: ApiErrorResponse = {
    message: 'Dados invalidos.',
    issues: error.issues.map(issue => issue.message),
  }

  return jsonResponse(body, { status: 400 })
}

export function notFound(): Response {
  const body: ApiErrorResponse = {
    message: 'Tarefa nao encontrada.',
  }

  return jsonResponse(body, { status: 404 })
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Erro desconhecido.'
}

export function serverError(error?: unknown): Response {
  const body: ApiErrorResponse = {
    message: 'Nao foi possivel processar a solicitacao.',
    issues: error ? [getErrorMessage(error)] : undefined,
  }

  return jsonResponse(body, { status: 500 })
}
