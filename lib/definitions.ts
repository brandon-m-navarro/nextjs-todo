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

export interface TaskFromDb {
  user_id?: string | null;
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
  user_id?: string | null;
  id: string;
  name: string;
  description: string | null;
  hex_color: string | null;
  icon: string | null;
  creation_date_time: Date;
  last_modified_date_time: Date;
}

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
