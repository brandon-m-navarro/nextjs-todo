export type Task = {
    projectId: string;
    id: string;
    title: string;
    description: string | null;
    isDone: boolean;
    ordinal: number | null;
    expectedCompletionDateTime: Date | null;
    // complexityRating?: number; // 1-5
    // effortRating?: number; // 1-5
    // priorityRating?: number; // 1-5
    // tags?: string[]; // e.g., ['urgent', 'important'] allow multiple tags & custom tags
    creationDateTime: Date;
    lastModifiedDateTime: Date;
}

export interface TaskFromDb {
    project_id: string;
    id: string;
    title: string;
    description: string | null;
    is_done: boolean;
    ordinal: number;
    expected_completion_date_time: Date | null;
    creation_date_time: Date;
    last_modified_date_time: Date;
}

export interface ProjectFromDb {
    id: string;
    name: string;
    description?: string | null;
    hex_color: string | null;
    icon: string | null;
    creation_date_time: Date;
    last_modified_date_time: Date;
}

export interface TaskWithProject {
    id: string;
    title: string;
    description: string | null;
    isDone: boolean;
    ordinal?: number | null;
    expectedCompletionDateTime?: Date | null;
    creationDateTime: Date;
    lastModifiedDateTime: Date;
    
    projectId: string;
    projectName: string;
    projectColor?: string | null;
}


export type Project = {
    id: string;
    name: string;
    description?: string | null;
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
