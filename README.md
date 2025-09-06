This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Project Structure
```
app/
├── (dashboard)/                   # Route group for main app
│   ├── layout.tsx                 # Main app layout with sidebar
│   ├── page.tsx                   # /dashboard - Overview/default view
│   ├── tasks/
│   │   ├── page.tsx               # /dashboard/tasks - All tasks view
│   │   ├── new/
│   │   │   └── page.tsx           # /dashboard/tasks/new - Task form
│   │   └── [id]/
│   │       └── page.tsx           # /dashboard/tasks/123 - Task detail
│   └── projects/
│       ├── page.tsx               # /dashboard/projects - Projects list
│       ├── [projectId]/
│       │   └── page.tsx           # /dashboard/projects/PRO-123 - Single project view
│       └── new/
│           └── page.tsx           # /dashboard/projects/new - New project form
├── api/
│   ├── tasks/
│   │   └── route.ts               # API endpoints for tasks
│   └── projects/
│       └── route.ts               # API endpoints for projects
├── components/                    # Shared components
│   ├── ui/                        # Basic UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── tasks/
│   │   ├── TaskForm.tsx           # Reusable task form
│   │   ├── TaskList.tsx           # Task list component
│   │   └── TaskCard.tsx           # Individual task item
│   └── projects/
│       ├── ProjectCard.tsx        # Project display card
│       ├── ProjectSidebar.tsx     # Sidebar navigation
│       └── ProjectView.tsx        # Main project view component
├── lib/                           # Utilities and hooks
│   ├── db.ts                      # Database utilities
│   ├── hooks/
│   │   ├── useTasks.ts
│   │   └── useProjects.ts
│   ├── ls.ts                      # LocalStorage module
│   └── definitions.ts             # Shared TypeScript types
├── scripts/
│   ├── create-tables.ts           # Executes SQL statements to init tables
│   └── seed.ts                    # Clears and seeds DB with placeholder-data
├── layout.tsx                     # Root layout
├── page.tsx                       # Homepage (/)
└── globals.css
```