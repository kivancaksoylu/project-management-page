"use server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data.json");

type SubTask = {
  id: number;
  name: string;
  description: string;
  assignees: string[];
  startDate: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  isCompleted: boolean;
};

export type Task = {
  id: number;
  name: string;
  isCompleted: boolean;
  description?: string;
  startDate: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  subTasks: SubTask[];
};

type DataStructure = {
  tasks: Task[];
};

type GetTasksQueries =
  | {
      search?: string;
    }
  | undefined;

export async function readData(): Promise<DataStructure> {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const parsedData: DataStructure = JSON.parse(data);
      resolve(parsedData);
    } catch (error) {
      reject(error);
    }
  });
}

export async function writeData(data: DataStructure): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export async function getTasks(queries: GetTasksQueries): Promise<Task[]> {
  return new Promise(async (resolve, reject) => {
    function checkIfIncludes(text: string | undefined, searchText: string) {
      if (!text) return true;
      const formattedText = text.toLocaleLowerCase();
      const formattedSearch = searchText.trim().toLocaleLowerCase();
      return formattedText.includes(formattedSearch);
    }
    try {
      const data = await readData();
      var filteredData = data.tasks;
      if (queries?.search) {
        filteredData = data.tasks?.filter((task) => {
          const subTaskInclude = task.subTasks.some((s) => {
            if (
              checkIfIncludes(s.description, queries.search!) ||
              checkIfIncludes(s.name, queries.search!)
            )
              return true;
          });
          if (
            checkIfIncludes(task.name, queries.search!) ||
            checkIfIncludes(task.description, queries.search!) ||
            subTaskInclude
          )
            return task;
        });
      }
      setTimeout(() => resolve(filteredData), 500);
    } catch (error) {
      reject(error);
    }
  });
}

export async function createTask(task: {
  name: string;
  description?: string;
  startDate: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}): Promise<Task> {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await readData();
      const newTask: Task = {
        id: Date.now(),
        isCompleted: false,
        subTasks: [],
        ...task,
      };

      data.tasks.push(newTask);
      await writeData(data);

      setTimeout(() => resolve(newTask), 500);
    } catch (error) {
      reject(error);
    }
  });
}

export async function updateTask(task: Task): Promise<Task> {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await readData();
      const index = data.tasks.findIndex((t) => t.id === task.id);

      data.tasks[index] = task;
      await writeData(data);

      setTimeout(() => resolve(task), 500);
    } catch (error) {
      reject(error);
    }
  });
}

export async function updateSubTaskStatus(
  taskId: number,
  subtaskId: number,
  isCompleted: boolean,
): Promise<Task | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await readData();
      const task = data.tasks.find((p) => p.id === taskId);

      if (!task) {
        return reject(new Error("Task not found"));
      }

      const subTask = task.subTasks.find((st) => st.id === subtaskId);
      if (!subTask) {
        return reject(new Error("Subtask not found"));
      }

      subTask.isCompleted = isCompleted;
      await writeData(data);

      setTimeout(() => resolve(task), 500);
    } catch (error) {
      reject(error);
    }
  });
}

export async function deleteTaskById(id: number): Promise<number> {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await readData();
      data.tasks = data.tasks.filter((p: Task) => p.id !== id);

      await writeData(data);
      setTimeout(() => resolve(id), 500);
    } catch (error) {
      reject(error);
    }
  });
}

export async function deleteSubTaskById(
  taskId: number,
  subtaskId: number,
): Promise<number> {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await readData();
      const newTaskArray: Task[] = [];
      data.tasks.forEach((task) => {
        if (task.id === taskId) {
          newTaskArray.push({
            ...task,
            subTasks: task.subTasks.filter(
              (subTask) => subTask.id !== subtaskId,
            ),
          });
        } else {
          newTaskArray.push(task);
        }
      });

      await writeData({ tasks: newTaskArray });
      setTimeout(() => resolve(subtaskId), 500);
    } catch (error) {
      reject(error);
    }
  });
}

export async function updateTaskCompletion(
  id: number,
  isCompleted: boolean,
): Promise<number> {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await readData();
      const newTaskArray: Task[] = [];
      data.tasks.forEach((task) => {
        if (task.id === id) {
          const newSubTasks = task?.subTasks.map((subTask) => ({
            ...subTask,
            isCompleted: isCompleted,
          }));
          newTaskArray.push({
            ...task,
            subTasks: newSubTasks,
            isCompleted: isCompleted,
          });
        } else {
          newTaskArray.push(task);
        }
      });

      await writeData({ tasks: newTaskArray });
      setTimeout(() => resolve(id), 500);
    } catch (error) {
      reject(error);
    }
  });
}
