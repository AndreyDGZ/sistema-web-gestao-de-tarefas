# NexaTask

🚀 **NexaTask** é um monorepo fullstack para gestão de tarefas de equipe. O projeto combina um frontend responsivo em React/Vite com uma API em Vercel Functions e banco Postgres no Supabase.

## 🧭 Visão Geral

O MVP permite que uma equipe visualize, crie, edite, filtre, acompanhe e exclua tarefas em um quadro simples com três status:

- A fazer
- Em andamento
- Concluídas

A interface segue o design system **Vantage**, localizado em `nexatask-design/`.

## 🧱 Estrutura Do Monorepo

```text
api/                 Entrypoints das Vercel Functions
apps/api/            Handlers, repositório e regras da API
apps/web/            Aplicação React + Vite
packages/shared/     Tipos, schemas e constantes compartilhadas
nexatask-design/     Design system Vantage
```

## ✨ Funcionalidades

- 📋 Quadro de tarefas por status
- ➕ Criação de tarefas
- ✏️ Edição de tarefas
- 🗑️ Exclusão com confirmação
- 🔎 Busca por título
- 🎛️ Filtros por responsável, prioridade e status
- 📊 Cards de resumo
- 📱 Layout responsivo para desktop, tablet e mobile
- 🔔 Toasts de feedback
- 🧩 API compartilhando tipos com o frontend

## 🛠️ Tecnologias

- React
- TypeScript
- Vite
- Zod
- Vercel Functions
- Supabase Postgres
- Lucide React
- Vantage Design System

## ⚙️ Variáveis De Ambiente

A API usa variáveis server-side para acessar o banco e o client do Supabase:

```text
POSTGRES_URL=
SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

`POSTGRES_URL` é usado pela API atual para SQL direto com o pacote `postgres`. `SUPABASE_URL` e `SUPABASE_SECRET_KEY` são usadas pelo Supabase client server-side em `apps/api`.

Não exponha `POSTGRES_URL` nem `SUPABASE_SECRET_KEY` no frontend. Como o acesso ao banco passa pela API, não é necessário copiar chaves do Supabase para o browser neste MVP.

## ▶️ Como Rodar Localmente

```bash
npm install
npm run dev
```

O comando `npm run dev` usa `npx vercel dev`, porque o projeto depende das rotas serverless em `api/`.

## ✅ Validação

```bash
npm run typecheck
npm run build
```

## 🌐 Deploy Na Vercel

1. Crie ou conecte o repositório na Vercel.
2. Use `master` como branch principal de produção.
3. Mantenha o projeto na raiz do monorepo.
4. Configure `POSTGRES_URL`, `SUPABASE_URL` e `SUPABASE_SECRET_KEY` nos ambientes `Production`, `Preview` e `Development`.
5. Faça novo deploy após alterar variáveis de ambiente.

## 🟩 Supabase + Vercel

### 1. Criar O Banco No Supabase

1. Acesse o Supabase.
2. Crie um novo projeto.
3. Aguarde o banco Postgres ficar ativo.
4. Copie a connection string compatível com Node/Postgres.

### 2. Conectar Pela Integração Da Vercel

A integração Supabase na Vercel pode sincronizar variáveis automaticamente, incluindo `POSTGRES_URL`, `SUPABASE_URL` e `SUPABASE_SECRET_KEY`, quando o recurso é criado/conectado pelo Marketplace da Vercel.

Fluxo recomendado:

1. Abra o projeto na Vercel.
2. Acesse a área de Storage ou Integrations.
3. Conecte Supabase ao projeto.
4. Confirme se `POSTGRES_URL`, `SUPABASE_URL` e `SUPABASE_SECRET_KEY` apareceram nas variáveis do projeto.
5. Garanta que as variáveis estejam disponíveis em `Production`, `Preview` e `Development`.

### 3. Configurar Manualmente Quando Necessário

Se a integração não sincronizar a variável automaticamente:

1. Vá em `Project Settings`.
2. Abra `Environment Variables`.
3. Adicione `POSTGRES_URL`, `SUPABASE_URL` e `SUPABASE_SECRET_KEY`.
4. Selecione os ambientes necessários.
5. Salve e rode um novo deploy.

### 4. Rodar Local Com Variáveis Da Vercel

```bash
npx vercel link
npx vercel env pull
npm run dev
```

O `vercel dev` também pode carregar variáveis de desenvolvimento vinculadas ao projeto.

### 5. Validar A Conexão

Depois de configurar o banco:

1. Abra a aplicação.
2. Acesse `/api/tasks`.
3. Confirme que a API retorna uma lista de tarefas.
4. Crie uma tarefa pela interface.
5. Atualize a página e confirme que a tarefa persistiu.

## 📡 API

```text
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

A API cria a tabela `tasks` se ela ainda não existir e adiciona dados iniciais quando a tabela está vazia.

## 🔒 Regra Máxima De Qualidade

- Zero `any`, `as any`, `@ts-ignore` e `@ts-expect-error`.
- Zero comentário no código-fonte.
- Zero nome ruim ou variável de uma letra, exceto índice trivial `for (let i = ...)`.
- Funções pequenas, com uma responsabilidade.
- Early return antes de aninhamento profundo.
- Reuso antes de criar helper, hook, service ou componente novo.
- Sem código morto, import não usado, variável não usada ou `console.log`.
- Legibilidade acima de esperteza.

## 🌿 Branch Oficial

Este projeto usa `master` como branch oficial. O branch `main` antigo deve ser removido para evitar divergência.
