export type Task = {
    projectId: string;
    id: string;
    title: string;
    description: string | null;
    isDone: boolean;
    ordinal: number;
    expectedCompletionDateTime: Date | null;
    // complexityRating?: number; // 1-5
    // effortRating?: number; // 1-5
    // priorityRating?: number; // 1-5
    // tags?: string[]; // e.g., ['urgent', 'important'] allow multiple tags & custom tags
    creationDateTime: Date;
    lastModifiedDateTime: Date;
}

export type Project = {
    id: string;
    name: string;
    description?: string;
    hexColor: string | null;
    icon: string | null;
    creationDateTime: Date;
    lastModifiedDateTime: Date;
}

export type LS = {
    tasks: Task[];
    projects: Project[];
    lastUsedProjectId?: string;
}
