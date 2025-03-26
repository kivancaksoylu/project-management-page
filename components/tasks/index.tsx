"use client";
import { useState, useMemo, useCallback, memo } from "react";
import { Task as ApiTask } from "@/app/api/api";
import Task from "./Task";
import CustomSearch from "../CustomSearch";
import { Plus, Loader2 } from "lucide-react";
import { useStore } from "zustand";
import { taskStore } from "@/store/taskStore";
import { useTasks } from "@/hooks/useTasks";
import TaskForm from "./TaskForm";
import TaskDetailsDialog from "./TaskDetailsDialog";
interface TaskProps {}

const Tasks = ({}: TaskProps) => {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const search = useStore(taskStore, (state) => state.search);
  const setSearch = useStore(taskStore, (state) => state.setSearch);
  const {
    tasks,
    isLoading,
    isFetching,
    deleteTask,
    updateSubTask,
    updateTaskCompletion,
    deleteSubTask,
  } = useTasks({ search });

  const handleDeleteTask = useCallback(
    (taskId: number) => {
      deleteTask(taskId);
    },
    [deleteTask],
  );

  const handleUpdateSubTaskStatus = useCallback(
    (taskId: number, subtaskId: number, isCompleted: boolean) => {
      updateSubTask({
        taskId,
        subtaskId,
        isCompleted,
      });
    },
    [updateSubTask],
  );

  const handleUpdateTaskCompletion = useCallback(
    (taskId: number, isCompleted: boolean) => {
      updateTaskCompletion({
        taskId,
        isCompleted,
      });
    },
    [updateTaskCompletion],
  );

  const handleDeleteSubTask = useCallback(
    (taskId: number, subtaskId: number) => {
      deleteSubTask({ taskId, subtaskId });
    },
    [deleteSubTask],
  );

  const handleViewTask = useCallback(
    (taskId: number) => {
      setSelectedTask(taskId);
    },
    [setSelectedTask],
  );

  const filteredTasks = useMemo(() => {
    var inProgressArr: ApiTask[] = [];
    var completedArr: ApiTask[] = [];

    tasks?.forEach((task) => {
      if (!task.isCompleted || task.subTasks.some((st) => !st.isCompleted)) {
        inProgressArr.push(task);
      }
      if (task.isCompleted || task.subTasks.some((st) => st.isCompleted)) {
        completedArr.push(task);
      }
    });

    return { inProgressArr, completedArr };
  }, [tasks]);

  const renderHeader = useCallback((title: string) => {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="hidden md:grid grid-cols-6  mb-4 gap-4 px-4 py-3 bg-background rounded-lg text-sm text-gray-600">
          <div>Name Task</div>
          <div>Assigne To</div>
          <div>Start Date</div>
          <div>Priority</div>
          <div>Due Date</div>
          <div>Action</div>
        </div>
      </div>
    );
  }, []);

  return (
    <>
      <div className="flex justify-start items-center gap-4">
        <CustomSearch search={search} setSearch={setSearch} />
        {isFetching && !isLoading && (
          <Loader2 size={20} className="text-primary animate-spin" />
        )}
        <div className="flex-1" />
        <button
          onClick={() => setIsTaskFormOpen(true)}
          className="px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground flex items-center gap-2 flex-shrink-0 self-end"
        >
          <Plus size={16} />
          <span className="hidden md:inline">Add Task</span>
        </button>
      </div>
      <div className="h-[2px] bg-border-default w-[calc(100%+48px)] -mx-6 mt-3 mb-3"></div>
      <div className="flex-1 flex flex-col gap-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="text-primary animate-spin" />
          </div>
        ) : (
          <>
            {filteredTasks.inProgressArr.length > 0 && (
              <div>
                {renderHeader("Progress")}
                <div className="flex flex-col">
                  {filteredTasks.inProgressArr.map((task) => (
                    <Task
                      key={task.id + "-progress"}
                      task={task}
                      isTaskCompleted={false}
                      handleViewTask={handleViewTask}
                      handleUpdateTaskCompletion={handleUpdateTaskCompletion}
                      handleDeleteTask={handleDeleteTask}
                      handleUpdateSubTaskStatus={handleUpdateSubTaskStatus}
                      handleDeleteSubTask={handleDeleteSubTask}
                    />
                  ))}
                </div>
              </div>
            )}
            {filteredTasks.completedArr.length > 0 && (
              <div>
                {renderHeader("Completed")}
                <div className="flex flex-col">
                  {filteredTasks.completedArr.map((task) => (
                    <Task
                      key={task.id + "-completed"}
                      task={task}
                      isTaskCompleted={true}
                      handleViewTask={handleViewTask}
                      handleUpdateTaskCompletion={handleUpdateTaskCompletion}
                      handleDeleteTask={handleDeleteTask}
                      handleUpdateSubTaskStatus={handleUpdateSubTaskStatus}
                      handleDeleteSubTask={handleDeleteSubTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {isTaskFormOpen && <TaskForm onClose={() => setIsTaskFormOpen(false)} />}

      {selectedTask && (
        <TaskDetailsDialog
          taskId={selectedTask}
          search={search}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
};

export default memo(Tasks);
