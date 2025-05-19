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
    },
    {
        projectId: 'PRO-SHOPPING',
        tite: 'Bananas',
        description: null,
        isDone: false,
        ordinal: null,
        expectedCompletionDateTime: null,
        creationDateTime: new Date().getTime(),
        lastModifiedDateTime: new Date().getTime()
    },
    {
        projectId: 'PRO-SHOPPING',
        tite: 'Oranges',
        description: null,
        isDone: false,
        ordinal: null,
        expectedCompletionDateTime: null,
        creationDateTime: new Date().getTime(),
        lastModifiedDateTime: new Date().getTime()
    },
    {
        projectId: 'PRO-SHOPPING',
        tite: 'Black Beans',
        description: null,
        isDone: false,
        ordinal: null,
        expectedCompletionDateTime: null,
        creationDateTime: new Date().getTime(),
        lastModifiedDateTime: new Date().getTime()
    },
    {
        projectId: 'PRO-SHOPPING',
        tite: 'Rice',
        description: null,
        isDone: false,
        ordinal: null,
        expectedCompletionDateTime: null,
        creationDateTime: new Date().getTime(),
        lastModifiedDateTime: new Date().getTime()
    },
    {
        projectId: 'PRO-SHOPPING',
        tite: 'Tomatos',
        description: null,
        isDone: false,
        ordinal: null,
        expectedCompletionDateTime: null,
        creationDateTime: new Date().getTime(),
        lastModifiedDateTime: new Date().getTime()
    }
]

const Projects = [
    {
        id: 'PRO-TODOAPP', // Temp, will change with randomly generated IDs (would need to create a login, or just rely on localStorage to remember deviceID)
        name: 'Todo App',
        description: 'Will implement a fetch by ',
        hexColor: 'EEFC57',
        icon: null,
        creationDateTime: new Date().getTime(),
        lastModifiedDateTime: new Date().getTime()
    },
    {
        id: 'PRO-SHOPPING',
        name: 'Shopping List',
        description: null,
        hexColor: '28AFB0',
        icon: null,
        creationDateTime: new Date().getTime(),
        lastModifiedDateTime: new Date().getTime()
    }
]
