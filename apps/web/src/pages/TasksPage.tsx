import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { TaskBoard } from '../features/tasks/components/TaskBoard'
import { TaskFilters } from '../features/tasks/components/TaskFilters'
import { TaskForm } from '../features/tasks/components/TaskForm'
import { TaskSummary } from '../features/tasks/components/TaskSummary'
import { useTasks } from '../features/tasks/hooks/useTasks'
import { Task, TaskFormValues, TaskStatus } from '../features/tasks/types/task.types'
import { hasActiveFilters } from '../features/tasks/utils/taskFilters'
import { Button } from '../shared/components/Button'
import { Drawer } from '../shared/components/Drawer'
import { Toast } from '../shared/components/Toast'
import { useToast } from '../shared/hooks/useToast'

type DrawerMode = 'closed' | 'create' | 'edit'

export function TasksPage() {
  const {
    tasks,
    filters,
    filteredTasks,
    assigneeOptions,
    isLoading,
    loadError,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
    resetFilters,
    retryLoad,
  } = useTasks()
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('closed')
  const [selectedTask, setSelectedTask] = useState<Task | undefined>()
  const [activeMobileStatus, setActiveMobileStatus] = useState<TaskStatus>('TODO')
  const [actionError, setActionError] = useState('')
  const { toastMessage, showToast } = useToast()
  const drawerIsOpen = drawerMode !== 'closed'

  function openCreateDrawer() {
    setActionError('')
    setSelectedTask(undefined)
    setDrawerMode('create')
  }

  function openEditDrawer(task: Task) {
    setActionError('')
    setSelectedTask(task)
    setDrawerMode('edit')
  }

  function closeDrawer() {
    setActionError('')
    setDrawerMode('closed')
    setSelectedTask(undefined)
  }

  async function handleSubmit(values: TaskFormValues): Promise<void> {
    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, values)
        showToast('Tarefa atualizada.')
        closeDrawer()
        return
      }

      await createTask(values)
      showToast('Tarefa criada com sucesso.')
      closeDrawer()
    } catch {
      setActionError('Nao foi possivel salvar a tarefa.')
    }
  }

  async function handleDelete(): Promise<void> {
    if (!selectedTask) {
      return
    }

    try {
      await deleteTask(selectedTask.id)
      showToast('Tarefa excluida.')
      closeDrawer()
    } catch {
      setActionError('Nao foi possivel excluir a tarefa.')
    }
  }

  const hasNoTasks = !isLoading && !loadError && tasks.length === 0
  const hasNoFilteredTasks = !isLoading && !loadError && tasks.length > 0 && filteredTasks.length === 0

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegacao principal">
        <div className="brand-mark" aria-hidden="true" />
        <span className="brand-name">NexaTask</span>
        <nav>
          <a className="nav-item active" href="/">
            Tarefas
          </a>
        </nav>
      </aside>
      <main className="main-content">
        <header className="page-header">
          <div>
            <p>Quadro da equipe</p>
            <h1>NexaTask</h1>
          </div>
          <Button variant="accent" type="button" onClick={openCreateDrawer}>
            <Plus size={18} aria-hidden="true" />
            Nova tarefa
          </Button>
        </header>

        {loadError ? (
          <section className="state-panel" aria-live="polite">
            <h2>Nao foi possivel carregar as tarefas.</h2>
            <Button type="button" onClick={retryLoad}>
              <RefreshCw size={18} aria-hidden="true" />
              Tentar novamente
            </Button>
          </section>
        ) : null}

        {isLoading ? (
          <section className="skeleton-grid" aria-label="Carregando tarefas">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="skeleton-card" key={index} />
            ))}
          </section>
        ) : null}

        {!isLoading && !loadError ? (
          <>
            <TaskSummary tasks={tasks} />
            <TaskFilters filters={filters} assigneeOptions={assigneeOptions} onFiltersChange={setFilters} />
            {hasNoTasks ? (
              <section className="state-panel">
                <h2>Nenhuma tarefa ainda.</h2>
                <p>Crie a primeira tarefa da sua equipe.</p>
                <Button type="button" onClick={openCreateDrawer}>
                  <Plus size={18} aria-hidden="true" />
                  Criar tarefa
                </Button>
              </section>
            ) : null}
            {hasNoFilteredTasks ? (
              <section className="state-panel">
                <h2>Nenhuma tarefa encontrada.</h2>
                <p>Ajuste a busca ou os filtros para voltar ao quadro.</p>
                {hasActiveFilters(filters) ? (
                  <Button variant="secondary" type="button" onClick={resetFilters}>
                    Limpar filtros
                  </Button>
                ) : null}
              </section>
            ) : null}
            {!hasNoTasks && !hasNoFilteredTasks ? (
              <TaskBoard
                tasks={filteredTasks}
                activeMobileStatus={activeMobileStatus}
                onMobileStatusChange={setActiveMobileStatus}
                onTaskSelect={openEditDrawer}
              />
            ) : null}
          </>
        ) : null}
      </main>
      <Drawer title={drawerMode === 'create' ? 'Nova tarefa' : 'Detalhes da tarefa'} isOpen={drawerIsOpen} onClose={closeDrawer}>
        {actionError ? <p className="drawer-error">{actionError}</p> : null}
        <TaskForm task={drawerMode === 'edit' ? selectedTask : undefined} onCancel={closeDrawer} onSubmit={handleSubmit} onDelete={handleDelete} />
      </Drawer>
      <Toast message={toastMessage} />
    </div>
  )
}
