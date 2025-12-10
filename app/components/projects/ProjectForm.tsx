"use client";
import BackButton from "@/app/components/ui/back-button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectContext } from "@/app/contexts/ProjectContext";
import { Project } from "@/lib/definitions";
import { useUserContext } from "@/app/contexts/UserContext";

export default function ProjectForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const { addProject } = useProjectContext();
  const { isLoggedIn, userId } = useUserContext();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hexColor: "3B82F6", // Default blue color
    icon: "",
    isPublic: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Project name is required");
      return;
    }
    setIsSubmitting(true);
    setError("");

    // Create Project with FormData
    const projectToCreate: Omit<
      Project,
      "id" | "creationDateTime" | "lastModifiedDateTime"
    > = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      hexColor: formData.hexColor,
      icon: formData.icon.trim(),
      userId: formData.isPublic ? null : userId || null,
    };

    console.log('Creating project:', projectToCreate);

    try {
      await addProject(projectToCreate, (result) => {
        if (result?.success && result.project) {
          // Success - redirect to project page
          router.replace(`/projects/${result.project.id}`);
        } else if (result?.error) {
          // Error from callback
          setError(result.error);
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      // This will catch any errors thrown by addProject
      setError("Failed to create project - " + error);
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const colorOptions = [
    { value: "EF4444", label: "Red", color: "bg-red-500" },
    { value: "F59E0B", label: "Amber", color: "bg-amber-500" },
    { value: "10B981", label: "Emerald", color: "bg-emerald-500" },
    { value: "3B82F6", label: "Blue", color: "bg-blue-500" },
    { value: "8B5CF6", label: "Violet", color: "bg-violet-500" },
    { value: "EC4899", label: "Pink", color: "bg-pink-500" },
  ];

  return (
    <div className="max-w-6xl p-0 pb-15 sm:p-8 mx-auto text-black">
      {/* Header */}
      <div className="mb-8">
        <BackButton />
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-600 mt-2">
          Start organizing your tasks with a new project
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="space-y-6">
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
              maxLength={255}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Website Redesign, Personal Tasks, Shopping List"
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
              maxLength={4000}
              placeholder="Describe what this project is about..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </div>

          {/* isPublic Toggle */}
          {isLoggedIn && (
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPublic: e.target.checked,
                    }))
                  }
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Make this project public
                </span>
              </label>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 w-full justify-evenly">
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>
          </div>
        </div>
      </form>

      {/* Preview */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 wrap-anywhere">
          Project Preview
        </h3>
        <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
          {formData.hexColor && (
            <div
              className="w-8 h-8 rounded-full flex-shrink-0"
              style={{ backgroundColor: `#${formData.hexColor}` }}
            />
          )}
          <div>
            <h4 className="font-medium text-gray-900">
              {formData.name || "Project Name"}
            </h4>
            {formData.description && (
              <p className="text-sm text-gray-600 mt-1">
                {formData.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
