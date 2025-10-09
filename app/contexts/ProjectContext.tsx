"use client";
import React, { createContext, useState, ReactNode } from "react";
import { Project } from "@/app/lib/definitions";

interface ProjectContextType {
  projects: Project[];
  addProject: (
    project: Omit<Project, "id" | "creationDateTime" | "lastModifiedDateTime">,
    callback?: (response?: {
      success: boolean;
      project?: Project;
      error?: string;
    }) => void
  ) => Promise<Project | void>;
  updateProject: (
    project: Project,
    callback?: (response?: Response) => void
  ) => Promise<Response>;
  deleteProject: (
    project: string,
    callback?: (response?: Response) => void
  ) => Promise<void>;
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

  // Add Project with optimistic update and rollback on failure
  const addProject = async (
    project: Omit<Project, "id" | "creationDateTime" | "lastModifiedDateTime">,
    callback?: (response?: {
      success: boolean;
      project?: Project;
      error?: string;
    }) => void
  ) => {
    let rollback: (() => void) | null = null;
    const tempProject: Project = {
      ...project,
      id: `PRO-temp-${crypto.randomUUID()}`,
      creationDateTime: new Date(),
      lastModifiedDateTime: new Date(),
    };

    try {
      // Store rollback function
      rollback = () => {
        setProjects((prevProjects) =>
          prevProjects.filter((p) => p.id !== tempProject.id)
        );
      };

      // Optimistic update
      setProjects((prevProjects) => [tempProject, ...prevProjects]);

      const response = await fetch(`/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: project.name,
          description: project.description || null,
          hex_color: project.hexColor || null,
          icon: project.icon || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create project");
      }

      // Parse response ONCE
      const data = await response.json();
      const serverProject: Project = data.project;

      // Replace temporary project with server version
      setProjects((prev) =>
        prev.map((p) => (p.id === tempProject.id ? serverProject : p))
      );

      // Call callback with success data
      callback?.({ success: true, project: serverProject });

      return serverProject;
    } catch (error) {
      // Rollback on error
      if (rollback) {
        rollback();
      }

      console.error("Failed to add project:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add project";

      // Call callback with error
      callback?.({ success: false, error: errorMessage });

      throw error;
    }
  };

  // Update Project with optimistic update and rollback on failure
  const updateProject = async (
    updatedProject: Project,
    callback?: (response: Response) => void
  ) => {
    let rollback: (() => void) | null = null;
    try {
      // Store rollback function
      rollback = () => {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === updatedProject.id
              ? // Find the original project to restore it
                prevProjects.find((p) => p.id === updatedProject.id) || project
              : project
          )
        );
      };

      // Optimistic update
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );

      const response = await fetch(`/api/projects/${updatedProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: updatedProject.name,
          description: updatedProject.description || null,
          hex_color: updatedProject.hexColor || null,
          icon: updatedProject.icon,
          last_modified_date_time: new Date().toISOString(), // Don't forget this!
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to update project: ${response.status}`
        );
      }

      callback?.(response);
      return response;
    } catch (error) {
      // Rollback on error
      if (rollback) {
        rollback();
      }

      console.error("Failed to update project:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to update project");
    }
  };

  const deleteProject = async (
    projectId: string,
    callback?: (response?: Response) => void
  ) => {
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
