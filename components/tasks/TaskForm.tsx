"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";
import { X } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/app/api/api";

export const taskSchema = z.object({
  name: z.string().min(3, "Task name must be at least 3 characters"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  subTasks: z.array(
    z.object({
      id: z.number(),
      name: z.string().min(3, "Subtask name must be at least 3 characters"),
      description: z.string().min(1, "Description is required"),
      assignees: z.string().min(1, "Assignees are required"),
      startDate: z.date({
        required_error: "Start date is required",
      }),
      dueDate: z.date({
        required_error: "Due date is required",
      }),
      priority: z.enum(["low", "medium", "high"]),
      isCompleted: z.boolean().default(false),
    })
  ),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onClose: () => void;
  initialData?: Task;
}

export default function TaskForm({ onClose, initialData }: TaskFormProps) {
  const { createNewTask, updateTaskDetails, isCreating, isUpdating } =
    useTasks();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          startDate: new Date(initialData.startDate),
          dueDate: new Date(initialData.dueDate),
          subTasks: initialData.subTasks.map((st) => ({
            ...st,
            startDate: new Date(st.startDate),
            dueDate: new Date(st.dueDate),
            assignees: st.assignees.join(", "),
          })),
        }
      : {
          priority: "medium",
          startDate: new Date(),
          dueDate: new Date(),
          subTasks: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subTasks",
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-xl w-full max-w-3xl m-4 flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        <div className="sticky top-0 z-10 bg-white border-b border-[#f2f2f2] px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-semibold">
            {initialData ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form
            onSubmit={handleSubmit((data) => {
              const processedData = {
                ...data,
                startDate: data.startDate.toISOString(),
                dueDate: data.dueDate.toISOString(),
                subTasks: data.subTasks.map((subTask) => ({
                  ...subTask,
                  startDate: subTask.startDate.toISOString(),
                  dueDate: subTask.dueDate.toISOString(),
                  assignees: subTask.assignees
                    .split(",")
                    .map((assignee) => assignee.trim())
                    .filter((assignee) => assignee !== ""),
                })),
              };

              if (initialData) {
                updateTaskDetails(
                  {
                    ...processedData,
                    id: initialData.id,
                    isCompleted: initialData.isCompleted,
                  },
                  {
                    onSuccess: () => onClose(),
                  }
                );
              } else {
                createNewTask(processedData, {
                  onSuccess: () => onClose(),
                });
              }
            })}
            autoComplete="off"
            className="p-6 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Task Name
                </label>
                <input
                  {...register("name")}
                  autoComplete="off"
                  className="w-full p-2 border border-[#e2e2e2] rounded-lg bg-[#fafafa] focus:outline-none focus:ring-1 focus:ring-[#2e6be9]"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <select
                  {...register("priority")}
                  className="w-full p-2 border border-[#e2e2e2] rounded-lg bg-[#fafafa] focus:outline-none focus:ring-1 focus:ring-[#2e6be9]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      autoComplete="off"
                      className="w-full p-2 border border-[#e2e2e2] rounded-lg bg-[#fafafa] focus:outline-none focus:ring-1 focus:ring-[#2e6be9]"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="DD/MM/YYYY"
                    />
                  )}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Due Date
                </label>
                <Controller
                  control={control}
                  name="dueDate"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      autoComplete="off"
                      className="w-full p-2 border border-[#e2e2e2] rounded-lg bg-[#fafafa] focus:outline-none focus:ring-1 focus:ring-[#2e6be9]"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="DD/MM/YYYY"
                      minDate={new Date()}
                    />
                  )}
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                autoComplete="off"
                className="w-full p-2 border border-[#e2e2e2] rounded-lg bg-[#fafafa] focus:outline-none focus:ring-1 focus:ring-[#2e6be9]"
                rows={3}
              />
            </div>

            <div className="border border-[#e2e2e2] rounded-lg p-4">
              <h3 className="font-medium mb-4">Subtasks</h3>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border border-[#e2e2e2] rounded-lg bg-[#fafafa]"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Subtask Name
                          </label>
                          <input
                            {...register(`subTasks.${index}.name`)}
                            autoComplete="off"
                            className="w-full p-2 border border-[#e2e2e2] rounded-lg"
                          />
                          {errors.subTasks?.[index]?.name && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.subTasks[index]?.name?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Description
                          </label>
                          <input
                            {...register(`subTasks.${index}.description`)}
                            autoComplete="off"
                            className="w-full p-2 border border-[#e2e2e2] rounded-lg"
                          />
                          {errors.subTasks?.[index]?.description && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.subTasks[index]?.description?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Assignees (Comma separated)
                          </label>
                          <input
                            {...register(`subTasks.${index}.assignees`)}
                            autoComplete="off"
                            placeholder="e.g., John, Jane, Bob"
                            className="w-full p-2 border border-[#e2e2e2] rounded-lg"
                          />
                          {errors.subTasks?.[index]?.assignees && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.subTasks[index]?.assignees?.message}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Start Date
                            </label>
                            <Controller
                              control={control}
                              name={`subTasks.${index}.startDate`}
                              render={({ field }) => (
                                <DatePicker
                                  selected={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  autoComplete="off"
                                  className="w-full p-2 border border-[#e2e2e2] rounded-lg"
                                  dateFormat="dd/MM/yyyy"
                                  placeholderText="DD/MM/YYYY"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Due Date
                            </label>
                            <Controller
                              control={control}
                              name={`subTasks.${index}.dueDate`}
                              render={({ field }) => (
                                <DatePicker
                                  selected={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  autoComplete="off"
                                  className="w-full p-2 border border-[#e2e2e2] rounded-lg"
                                  dateFormat="dd/MM/yyyy"
                                  placeholderText="DD/MM/YYYY"
                                  minDate={new Date()}
                                />
                              )}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Priority
                          </label>
                          <select
                            {...register(`subTasks.${index}.priority`)}
                            className="w-full p-2 border border-[#e2e2e2] rounded-lg"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mt-4 px-3 py-1.5 bg-red-500 text-white rounded-md text-sm"
                    >
                      Remove Subtask
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    append({
                      id: Date.now(),
                      name: "",
                      description: "",
                      assignees: "",
                      startDate: new Date(),
                      dueDate: new Date(),
                      priority: "medium",
                      isCompleted: false,
                    })
                  }
                  className="px-3 py-1.5 bg-[#2e6be9] text-white rounded-md text-sm"
                >
                  Add Subtask
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#e2e2e2] rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#2e6be9] text-white rounded-md text-sm disabled:opacity-50"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating
                  ? "Saving..."
                  : initialData
                    ? "Save Changes"
                    : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
