This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


## Getting Started

The latest version is deployed here: [https://nextjs-todo-lake.vercel.app/](https://nextjs-todo-lake.vercel.app/).


## Getting Started (Locally)

1. Clone the Repository
```bash
git clone <your-repo-url>
cd <your-repo-directory>
```

2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set Up Environment Variables & the Database
I used the following tutorial to connect my db, going with a Postgres db:
https://nextjs.org/learn/dashboard-app/setting-up-your-database

5. Run the Development Server
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
│   ├── layout.tsx                      # Dashboard layout (<ContextProviders />)
│   ├── loading.tsx                     # Loading state for Dashboard (LiveDataPreviews component)
│   ├── providers-wrapper.tsx           # Wrapper for Project/Task Provider so layout can stay server-component
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
│   │   ├── accordion.tsx
│   │   ├── animation.tsx
│   │   ├── back-button.tsx
│   │   ├── button.tsx
│   │   ├── datepicker.tsx
│   │   ├── fonts.ts
│   │   ├── rubiks-cube.tsx             # Unused, just did as an exercise
│   │   ├── select-box.tsx
│   │   └── spinner.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx                # Unused
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
│       ├── ProjectGrid.tsx             # Unused
│       └── ProjectPageComponent.tsx
├── contexts/                           # Help manage state and keep UI components synced with data in the Context
│   ├── ProjectContext.tsx
│   └── TaskContext.tsx
├── lib/
│   ├── db.ts                           # Database utilities
│   ├── definitions.ts                  # Shared TypeScript types
│   ├── ls.ts                           # LocalStorage helpers
│   ├── placeholder-data.ts             # Data used for seeding db
│   └── utilities.ts                    # Shared utility functions
├── scripts/
│   ├── create-tables.ts                # SQL table creation
│   └── seed.ts                         # DB seeding script
├── layout.tsx                          # Root layout
├── page.tsx                            # Homepage (/)
└── globals.css                         # Tailwind/global styles
```
