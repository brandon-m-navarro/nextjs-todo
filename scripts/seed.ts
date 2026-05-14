import { Tasks, Projects } from '../lib/placeholder-data'
import prisma from "@/lib/prisma";

async function main() {
  try {
    console.log('🌱 Starting database seed with Prisma...')

    await prisma.$transaction(async (tx) => {
      console.log('🧹 Clearing existing data...')
      await tx.task.deleteMany()
      await tx.project.deleteMany()

      // ---------------------
      // SEED PROJECTS
      // ---------------------
      console.log('📦 Seeding projects...')
      
      for (const projectData of Projects) {
        await tx.project.upsert({
          where: { id: projectData.id },
          update: {
            name: projectData.name,
            description: projectData.description,
            hexColor: projectData.hexColor,
            icon: projectData.icon,
            lastModifiedDateTime: new Date(projectData.lastModifiedDateTime)
          },
          create: {
            id: projectData.id,
            userId: null,
            name: projectData.name,
            description: projectData.description,
            hexColor: projectData.hexColor,
            icon: projectData.icon,
            creationDateTime: new Date(projectData.creationDateTime),
            lastModifiedDateTime: new Date(projectData.lastModifiedDateTime)
          }
        })
      }

      // ---------------------
      // SEED TASKS
      // ---------------------
      console.log('📝 Seeding tasks...')
      
      for (const taskData of Tasks) {
        await tx.task.upsert({
          where: { id: taskData.id },
          update: {
            title: taskData.title,
            description: taskData.description,
            isDone: taskData.isDone,
            ordinal: taskData.ordinal,
            expectedCompletionDateTime: taskData.expectedCompletionDateTime 
              ? new Date(taskData.expectedCompletionDateTime) 
              : null,
            lastModifiedDateTime: new Date(taskData.lastModifiedDateTime)
          },
          create: {
            id: taskData.id,
            userId: null,
            projectId: taskData.projectId,
            title: taskData.title,
            description: taskData.description,
            isDone: taskData.isDone,
            ordinal: taskData.ordinal,
            expectedCompletionDateTime: taskData.expectedCompletionDateTime 
              ? new Date(taskData.expectedCompletionDateTime) 
              : null,
            creationDateTime: new Date(taskData.creationDateTime),
            lastModifiedDateTime: new Date(taskData.lastModifiedDateTime)
          }
        })
      }
    })

    console.log('✅ Seed completed successfully!')
  } catch (err) {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
