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
│   ├── layout.tsx                      # Dashboard layout
│   ├── loading.tsx                     # Loading state for Dashboard (LiveDataPreviews component)
│   ├── providers-wrapper.tsx           # Wrapper for Project/Task Provider so layout can stay server
│   ├── tasks/
│   │   ├── page.tsx                    # /(dashboard)/tasks - All tasks
│   │   ├── new/
│   │   │   └── page.tsx                # /(dashboard)/tasks/new - New task form
│   │   └── [id]/
│   │       ├── page.tsx                # /(dashboard)/tasks/[id] - Task detail
│   │       └── edit/
│   │           └── page.tsx            # /(dashboard)/tasks/[id]/edit - Edit task
│   └── projects/
│       ├── page.tsx                    # /(dashboard)/projects - Show all Projects
│       ├── new/
│       │   └── page.tsx                # /(dashboard)/projects/new - New project form
│       └── [projectId]/
│           └── page.tsx                # /(dashboard)/projects/[projectId] - Project's details & Tasks
├── api/
│   ├── tasks/
│   │   ├── route.ts                    # /api/tasks (GET/POST)
│   │   └── recent/
│   │       └── route.ts                # /api/tasks/recent (GET)
│   │   └── [id]/
│   │       └── route.ts                # /api/tasks/[id] (GET/PUT/DELETE)
│   └── projects/
│       ├── route.ts                    # /api/projects (GET/POST)
│       ├── [projectId]/
│       │   ├── route.ts                # /api/projects/[projectId] (GET/PUT/DELETE)
│       │   └── tasks/
│       └──     └── route.ts            # /api/projects/[projectId]/tasks (GET/POST)
├── components/
│   ├── dashboard/
│   │   └── LiveDataPreviews.tsx
│   ├── ui/                             # Shared UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── animation.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskDetails.tsx
│   │   ├── TaskEditForm.tsx
│   │   ├── TaskFilters.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskFormAccordion.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskManager.tsx
│   │   └── TaskPageComponents.tsx
│   └── projects/
│       ├── ProjectCard.tsx
│       ├── ProjectChooser.tsx
│       ├── ProjectEditForm.tsx
│       ├── ProjectForm.tsx
│       ├── ProjectGrid.tsx
│       └── ProjectPageComponent.tsx
├── contexts/
│   ├── ProjectContext.tsx
│   └── TaskContext.tsx
├── lib/
│   ├── db.ts                           # Database utilities
│   ├── definitions.ts                  # Shared TypeScript types
│   ├── ls.ts                           # LocalStorage helpers
│   ├── placeholder-data.ts             #
│   └── utilities.ts                    #
├── scripts/
│   ├── create-tables.ts                # SQL table creation
│   └── seed.ts                         # DB seeding script
├── layout.tsx                          # Root layout
├── page.tsx                            # Homepage (/)
└── globals.css                         # Tailwind/global styles
```