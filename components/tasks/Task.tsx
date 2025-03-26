import { Task as ApiTask } from "@/app/api/api";
import { ChevronDown, ChevronRight, Eye, Trash2, X, Check } from "lucide-react";
import { memo, useState } from "react";

type TaskProps = {
  task: ApiTask;
  handleViewTask: (id: number) => void;
  handleUpdateTaskCompletion: (id: number, completed: boolean) => void;
  handleDeleteTask: (id: number) => void;
  handleUpdateSubTaskStatus: (
    taskId: number,
    subTaskId: number,
    completed: boolean,
  ) => void;
  handleDeleteSubTask: (taskId: number, subTaskId: number) => void;
  isTaskCompleted: boolean;
};

const Task = ({
  task,
  handleViewTask,
  handleUpdateTaskCompletion,
  handleDeleteTask,
  handleUpdateSubTaskStatus,
  handleDeleteSubTask,
  isTaskCompleted,
}: TaskProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const renderPriority = (priority: string) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm ${
          priority === "high"
            ? "bg-red-50 text-red-600"
            : priority === "medium"
              ? "bg-yellow-50 text-yellow-600"
              : "bg-green-50 text-green-600"
        }`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </span>
    );
  };

  const renderPrioritySmall = (priority: string) => {
    return (
      <div className="md:hidden flex items-center">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            task.priority === "high"
              ? "bg-red-500"
              : task.priority === "medium"
                ? "bg-yellow-500"
                : "bg-green-500"
          }`}
        ></div>
      </div>
    );
  };

  return (
    <div key={task.id} className="group">
      <div className="grid grid-cols-[1fr] md:grid-cols-6 gap-4 px-4 py-3 border-b border-border-default hover:bg-gray-50 items-center">
        <div className="flex items-center justify-between md:justify-start w-full">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            <div className="py-1 min-w-0 max-w-[200px]">
              <span className="text-sm truncate block">{task.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {renderPrioritySmall(task.priority)}

            <div className="md:hidden flex items-center">
              <button
                onClick={() => handleViewTask(task.id)}
                className="p-1.5 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-gray-500 hover:text-gray-700"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center -space-x-2">
          {[...new Set(task.subTasks.flatMap((st) => st.assignees))].map(
            (assignee, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
              >
                {assignee.charAt(0).toUpperCase()}
              </div>
            ),
          )}
        </div>
        <div className="hidden md:flex items-center">
          {task.startDate.split("T")[0]}
        </div>
        <div className="hidden md:flex items-center">
          {renderPriority(task.priority)}
        </div>
        <div className="hidden md:flex items-center">
          {task.dueDate.split("T")[0]}
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => handleViewTask(task.id)}
            className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-gray-500 hover:text-gray-700"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              handleUpdateTaskCompletion(task.id, !isTaskCompleted)
            }
            className={`p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] 
            ${!isTaskCompleted ? "text-green-500 hover:text-green-700" : "text-red-500 hover:text-red-700"}`}
          >
            {!isTaskCompleted ? (
              <Check className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>
          <button
            className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-red-500 hover:text-red-700"
            onClick={() => handleDeleteTask(task.id)}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isExpanded &&
        task.subTasks.map(
          (subTask, index) =>
            subTask.isCompleted === isTaskCompleted && (
              <div
                key={index}
                className="grid grid-cols-[1fr] md:grid-cols-6 gap-4 px-4 py-3 border-b border-border-default bg-gray-50/50 items-center"
              >
                <div className="flex items-center justify-between md:justify-start w-full">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-[28px] flex-shrink-0"></div>
                    <span className="text-sm truncate block">
                      {subTask.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {renderPrioritySmall(subTask.priority)}
                    <div className="md:hidden flex items-center">
                      <button
                        onClick={() => handleViewTask(task.id)}
                        className="p-1.5 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-gray-500 hover:text-gray-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center -space-x-2">
                  {subTask.assignees.map((assignee, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                    >
                      {assignee.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
                <div className="hidden md:flex items-center">
                  {subTask.startDate.split("T")[0]}
                </div>
                <div className="hidden md:flex items-center">
                  {renderPriority(subTask.priority)}
                </div>
                <div className="hidden md:flex items-center">
                  {subTask.dueDate.split("T")[0]}
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => handleViewTask(task.id)}
                    className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-gray-500 hover:text-gray-700"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateSubTaskStatus(
                        task.id,
                        subTask.id,
                        !subTask.isCompleted,
                      );
                    }}
                    className={`p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] 
                    ${!subTask.isCompleted ? "text-green-500 hover:text-green-700" : "text-red-500 hover:text-red-700"}`}
                  >
                    {!subTask.isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteSubTask(task.id, subTask.id)}
                    className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ),
        )}
    </div>
  );
};

export default memo(Task);
