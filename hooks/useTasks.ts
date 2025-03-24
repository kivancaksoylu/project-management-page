import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  deleteTaskById,
  updateSubTaskStatus,
  updateTaskCompletion as updateTaskCompletionApi,
  deleteSubTaskById,
  createTask,
  updateTask,
} from "@/app/api/api";
import { Task } from "@/app/api/api";
type UpdateTaskCompletionParams = {
  taskId: number;
  isCompleted: boolean;
};

type UpdateSubTaskParams = {
  taskId: number;
  subtaskId: number;
  isCompleted: boolean;
};

type DeleteSubTaskParams = {
  taskId: number;
  subtaskId: number;
};

export function useTasks(queryParams?: { search: string }) {
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["tasks", queryParams],
    queryFn: () => getTasks(queryParams),
    staleTime: Infinity,
    placeholderData: (prev) => prev,
  });

  const { mutate: deleteTask } = useMutation({
    mutationFn: deleteTaskById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const { mutate: updateSubTask } = useMutation({
    mutationFn: ({ taskId, subtaskId, isCompleted }: UpdateSubTaskParams) =>
      updateSubTaskStatus(taskId, subtaskId, isCompleted),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const { mutate: updateTaskCompletion } = useMutation({
    mutationFn: ({ taskId, isCompleted }: UpdateTaskCompletionParams) =>
      updateTaskCompletionApi(taskId, isCompleted),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const { mutate: deleteSubTask } = useMutation({
    mutationFn: ({ taskId, subtaskId }: DeleteSubTaskParams) =>
      deleteSubTaskById(taskId, subtaskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const { mutate: createNewTask, isPending: isCreating } = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const { mutate: updateTaskDetails, isPending: isUpdating } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return {
    tasks,
    isLoading,
    isFetching,
    deleteTask,
    updateSubTask,
    updateTaskCompletion,
    deleteSubTask,
    createNewTask,
    isCreating,
    updateTaskDetails,
    isUpdating,
  };
}
