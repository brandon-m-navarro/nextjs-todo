export type Task = {
    projectId: string;
    title: string;
    description?: string;
    isDone: boolean;
    ordinal?: number;
    expectedCompletionDateTime?: number;
    creationDateTime: number;
    lastModifiedDateTime: number;
}

export type Project = {
    id: string;
    name: string;
    description?: string;
    hexColor?: string;
    icon?: string;
    creationDateTime: number;
    lastModifiedDateTime: number;
}
