"use client";
import { useState } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { taskStore } from "@/store/taskStore";
import { useStore } from "zustand";
import TaskForm from "@/components/tasks/TaskForm";
import TaskDetailsDialog from "@/components/tasks/TaskDetailsDialog";
import { useTasks } from "@/hooks/useTasks";
import Tasks from "@/components/tasks/Tasks";

var searchTimeout: NodeJS.Timeout;

export default function Home() {
  const search = useStore(taskStore, (state) => state.search);
  const setSearch = useStore(taskStore, (state) => state.setSearch);
  const [localSearch, setLocalSearch] = useState(search);
  const {
    tasks,
    isLoading,
    isFetching,
    deleteTask,
    updateSubTask,
    updateTaskCompletion,
    deleteSubTask,
  } = useTasks({ search });

  const handleDeleteTask = (taskId: number) => {
    deleteTask(taskId);
  };

  const handleUpdateSubTaskStatus = (
    taskId: number,
    subtaskId: number,
    isCompleted: boolean
  ) => {
    updateSubTask({
      taskId,
      subtaskId,
      isCompleted,
    });
  };

  const handleUpdateTaskCompletion = (taskId: number, isCompleted: boolean) => {
    updateTaskCompletion({
      taskId,
      isCompleted,
    });
  };

  const handleDeleteSubTask = (taskId: number, subtaskId: number) => {
    deleteSubTask({ taskId, subtaskId });
  };

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  const handleViewTask = (taskId: number) => {
    setSelectedTask(taskId);
  };

  return (
    <div className="p-3 flex flex-col flex-1">
      <div className="flex-1 flex flex-col py-5 px-6 font-[family-name:var(--font-geist-sans)] bg-[#ffffff] border border-[#f2f2f2] rounded-xl">
        <div className="text-2xl font-semibold m-0 leading-none flex items-center gap-3">
          <div className="flex items-center">
            <span className="text-gray-500 hidden md:inline">Project / </span>
            <span>Project Name</span>
          </div>
          {isFetching && !isLoading && (
            <Loader2 size={20} className="text-[#2e6be9] animate-spin" />
          )}
        </div>
        <div className="h-[2px] bg-[#f2f2f2] w-[calc(100%+48px)] -mx-6 mt-3 mb-3"></div>

        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center bg-[#fafafa] border border-[#e2e2e2] rounded-lg px-3 py-1.5 w-full max-w-md">
            <Search size={16} className="text-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                  setSearch(e.target.value);
                }, 500);
              }}
              className="w-full bg-transparent border-none text-sm px-2 focus:outline-none focus:ring-0 placeholder:text-gray-500 truncate"
            />
          </div>

          <button
            onClick={() => setIsTaskFormOpen(true)}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-[#2e6be9] text-[#ffffff] flex items-center gap-2 flex-shrink-0"
          >
            <Plus size={16} />
            <span className="hidden md:inline">Add Task</span>
          </button>
        </div>

        <div className="h-[2px] bg-[#f2f2f2] w-[calc(100%+48px)] -mx-6 mt-3 mb-3"></div>

        <div className="flex-1 flex flex-col gap-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="text-[#2e6be9] animate-spin" />
            </div>
          ) : (
            <Tasks
              tasks={tasks || []}
              handleViewTask={handleViewTask}
              handleUpdateTaskCompletion={handleUpdateTaskCompletion}
              handleDeleteTask={handleDeleteTask}
              handleUpdateSubTaskStatus={handleUpdateSubTaskStatus}
              handleDeleteSubTask={handleDeleteSubTask}
            />
          )}
        </div>
      </div>

      {isTaskFormOpen && <TaskForm onClose={() => setIsTaskFormOpen(false)} />}

      {selectedTask && (
        <TaskDetailsDialog
          taskId={selectedTask}
          search={search}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
