const HOUR_MILLIS = 1000 * 60 * 60;
const DAY_MILLIS = HOUR_MILLIS * 24;
const WEEK_MILLIS = DAY_MILLIS * 7;

const Tasks = [
    {
        projectId: 'PRO-TODOAPP',
        tite: 'Create Wireframes',
        description: 'Description . . .',
        isDone: true,
        ordinal: 0,
        expectedCompletionDateTime: new Date().getTime(),
        creationDateTime: new Date().getTime(),
        lastModifiedDateTime: new Date().getTime()
    },
    {
        projectId: 'PRO-TODOAPP',
        tite: 'Refine Mockups',
        description: 'Description . . .',
        isDone: false,
        ordinal: 1,
        expectedCompletionDateTime: new Date().getTime() + DAY_MILLIS,
        creationDateTime: new Date().getTime(),
        lastModifiedDateTime: new Date().getTime()
    },
    {
        projectId: 'PRO-TODOAPP',
        tite: 'Implement JS Skeleton',
        description: 'Description . . .',
        isDone: false,
        ordinal: 2,
        expectedCompletionDateTime: new Date().getTime() + (2 * DAY_MILLIS),
        creationDateTime: new Date().getTime(),
        lastModifiedDateTime: new Date().getTime()
    }
]

const Projects = [
    {
        id: 'PRO-TODOAPP', // Temp, will change with randomly generated IDs (would need to create a login, or just rely on localStorage to remember deviceID)
        name: 'Todo App',
        description: 'This is an exercise in futility that will lead to nothing',
        hexColor: '00ff00',
        icon: null,
        creationDateTime: new Date().getTime(),
        lastModifiedDateTime: new Date().getTime()
    }
]
