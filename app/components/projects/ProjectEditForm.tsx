"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/definitions";
import { useProjectContext } from "@/app/contexts/ProjectContext";
import Accordion from "../ui/accordion";

interface ProjectEditFormProps {
  projectId: string;
}

export default function ProjectEditForm({ projectId }: ProjectEditFormProps) {
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

  // Sync form data when project changes
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
      setIsNavigating(true);

      const updatedProject: Project = {
        ...project,
        name: formData.name,
        description: formData.description === "" ? null : formData.description,
        hexColor:
          formData.hexColor !== "" ? formData.hexColor.replace("#", "") : null,
        icon: formData.icon || null,
      };

      updateProject(updatedProject, () => {
        router.back();
        router.refresh();
      });
    } catch (error) {
      console.error("Error updating project:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update project"
      );
    } finally {
      setIsSubmitting(false);
      setIsNavigating(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this project? All associated Tasks will also be deleted!"
      )
    )
      return;

    setIsDeleting(true);
    setError("");
    setIsNavigating(true); // Set navigating immediately

    try {
      // Use a small timeout to ensure navigation state is set
      await new Promise((resolve) => setTimeout(resolve, 100));

      deleteProject(project.id, () => {
        router.back();
        router.back();
        router.refresh();
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

  // // Common color options for projects
  // const colorOptions = [
  //   { value: "#3b82f6", label: "Blue" },
  //   { value: "#ef4444", label: "Red" },
  //   { value: "#10b981", label: "Green" },
  //   { value: "#f59e0b", label: "Yellow" },
  //   { value: "#8b5cf6", label: "Purple" },
  //   { value: "#ec4899", label: "Pink" },
  //   { value: "#06b6d4", label: "Cyan" },
  //   { value: "#f97316", label: "Orange" },
  // ];
  const colorOptions = [
    { value: "EF4444", label: "Red", color: "bg-red-500" },
    { value: "F59E0B", label: "Amber", color: "bg-amber-500" },
    { value: "10B981", label: "Emerald", color: "bg-emerald-500" },
    { value: "3B82F6", label: "Blue", color: "bg-blue-500" },
    { value: "8B5CF6", label: "Violet", color: "bg-violet-500" },
    { value: "EC4899", label: "Pink", color: "bg-pink-500" },
  ];

  // Common icon options (you can use emojis or icon library)
  // const iconOptions = [
  //   { value: "📝", label: "Memo" },
  //   { value: "💼", label: "Briefcase" },
  //   { value: "🎯", label: "Target" },
  //   { value: "🚀", label: "Rocket" },
  //   { value: "🏠", label: "Home" },
  //   { value: "🛒", label: "Shopping" },
  //   { value: "🏋️", label: "Fitness" },
  //   { value: "📚", label: "Books" },
  // ];

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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Color
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {colorOptions.map((option) => (
              <label
                key={option.value}
                className={`relative cursor-pointer rounded-lg p-2 flex flex-col items-center space-y-2 border-2 transition-colors ${
                  formData.hexColor === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-transparent hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="hexColor"
                  value={option.value}
                  checked={formData.hexColor === option.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-8 h-8 rounded-full ${option.color} border border-gray-300`}
                />
              </label>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Selected: #{formData.hexColor}
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
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon (Optional)
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {iconOptions.map((option) => (
              <label
                key={option.value}
                className={`relative cursor-pointer rounded-lg p-2 flex flex-col items-center space-y-2 border-2 transition-colors ${
                  formData.icon === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-transparent hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="icon"
                  value={option.value}
                  checked={formData.icon === option.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-8 h-8 text-center text-2xl`}
                >{option.value}</div>
              </label>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Selected: {formData.icon}
          </div>
          <input
            type="text"
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder=""
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            Choose from presets or enter a custom emoji
          </p>
        </div> */}

        {/* Form Actions */}
        <div className="flex justify-between sm:w-full sm:justify-self-start sm:gap-4 pt-6 border-t border-gray-200">
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
            className="hidden sm:block px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ml-auto"
          >
            {isDeleting ? "Deleting..." : "Delete Project"}
          </button>
        </div>
        <div className="sm:hidden mt-12">
          <Accordion
            render={({ isOpen, toggle, contentHeight, contentRef }) => (
              <div>
                <div
                  className="p-4 cursor-pointer flex justify-between items-center bg-blue-50"
                  onClick={toggle}
                >
                  <h1 className="text-[12px] font-medium">
                    Additional Options
                  </h1>
                  <span className="transform transition-transform duration-300">
                    {isOpen ? <span>▼</span> : <span>►</span>}
                  </span>
                </div>

                <div
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{ height: isOpen ? `${contentHeight}px` : "0px" }}
                >
                  <div
                    ref={contentRef}
                    className="p-6 border-t border-gray-200"
                  >
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full m-auto"
                    >
                      {isDeleting ? "Deleting..." : "Delete Project"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </form>
    </div>
  );
}
