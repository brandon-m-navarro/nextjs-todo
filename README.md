The latest version is deployed here: [https://todo.bnav.dev/](https://todo.bnav.dev/).


## Project Structure
```
app/
├── (dashboard)/                        # Route group for dashboard (not in URL)
│   ├── layout.tsx                      # Dashboard layout (<ContextProviders />)
│   ├── loading.tsx                     # Loading state for Dashboard (LiveDataPreviews component)
│   ├── providers-wrapper.tsx           # Wrapper for Project/Task/User Provider so layout can stay server-component
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
 