import { X, Trash2, Check, Edit2 } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useState } from "react";
import TaskForm from "./TaskForm";

interface TaskDetailsDialogProps {
  taskId: number;
  search: string;
  onClose: () => void;
}

export default function TaskDetailsDialog({
  taskId,
  search,
  onClose,
}: TaskDetailsDialogProps) {
  const {
    tasks,
    deleteTask,
    updateTaskCompletion,
    updateSubTask,
    deleteSubTask,
  } = useTasks({ search });
  const task = tasks?.find((t) => t.id === taskId);
  const [isEditing, setIsEditing] = useState(false);

  if (!task) return null;

  const handleDelete = () => {
    deleteTask(taskId, {
      onSuccess: () => onClose(),
    });
  };

  const handleComplete = () => {
    updateTaskCompletion(
      {
        taskId: taskId,
        isCompleted: true,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  const handleSubtaskComplete = (subtaskId: number) => {
    updateSubTask({
      taskId,
      subtaskId,
      isCompleted: true,
    });
  };

  const handleSubtaskDelete = (subtaskId: number) => {
    deleteSubTask({
      taskId,
      subtaskId,
    });
  };

  if (isEditing) {
    return <TaskForm onClose={() => setIsEditing(false)} initialData={task} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#f2f2f2] flex items-center justify-between">
          <div className="flex flex-1 items-center gap-2 justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-blue-500 hover:text-blue-700"
              title="Edit task"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleComplete}
              className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-green-500 hover:text-green-700"
              title="Mark as completed"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-red-500 hover:text-red-700"
              title="Delete task"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            <div className="border-b border-[#f2f2f2] pb-6">
              <div className="space-y-4">
                <div>
                  <div className="mt-2">
                    <h4 className="font-medium">{task.name}</h4>
                    {task.description && (
                      <p className="text-gray-600 mt-1 text-sm">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Priority</label>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          task.priority === "high"
                            ? "bg-red-50 text-red-600"
                            : task.priority === "medium"
                              ? "bg-yellow-50 text-yellow-600"
                              : "bg-green-50 text-green-600"
                        }`}
                      >
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}{" "}
                        Priority
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.isCompleted
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.isCompleted ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Assignees</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {[
                        ...new Set(task.subTasks.flatMap((st) => st.assignees)),
                      ].map((assignee, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                        >
                          {assignee}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Start Date</label>
                    <div className="mt-1 text-sm">
                      {task.startDate.split("T")[0]}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Due Date</label>
                    <div className="mt-1 text-sm">
                      {task.dueDate.split("T")[0]}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Subtasks</h3>
              <div className="space-y-4">
                {task.subTasks.map((subTask) => (
                  <div
                    key={subTask.id}
                    className="border border-[#f2f2f2] rounded-lg p-4 space-y-4"
                  >
                    <div>
                      <h4 className="font-medium">{subTask.name}</h4>
                      {subTask.description && (
                        <p className="text-gray-600 mt-1 text-sm">
                          {subTask.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">
                          Priority
                        </label>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                              subTask.priority === "high"
                                ? "bg-red-50 text-red-600"
                                : subTask.priority === "medium"
                                  ? "bg-yellow-50 text-yellow-600"
                                  : "bg-green-50 text-green-600"
                            }`}
                          >
                            {subTask.priority.charAt(0).toUpperCase() +
                              subTask.priority.slice(1)}{" "}
                            Priority
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Status</label>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              subTask.isCompleted
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {subTask.isCompleted ? "Completed" : "In Progress"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500">Assignees</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {subTask.assignees.map((assignee, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                          >
                            {assignee}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-500">
                            Start Date
                          </label>
                          <div className="mt-1 text-sm">
                            {subTask.startDate.split("T")[0]}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">
                            Due Date
                          </label>
                          <div className="mt-1 text-sm">
                            {subTask.dueDate.split("T")[0]}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleSubtaskComplete(subTask.id)}
                          className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-green-500 hover:text-green-700"
                          title="Mark subtask as completed"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSubtaskDelete(subTask.id)}
                          className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-red-500 hover:text-red-700"
                          title="Delete subtask"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
