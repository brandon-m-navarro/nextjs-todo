'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hexColor: '3B82F6', // Default blue color
    icon: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Send POST request to your API route
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const result = await response.json();
      
      // Redirect to the new project's page
      router.push(`/projects/${result.project.id}`);
      router.refresh(); // Refresh the server components

    } catch (error) {
      console.error('Failed to create project:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create project. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const colorOptions = [
    { value: 'EF4444', label: 'Red', color: 'bg-red-500' },
    { value: 'F59E0B', label: 'Amber', color: 'bg-amber-500' },
    { value: '10B981', label: 'Emerald', color: 'bg-emerald-500' },
    { value: '3B82F6', label: 'Blue', color: 'bg-blue-500' },
    { value: '8B5CF6', label: 'Violet', color: 'bg-violet-500' },
    { value: 'EC4899', label: 'Pink', color: 'bg-pink-500' },
  ];

  return (
    <div className="max-w-2xl mx-auto text-black">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/"
          className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-600 mt-2">Start organizing your tasks with a new project</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
              placeholder="e.g., Website Redesign, Personal Tasks, Shopping List"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
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
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative cursor-pointer rounded-full p-1 ${
                    formData.hexColor === option.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
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
                    title={option.label}
                  />
                </label>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Selected: #{formData.hexColor}
            </div>
          </div>

          {/* Icon (Optional) */}
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
              Icon (Optional)
            </label>
            <input
              type="text"
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 🏠, 💼, 🎯 (emoji or icon name)"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Link
              href="/"
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 text-center transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>
      </form>

      {/* Preview */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Preview</h3>
        <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
          {formData.hexColor && (
            <div
              className="w-8 h-8 rounded-full flex-shrink-0"
              style={{ backgroundColor: `#${formData.hexColor}` }}
            />
          )}
          <div>
            <h4 className="font-medium text-gray-900">
              {formData.name || 'Project Name'}
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
