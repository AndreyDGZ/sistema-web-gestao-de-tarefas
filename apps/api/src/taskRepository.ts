import { Task, TaskPayload } from '@nexatask/shared'
import postgres from 'postgres'

interface TaskRow {
  id: string
  title: string
  description: string
  status: Task['status']
  priority: Task['priority']
  assignee_name: string
  due_date: string
  created_at: string
  updated_at: string
}

const seedDate = '2026-09-18T12:00:00.000Z'
const databaseUrl = process.env.POSTGRES_URL

if (!databaseUrl) {
  throw new Error('POSTGRES_URL is required')
}

const sql = postgres(databaseUrl, {
  ssl: 'require',
  prepare: false,
})

const seedTasks: Task[] = [
  {
    id: '1',
    title: 'Criar prototipo do Dashboard',
    description: 'Estruturar a primeira visao do quadro e seus indicadores.',
    assigneeName: 'Andrey',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    dueDate: '2026-09-20',
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: '2',
    title: 'Revisar tela de Login',
    description: 'Conferir consistencia visual e estados de formulario.',
    assigneeName: 'Lucas',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: '2026-09-21',
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: '3',
    title: 'Validar versao mobile',
    description: 'Testar abas, cards em coluna unica e alvos de toque.',
    assigneeName: 'Maria',
    priority: 'HIGH',
    status: 'TODO',
    dueDate: '2026-09-22',
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: '4',
    title: 'Preparar apresentacao',
    description: 'Organizar o roteiro da demonstracao do MVP.',
    assigneeName: 'Joao',
    priority: 'MEDIUM',
    status: 'DONE',
    dueDate: '2026-09-18',
    createdAt: seedDate,
    updatedAt: seedDate,
  },
]

function mapTaskRow(taskRow: TaskRow): Task {
  return {
    id: taskRow.id,
    title: taskRow.title,
    description: taskRow.description,
    status: taskRow.status,
    priority: taskRow.priority,
    assigneeName: taskRow.assignee_name,
    dueDate: taskRow.due_date,
    createdAt: taskRow.created_at,
    updatedAt: taskRow.updated_at,
  }
}

async function ensureTasksTable(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      assignee_name TEXT NOT NULL,
      due_date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS title TEXT`
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT`
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status TEXT`
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority TEXT`
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assignee_name TEXT`
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date TEXT`
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS created_at TEXT`
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS updated_at TEXT`
}

async function seedTasksWhenEmpty(): Promise<void> {
  const taskCountResult = await sql<{ count: string }[]>`SELECT COUNT(*)::text AS count FROM tasks`
  const taskCount = Number(taskCountResult[0]?.count ?? '0')

  if (taskCount > 0) {
    return
  }

  await Promise.all(seedTasks.map(task => insertSeedTask(task)))
}

async function insertSeedTask(task: Task): Promise<void> {
  await sql`
    INSERT INTO tasks (id, title, description, status, priority, assignee_name, due_date, created_at, updated_at)
    VALUES (${task.id}, ${task.title}, ${task.description}, ${task.status}, ${task.priority}, ${task.assigneeName}, ${task.dueDate}, ${task.createdAt}, ${task.updatedAt})
    ON CONFLICT (id) DO NOTHING
  `
}

async function prepareDatabase(): Promise<void> {
  await ensureTasksTable()
  await seedTasksWhenEmpty()
}

export async function listTasks(): Promise<Task[]> {
  await prepareDatabase()

  const tasksResult = await sql<TaskRow[]>`
    SELECT id,
           COALESCE(title, '') AS title,
           COALESCE(description, '') AS description,
           COALESCE(status, 'TODO') AS status,
           COALESCE(priority, 'MEDIUM') AS priority,
           COALESCE(assignee_name, '') AS assignee_name,
           COALESCE(due_date, '') AS due_date,
           COALESCE(created_at, '') AS created_at,
           COALESCE(updated_at, '') AS updated_at
    FROM tasks
    ORDER BY created_at DESC
  `

  return tasksResult.map(mapTaskRow)
}

export async function createTask(values: TaskPayload): Promise<Task> {
  await prepareDatabase()

  const currentDate = new Date().toISOString()
  const taskId = crypto.randomUUID()
  const createdTaskResult = await sql<TaskRow[]>`
    INSERT INTO tasks (id, title, description, status, priority, assignee_name, due_date, created_at, updated_at)
    VALUES (${taskId}, ${values.title}, ${values.description}, ${values.status}, ${values.priority}, ${values.assigneeName}, ${values.dueDate}, ${currentDate}, ${currentDate})
    RETURNING id, title, description, status, priority, assignee_name, due_date, created_at, updated_at
  `
  const createdTask = createdTaskResult[0]

  if (!createdTask) {
    throw new Error('Task creation failed')
  }

  return mapTaskRow(createdTask)
}

export async function updateTask(taskId: string, values: TaskPayload): Promise<Task | null> {
  await prepareDatabase()

  const currentDate = new Date().toISOString()
  const updatedTaskResult = await sql<TaskRow[]>`
    UPDATE tasks
    SET title = ${values.title},
        description = ${values.description},
        status = ${values.status},
        priority = ${values.priority},
        assignee_name = ${values.assigneeName},
        due_date = ${values.dueDate},
        updated_at = ${currentDate}
    WHERE id = ${taskId}
    RETURNING id, title, description, status, priority, assignee_name, due_date, created_at, updated_at
  `
  const updatedTask = updatedTaskResult[0]

  if (!updatedTask) {
    return null
  }

  return mapTaskRow(updatedTask)
}

export async function deleteTask(taskId: string): Promise<boolean> {
  await prepareDatabase()

  const deletedTaskResult = await sql<{ id: string }[]>`
    DELETE FROM tasks
    WHERE id = ${taskId}
    RETURNING id
  `

  return Boolean(deletedTaskResult[0])
}
