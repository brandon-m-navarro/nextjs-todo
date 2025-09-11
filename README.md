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
├── (dashboard)/                        # Route group for dashboard (not in URL)
│   ├── layout.tsx                      # Dashboard layout (sidebar, etc.)
│   ├── page.tsx                        # /dashboard - Dashboard overview
│   ├── tasks/
│   │   ├── page.tsx                    # /dashboard/tasks - All tasks
│   │   ├── new/
│   │   │   └── page.tsx                # /dashboard/tasks/new - New task form
│   │   └── [id]/
│   │       └── page.tsx                # /dashboard/tasks/[id] - Task detail
│   └── projects/
│       ├── page.tsx                    # /dashboard/projects - Projects list
│       ├── new/
│       │   └── page.tsx                # /dashboard/projects/new - New project form
│       └── [projectId]/
│           └── page.tsx                # /dashboard/projects/[projectId] - Project detail
├── api/
│   ├── tasks/
│   │   ├── route.ts                    # /api/tasks (GET/POST)
│   │   └── [id]/
│   │       └── route.ts                # /api/tasks/[id] (GET/PUT/DELETE)
│   └── projects/
│       ├── route.ts                    # /api/projects (GET/POST)
│       ├── [projectId]/
│       │   ├── route.ts                # /api/projects/[projectId] (GET/PUT/DELETE)
│       │   └── tasks/
│       │       ├── route.ts            # /api/projects/[projectId]/tasks (GET/POST)
│       │       └── [taskId]/
│       │           └── route.ts        # /api/projects/[projectId]/tasks/[taskId] (GET/PUT/DELETE)
├── components/
│   ├── ui/                             # Shared UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── animation.tsx
│   ├── tasks/
│   │   ├── TaskForm.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskCard.tsx
│   │   └── TaskFormAccordion.tsx
│   └── projects/
│       ├── ProjectCard.tsx
│       ├── ProjectSidebar.tsx (not implemented)
│       └── ProjectView.tsx
├── lib/
│   ├── db.ts                           # Database utilities
│   ├── ls.ts                           # LocalStorage helpers
│   └── definitions.ts                  # Shared TypeScript types
├── scripts/
│   ├── create-tables.ts                # SQL table creation
│   └── seed.ts                         # DB seeding script
├── layout.tsx                          # Root layout
├── page.tsx                            # Homepage (/)
└── globals.css                         # Tailwind/global styles
```