export type Task = {
  userId?: string | null;
  projectId: string;
  id: string;
  title: string;
  description: string | null;
  isDone: boolean;
  ordinal: number | null;
  expectedCompletionDateTime: Date | null;
  creationDateTime: Date;
  lastModifiedDateTime: Date;
};

export type Project = {
  userId?: string | null;
  id: string;
  name: string;
  description: string | null;
  hexColor: string | null;
  icon: string | null;
  creationDateTime: Date;
  lastModifiedDateTime: Date;
};

export interface TaskWithProject {
  userId?: string | null;
  id: string;
  title: string;
  description: string | null;
  isDone: boolean;
  ordinal: number | null;
  expectedCompletionDateTime?: Date | null;
  creationDateTime: Date;
  lastModifiedDateTime: Date;

  projectId: string;
  projectName: string;
  projectColor?: string | null;
}

export type LS = {
  userId?: string | null;
  tasks: Task[];
  projects: Project[];
  lastUsedProjectId?: string;
};
