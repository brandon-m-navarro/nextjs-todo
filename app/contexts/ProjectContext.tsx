"use client";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { Project } from "@/lib/definitions";
// import { useUserContext } from "./UserContext";

interface ProjectContextType {
  projects: Project[];
  publicProjects: Project[];
  privateProjects: Project[];
  isLoading: boolean;
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
    callback?: (response?: {
      success: boolean;
      project?: Project;
      error?: string;
    }) => void
  ) => Promise<Project | void>;
  deleteProject: (
    project: string,
    callback?: (response?: {
      success: boolean;
      project?: Project;
      error?: string;
    }) => void
  ) => Promise<Project | void>;
  getProjectById: (id: string) => Project | undefined;
}

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
);

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const [publicProjects, setPublicProjects] = useState<Project[]>([]);
  const [privateProjects, setPrivateProjects] = useState<Project[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  // const { userId } = useUserContext();

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/projects");
        
        if (response.ok) {
          const data = await response.json();

          setPublicProjects(data.public || []);
          setPrivateProjects(data.private || []);

          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

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
        // Check if tempProject is public or private to determine which setter to use
        if (tempProject.userId) {
          // When a function is passed to a useState setter, the current state is passed as a param
          setPrivateProjects((prevPrivateProjects) =>
            prevPrivateProjects.filter((p) => p.id !== tempProject.id)
          );
        } else {
          setPublicProjects((prevPublicProjects) =>
            prevPublicProjects.filter((p) => p.id !== tempProject.id)
          );
        }

        // Keep legacy code until private/publicProjects are fully implemented
        setProjects((prevProjects) =>
          prevProjects.filter((p) => p.id !== tempProject.id)
        );
      };

      // Optimistic update
      if (tempProject.userId) {
        setPrivateProjects((prevPrivateProjects) => [
          tempProject,
          ...prevPrivateProjects,
        ]);
      } else {
        setPublicProjects((prevPublicProjects) => [
          tempProject,
          ...prevPublicProjects,
        ]);
      }

      // Optimistic update (Keep legacy code until private/publicProjects are fully implemented)
      setProjects((prevProjects) => [tempProject, ...prevProjects]);

      const response = await fetch(`/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: project.name,
          description: project.description || null,
          hexColor: project.hexColor || null,
          icon: project.icon || null,
          userId: project.userId || null,
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

      if (tempProject.userId) {
        setPrivateProjects((prev) =>
          prev.map((p) => (p.id === tempProject.id ? serverProject : p))
        );
      } else {
        setPublicProjects((prev) =>
          prev.map((p) => (p.id === tempProject.id ? serverProject : p))
        );
      }

      // Call callback with success data
      callback?.({ success: true, project: serverProject });
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
    }
  };

  // Update Project with optimistic update and rollback on failure
  const updateProject = async (
    updatedProject: Project,
    callback?: (response?: {
      success: boolean;
      project?: Project;
      error?: string;
    }) => void
  ) => {
    let rollback: (() => void) | null = null;
    const originalProjects: Project[] = [...projects],
      originalPublic: Project[] = [...publicProjects],
      originalPrivate: Project[] = [...privateProjects],
      isCurrentlyPublic: boolean = publicProjects.some(
        (p) => p.id === updatedProject.id
      ),
      willBePublic: boolean = updatedProject.userId == null;

    try {
      // Optimistic update
      if (isCurrentlyPublic && !willBePublic) {
        // Moving from public to private
        setPublicProjects((prev) =>
          prev.filter((p) => p.id !== updatedProject.id)
        );
        setPrivateProjects((prev) => [...prev, updatedProject]);
      } else if (!isCurrentlyPublic && willBePublic) {
        // Moving from private to public
        setPrivateProjects((prev) =>
          prev.filter((p) => p.id !== updatedProject.id)
        );
        setPublicProjects((prev) => [...prev, updatedProject]);
      } else {
        // Same visibility, just update in place
        if (isCurrentlyPublic) {
          setPublicProjects((prev) =>
            prev.map((project) =>
              project.id === updatedProject.id ? updatedProject : project
            )
          );
        } else {
          setPrivateProjects((prev) =>
            prev.map((project) =>
              project.id === updatedProject.id ? updatedProject : project
            )
          );
        }
      }

      // Optimistic update
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );

      // Create rollback
      rollback = () => {
        setProjects(originalProjects);
        setPublicProjects(originalPublic);
        setPrivateProjects(originalPrivate);
      };

      const response = await fetch(`/api/projects/${updatedProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: updatedProject.name,
          description: updatedProject.description || null,
          hexColor: updatedProject.hexColor || null,
          icon: updatedProject.icon,
          userId: updatedProject.userId || null,
          lastModifiedDateTime: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to update project: ${response.status}`
        );
      }

      // Call callback with success data
      const data = await response.json();
      const serverProject: Project = data.project;
      callback?.({ success: true, project: serverProject });

      return serverProject;
    } catch (error) {
      // Rollback on error
      if (rollback) {
        rollback();
      }

      console.error("Failed to update project:", error);
      callback?.({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update Project",
      });
    }
  };

  const deleteProject = async (
    projectId: string,
    callback?: (response?: {
      success: boolean;
      project?: Project;
      error?: string;
    }) => void
  ) => {
    let rollback: (() => void) | null = null;
    const originalProjects: Project[] = [...projects],
      originalPublic: Project[] = [...publicProjects],
      originalPrivate: Project[] = [...privateProjects],
      isPrivate: boolean = privateProjects.some((p) => p.id === projectId);

    try {
      // Define rollback function
      rollback = () => {
        setProjects(originalProjects);
        setPublicProjects(originalPublic);
        setPrivateProjects(originalPrivate);
      };

      let projectToDelete;
      if (isPrivate) {
        projectToDelete = privateProjects.find((p) => p.id === projectId);
      } else {
        projectToDelete = publicProjects.find((p) => p.id === projectId);
      }

      if (!projectToDelete) {
        throw new Error("Project not found for deletion");
      }

      // Optimistically remove project from context
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
      );

      if (isPrivate) {
        setPrivateProjects((prevPrivateProjects) =>
          prevPrivateProjects.filter((project) => project.id !== projectId)
        );
      } else {
        setPublicProjects((prevPublicProjects) =>
          prevPublicProjects.filter((project) => project.id !== projectId)
        );
      }

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

      // Call callback with success data
      const data = await response.json();
      const serverProject: Project = data.project;
      callback?.({ success: true, project: serverProject });

      return serverProject;
    } catch (error) {
      // Rollback on error
      if (rollback) {
        rollback();
      }
      console.error("Failed to delete project:", error);
      callback?.({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete Project",
      });
      throw error instanceof Error
        ? error
        : new Error("Failed to delete project");
    }
  };

  const getProjectById = (id: string) => {
    const isPrivate: boolean = privateProjects.some((p) => p.id === id);

    if (isPrivate) {
      return privateProjects.find((project) => project.id === id);
    } else {
      return publicProjects.find((project) => project.id === id);
    }
    // return projects.find((project) => project.id === id);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        publicProjects,
        privateProjects,
        isLoading,
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
