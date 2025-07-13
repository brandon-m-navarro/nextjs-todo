export type Task = {
    projectId: string;
    title: string;
    description?: string;
    isDone: boolean;
    ordinal?: number;
    expectedCompletionDateTime?: number;
    // complexityRating?: number; // 1-5
    // effortRating?: number; // 1-5
    // priorityRating?: number; // 1-5
    // tags?: string[]; // e.g., ['urgent', 'important'] allow multiple tags & custom tags
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

export type LS = {
    tasks: Task[];
    projects: Project[];
    lastUsedProjectId?: string;
}
