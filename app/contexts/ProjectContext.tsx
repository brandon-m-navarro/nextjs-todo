"use client";
import React, { createContext, useState, ReactNode } from "react";
import { Project } from "@/app/lib/definitions";

interface ProjectContextType {
  projects: Project[];
  addProject: (
    project: Project,
    callback?: (response?: Response) => void
  ) => void;
  updateProject: (
    project: Project,
    callback?: (response?: Response) => void
  ) => void;
  deleteProject: (
    project: string,
    callback?: (response?: Response) => void
  ) => void;
  getProjectById: (id: string) => Project | undefined;
}

interface ProjectProviderProps {
  children: ReactNode;
  initialProjects?: Project[];
}

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
);

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
  initialProjects = [],
}) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const addProject = async (
    project: Project,
    // callback?: (response?: Response) => void
  ) => {
    setProjects((prevProjects) => [project, ...prevProjects]);

    // Server/Route/DB to persist
    // try {
    //   const response = await fetch(`/api/projects/${project.id}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       id: project.id,
    //       name: project.name,
    //       description: project.description || null,
    //       hex_color: project.hexColor,
    //       icon: project.icon,
    //       creation_date_time: new Date(),
    //       last_modified_date_time: new Date(),
    //     }),
    //   });

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.error || "Failed to update task");
    //   }

    //   if (callback) {
    //     callback(response);
    //   }
    // } catch (error) {
    //   throw new Error("Failed to add task!" + error);
    // }
  };

  const updateProject = async (
    updatedProject: Project,
    callback?: (response?: Response) => void
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );

    // Server/Route/DB to persist
    try {
      const response = await fetch(`/api/projects/${updatedProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: updatedProject.name,
          description: updatedProject.description || null,
          hex_color: updatedProject.hexColor,
          icon: updatedProject.icon,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update project");
      }

      if (callback) {
        callback(response);
      }
    } catch (error) {
      throw new Error("Failed to update project - " + error);
    }
  };

  const deleteProject = async (projectId: string, callback?: (response?: Response) => void) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update project");
      }

      // Update context
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
      );

      if (callback) {
        callback(response);
      }
    } catch (error) {
      throw new Error("Failed to delete project - " + error);
    }
  };

  const getProjectById = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = React.useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};
