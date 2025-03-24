import { useState } from "react";
import { Task as ApiTask } from "@/app/api/api";
import { ChevronDown, ChevronRight, Eye, Trash2, Check, X } from "lucide-react";
interface TaskProps {
  tasks: ApiTask[];
  handleViewTask: (taskId: number) => void;
  handleUpdateTaskCompletion: (taskId: number, isCompleted: boolean) => void;
  handleDeleteTask: (taskId: number) => void;
  handleUpdateSubTaskStatus: (
    taskId: number,
    subtaskId: number,
    isCompleted: boolean
  ) => void;
  handleDeleteSubTask: (taskId: number, subtaskId: number) => void;
}

const Tasks = ({
  tasks,
  handleViewTask,
  handleUpdateTaskCompletion,
  handleDeleteTask,
  handleUpdateSubTaskStatus,
  handleDeleteSubTask,
}: TaskProps) => {
  const [expandedTasks, setExpandedTasks] = useState<number[]>([]);
  const [expandedTasksCompleted, setExpandedTasksCompleted] = useState<
    number[]
  >([]);
  const toggleTask = (taskId: number) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };
  const toggleTaskCompleted = (taskId: number) => {
    setExpandedTasksCompleted((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <>
      {tasks?.some(
        (task) =>
          !task.isCompleted || task.subTasks.some((st) => !st.isCompleted)
      ) && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Progress</h2>
          <div className="hidden md:grid grid-cols-6  mb-4 gap-4 px-4 py-3 bg-[#fafafa] rounded-lg text-sm text-gray-600">
            <div>Name Task</div>
            <div>Assigne To</div>
            <div>Start Date</div>
            <div>Priority</div>
            <div>Due Date</div>
            <div>Action</div>
          </div>
          <div className="flex flex-col">
            {tasks.map(
              (task) =>
                (!task.isCompleted ||
                  task.subTasks.some((st) => !st.isCompleted)) && (
                  <div key={task.id} className="group">
                    <div className="grid grid-cols-[1fr] md:grid-cols-6 gap-4 px-4 py-3 border-b border-[#f2f2f2] hover:bg-gray-50 items-center">
                      <div className="flex items-center justify-between md:justify-start w-full">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                          >
                            {expandedTasks.includes(task.id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                          <div className="py-1 min-w-0 max-w-[200px]">
                            <span className="text-sm truncate block">
                              {task.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
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
                        {[
                          ...new Set(
                            task.subTasks.flatMap((st) => st.assignees)
                          ),
                        ].map((assignee, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                          >
                            {assignee.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                      <div className="hidden md:flex items-center">
                        {task.startDate.split("T")[0]}
                      </div>
                      <div className="hidden md:flex items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
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
                            handleUpdateTaskCompletion(task.id, true)
                          }
                          className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-green-500 hover:text-green-700"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {expandedTasks.includes(task.id) &&
                      task.subTasks.map(
                        (subTask, index) =>
                          !subTask.isCompleted && (
                            <div
                              key={index}
                              className="grid grid-cols-[1fr] md:grid-cols-6 gap-4 px-4 py-3 border-b border-[#f2f2f2] bg-gray-50/50 items-center"
                            >
                              <div className="flex items-center justify-between md:justify-start w-full">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <div className="w-[28px] flex-shrink-0"></div>
                                  <div className="py-1 min-w-0 max-w-[200px]">
                                    <span className="text-sm truncate block">
                                      {subTask.name}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="md:hidden flex items-center">
                                    <div
                                      className={`w-2.5 h-2.5 rounded-full ${
                                        subTask.priority === "high"
                                          ? "bg-red-500"
                                          : subTask.priority === "medium"
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                                      }`}
                                    ></div>
                                  </div>

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
                                <span
                                  className={`px-3 py-1 rounded-full text-sm ${
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
                                      true
                                    );
                                  }}
                                  className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-green-500 hover:text-green-700"
                                >
                                  <Check className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteSubTask(task.id, subTask.id)
                                  }
                                  className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          )
                      )}
                  </div>
                )
            )}
          </div>
        </div>
      )}
      {tasks?.some(
        (task) => task.isCompleted || task.subTasks.some((st) => st.isCompleted)
      ) && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Completed</h2>
          <div className="hidden md:grid grid-cols-6  mb-4 gap-4 px-4 py-3 bg-[#fafafa] rounded-lg text-sm text-gray-600">
            <div>Name Task</div>
            <div>Assigne To</div>
            <div>Start Date</div>
            <div>Priority</div>
            <div>Due Date</div>
            <div>Action</div>
          </div>
          <div className="flex flex-col">
            {tasks.map(
              (task) =>
                (task.isCompleted ||
                  task.subTasks.some((st) => st.isCompleted)) && (
                  <div key={task.id} className="group">
                    <div className="grid grid-cols-[1fr] md:grid-cols-6 gap-4 px-4 py-3 border-b border-[#f2f2f2] hover:bg-gray-50 items-center">
                      <div className="flex items-center justify-between md:justify-start w-full">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <button
                            onClick={() => toggleTaskCompleted(task.id)}
                            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                          >
                            {expandedTasksCompleted.includes(task.id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                          <div className="py-1 min-w-0 max-w-[200px]">
                            <span className="text-sm truncate block">
                              {task.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
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
                        {[
                          ...new Set(
                            task.subTasks.flatMap((st) => st.assignees)
                          ),
                        ].map((assignee, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                          >
                            {assignee.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                      <div className="hidden md:flex items-center">
                        {task.startDate.split("T")[0]}
                      </div>
                      <div className="hidden md:flex items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
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
                            handleUpdateTaskCompletion(task.id, false)
                          }
                          className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-red-500 hover:text-green-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {expandedTasksCompleted.includes(task.id) &&
                      task.subTasks.map(
                        (subTask, index) =>
                          subTask.isCompleted && (
                            <div
                              key={index}
                              className="grid grid-cols-[1fr] md:grid-cols-6 gap-4 px-4 py-3 border-b border-[#f2f2f2] bg-gray-50/50 items-center"
                            >
                              <div className="flex items-center justify-between md:justify-start w-full">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <div className="w-[28px] flex-shrink-0"></div>
                                  <div className="py-1 min-w-0 max-w-[200px]">
                                    <span className="text-sm truncate block">
                                      {subTask.name}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="md:hidden flex items-center">
                                    <div
                                      className={`w-2.5 h-2.5 rounded-full ${
                                        subTask.priority === "high"
                                          ? "bg-red-500"
                                          : subTask.priority === "medium"
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                                      }`}
                                    ></div>
                                  </div>

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
                                <span
                                  className={`px-3 py-1 rounded-full text-sm ${
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
                                      false
                                    );
                                  }}
                                  className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-red-500 hover:text-green-700"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteSubTask(task.id, subTask.id)
                                  }
                                  className="p-2 bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          )
                      )}
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Tasks;
