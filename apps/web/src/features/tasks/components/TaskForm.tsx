import { FormEvent, useMemo, useState } from 'react'
import { ZodError } from 'zod'
import { Button } from '../../../shared/components/Button'
import { SelectField, TextAreaField, TextField } from '../../../shared/components/Field'
import { taskSchema } from '../schemas/taskSchema'
import { Task, TaskFormValues } from '../types/task.types'
import { taskPriorityLabels, taskPriorityOrder, taskStatusLabels, taskStatusOrder } from '../utils/taskLabels'

interface TaskFormProps {
  task?: Task
  onCancel: () => void
  onSubmit: (values: TaskFormValues) => Promise<void>
  onDelete?: () => Promise<void>
}

type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>

const emptyValues: TaskFormValues = {
  title: '',
  description: '',
  assigneeName: '',
  priority: 'MEDIUM',
  status: 'TODO',
  dueDate: '',
}

function getInitialValues(task?: Task): TaskFormValues {
  if (!task) {
    return emptyValues
  }

  return {
    title: task.title,
    description: task.description,
    assigneeName: task.assigneeName,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate,
  }
}

function getErrors(error: ZodError<TaskFormValues>) {
  return error.issues.reduce<TaskFormErrors>((currentErrors, issue) => {
    const fieldName = issue.path[0]

    if (typeof fieldName === 'string' && fieldName in emptyValues) {
      return {
        ...currentErrors,
        [fieldName]: issue.message,
      }
    }

    return currentErrors
  }, {})
}

export function TaskForm({ task, onCancel, onSubmit, onDelete }: TaskFormProps) {
  const initialValues = useMemo(() => getInitialValues(task), [task])
  const [values, setValues] = useState<TaskFormValues>(initialValues)
  const [errors, setErrors] = useState<TaskFormErrors>({})
  const isEditMode = Boolean(task)

  function updateField<FieldName extends keyof TaskFormValues>(fieldName: FieldName, value: TaskFormValues[FieldName]) {
    setValues(currentValues => ({
      ...currentValues,
      [fieldName]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    const result = taskSchema.safeParse(values)

    if (!result.success) {
      setErrors(getErrors(result.error))
      return
    }

    setErrors({})
    await onSubmit(result.data)
  }

  async function handleDelete(): Promise<void> {
    const confirmed = window.confirm('Excluir esta tarefa?')

    if (!confirmed || !onDelete) {
      return
    }

    await onDelete()
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-content">
        <TextField
          id="task-title"
          label="Titulo"
          required
          value={values.title}
          error={errors.title}
          placeholder="Criar pagina de Login"
          onChange={event => updateField('title', event.target.value)}
        />
        <TextAreaField
          id="task-description"
          label="Descricao"
          value={values.description}
          error={errors.description}
          placeholder="Detalhe o trabalho esperado"
          rows={4}
          onChange={event => updateField('description', event.target.value)}
        />
        <TextField
          id="task-assignee"
          label="Responsavel"
          required
          value={values.assigneeName}
          error={errors.assigneeName}
          placeholder="Andrey"
          onChange={event => updateField('assigneeName', event.target.value)}
        />
        <div className="task-form-grid">
          <SelectField
            id="task-priority"
            label="Prioridade"
            required
            value={values.priority}
            error={errors.priority}
            onChange={event => updateField('priority', event.target.value as TaskFormValues['priority'])}
          >
            {taskPriorityOrder.map(priority => (
              <option key={priority} value={priority}>
                {taskPriorityLabels[priority]}
              </option>
            ))}
          </SelectField>
          <SelectField
            id="task-status"
            label="Status"
            required
            value={values.status}
            error={errors.status}
            onChange={event => updateField('status', event.target.value as TaskFormValues['status'])}
          >
            {taskStatusOrder.map(status => (
              <option key={status} value={status}>
                {taskStatusLabels[status]}
              </option>
            ))}
          </SelectField>
        </div>
        <TextField
          id="task-due-date"
          label="Prazo"
          type="date"
          value={values.dueDate}
          error={errors.dueDate}
          onChange={event => updateField('dueDate', event.target.value)}
        />
      </div>
      <div className="task-form-actions">
        {isEditMode ? (
          <Button variant="danger" type="button" onClick={handleDelete}>
            Excluir
          </Button>
        ) : null}
        <div className="task-form-action-group">
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{isEditMode ? 'Salvar' : 'Criar tarefa'}</Button>
        </div>
      </div>
    </form>
  )
}
