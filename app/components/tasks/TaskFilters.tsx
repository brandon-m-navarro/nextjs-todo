"use client";
import { useRouter } from "next/navigation";
import SelectBox from "../ui/select-box";

interface TaskFiltersProps {
  projects: Array<{ id: string; name: string }>;
  currentProject?: string;
  currentStatus?: string;
  currentSort?: string;
}

export default function TaskFilters({
  projects,
  currentProject,
  currentStatus,
  currentSort,
}: TaskFiltersProps) {
  const router = useRouter();
  const safeProjects = projects || [];
  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/tasks?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 text-black">
      <div className="h-12 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white flex items-center">
        <SelectBox
          name="current-project-select"
          options={[{ value: "", label: "All Projects" }].concat(
            safeProjects.map((project) => {
              return {
                value: project.id,
                label: project.name,
              };
            })
          )}
          value={currentProject || ""}
          onChange={(selectedProject) => {
            updateUrl({ project: selectedProject });
          }}
        />
      </div>

      <div className="h-12 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white flex items-center">
        <SelectBox
          name="status-select"
          options={[
            { value: "all", label: "All Tasks" },
            { value: "active", label: "Active Only" },
            { value: "completed", label: "Completed Only" },
          ]}
          value={currentStatus || "all"}
          onChange={(selectedStatus) => {
            updateUrl({ status: selectedStatus });
          }}
        />
      </div>

      <div className="h-12 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white flex items-center">
        <SelectBox
          name="sort-select"
          options={[
            { value: "newest", label: "Newest First" },
            { value: "oldest", label: "Oldest First" },
            { value: "due-date", label: "Due Date" },
          ]}
          value={currentSort || "newest"}
          onChange={(selectedSort) => {
            updateUrl({ sort: selectedSort });
          }}
        />
      </div>

      {(currentProject || currentStatus || currentSort) && (
        <button
          onClick={() => router.push("/tasks")}
          className="px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
