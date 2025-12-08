export type Task = {
  id: string;
  userId?: string | null;
  projectId: string;
  title: string;
  description?: string | null;
  isDone: boolean;
  ordinal?: number | null;
  expectedCompletionDateTime?: Date | null;
  creationDateTime: Date;
  lastModifiedDateTime: Date;
};

export type Project = {
  id: string;
  userId?: string | null;
  name: string;
  description?: string | null;
  hexColor?: string | null;
  icon?: string | null;
  creationDateTime: Date;
  lastModifiedDateTime: Date;
};

export interface TaskWithProject {
  id: string;
  userId?: string | null;
  title: string;
  description?: string | null;
  isDone: boolean;
  ordinal?: number | null;
  expectedCompletionDateTime?: Date | null;
  creationDateTime: Date;
  lastModifiedDateTime: Date;

  projectId: string;
  projectName: string;
  projectColor?: string | null;
}
