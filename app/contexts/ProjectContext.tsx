'use client';
import React, {createContext, useState, ReactNode} from 'react';
import { Project } from '@/app/lib/definitions';

interface ProjectContextType {
    projects: Project[];
    addProject: (project: Project, callback?: (response?: Response) => void) => void;
    updateProject: (project: Project, callback?: (response?: Response) => void) => void;
    deleteProject: (project: string, callback?: (response?: Response) => void) => void;
    getProjectById: (id: string) => Project | undefined;
}

interface ProjectProviderProps {
    children: ReactNode;
    initialProjects?: Project[];
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider:React.FC<ProjectProviderProps> = ({
    children,
    initialProjects = []
}) => {

    const [projects, setProjects] = useState<Project[]>(initialProjects);
    
    const addProject = (project: Project) => {
        setProjects((prevProjects)=>[project, ...prevProjects]);

        // Server/Route/DB to persist
    }
    const updateProject = (updatedProject: Project) => {
        setProjects((prevProjects) =>
            prevProjects.map((project) => (project.id === updatedProject.id ? updatedProject : project))
        );

        // Server/Route/DB to persist
    }
    const deleteProject = (projectId: string) => {
        setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));

        // Server/Route/DB to persist
    }
    const getProjectById = (id: string) => {
        return projects.find(project => project.id === id);
    }

    return (
        <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject, getProjectById }}>
            {children}
        </ProjectContext.Provider>
    );
}

export const useProjectContext = () => {
  const context = React.useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}