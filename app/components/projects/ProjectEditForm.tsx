"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/app/lib/definitions";
import { useProjectContext } from "@/app/contexts/ProjectContext";

interface ProjectEditFormProps {
  projectId: string;
}

export function ProjectEditForm({ projectId }: ProjectEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState("");
  const { getProjectById, updateProject, deleteProject } = useProjectContext();
  const project = getProjectById(projectId);

  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    hexColor: project?.hexColor || "",
    icon: project?.icon || "",
  });

  // Initialize form data when project loads
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || "",
        hexColor: project.hexColor || "",
        icon: project.icon || "",
      });
    }
  }, [project]);

  // Prevent component from rendering if navigating away
  if (isNavigating) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Handle project not found
  if (!project) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Project not found.</p>
          <button
            onClick={() => router.push("/projects")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      console.log("Submitting form data:", formData);
      const updatedProject: Project = {
        ...project,
        name: formData.name,
        description: formData.description === "" ? null : formData.description,
        hexColor: formData.hexColor || null,
        icon: formData.icon || null,
      };
console.log("Updated project object:", updatedProject);
      updateProject(updatedProject, (response) => {
        console.log("ASYNC: Project updated successfully", response);

        setIsNavigating(true);

        // Redirect to project detail page on success
        router.replace(`/projects/${project.id}`);
        // router.back(); // Go back to the previous page
        router.refresh(); // Refresh the server components
      });
    } catch (error) {
      console.error("Error updating project:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update project"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setIsDeleting(true);
    setError("");
    setIsNavigating(true); // Set navigating immediately

    try {
      // Use a small timeout to ensure navigation state is set
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect to projects list on success
      deleteProject(project.id, () => {
        router.push("/projects");
        router.refresh(); // Refresh the server components
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete project"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Common color options for projects
  const colorOptions = [
    { value: "#3b82f6", label: "Blue" },
    { value: "#ef4444", label: "Red" },
    { value: "#10b981", label: "Green" },
    { value: "#f59e0b", label: "Yellow" },
    { value: "#8b5cf6", label: "Purple" },
    { value: "#ec4899", label: "Pink" },
    { value: "#06b6d4", label: "Cyan" },
    { value: "#f97316", label: "Orange" },
  ];

  // Common icon options (you can use emojis or icon library)
  const iconOptions = [
    { value: "📝", label: "Memo" },
    { value: "💼", label: "Briefcase" },
    { value: "🎯", label: "Target" },
    { value: "🚀", label: "Rocket" },
    { value: "🏠", label: "Home" },
    { value: "🛒", label: "Shopping" },
    { value: "🏋️", label: "Fitness" },
    { value: "📚", label: "Books" },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Project Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe what this project is about..."
          />
        </div>

        {/* Color Selection */}
        <div>
          <label
            htmlFor="hexColor"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Color
          </label>
          <div className="grid grid-cols-4 gap-3 mb-3">
            {colorOptions.map((color) => (
              <label
                key={color.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="hexColor"
                  value={color.value}
                  checked={formData.hexColor === color.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.hexColor === color.value
                      ? "border-gray-800"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-sm text-gray-600">{color.label}</span>
              </label>
            ))}
          </div>
          <input
            type="text"
            id="hexColor"
            name="hexColor"
            value={formData.hexColor}
            onChange={handleChange}
            placeholder="#3b82f6"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            Choose from presets or enter a custom hex color
          </p>
        </div>

        {/* Icon Selection */}
        <div>
          <label
            htmlFor="icon"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Icon
          </label>
          <div className="grid grid-cols-4 gap-3 mb-3">
            {iconOptions.map((icon) => (
              <label
                key={icon.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="icon"
                  value={icon.value}
                  checked={formData.icon === icon.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-12 flex items-center justify-center text-2xl rounded-lg border-2 ${
                    formData.icon === icon.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  {icon.value}
                </div>
                <span className="text-sm text-gray-600">{icon.label}</span>
              </label>
            ))}
          </div>
          <input
            type="text"
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="🎯"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            Choose from presets or enter a custom emoji
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Updating..." : "Update Project"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? "Deleting..." : "Delete Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
