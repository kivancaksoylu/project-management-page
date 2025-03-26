"use server";

let tasksData: DataStructure = {
  tasks: [
    {
      id: 1742893758713,
      isCompleted: false,
      subTasks: [
        {
          id: 1742893743596,
          name: "Sub task 1",
          description: "desc",
          assignees: ["a", "b", "c"],
          startDate: "2025-03-25T09:09:03.596Z",
          dueDate: "2025-03-25T09:09:03.596Z",
          priority: "medium",
          isCompleted: false,
        },
      ],
      name: "Task 1 ",
      description: "Task 1 desc",
      priority: "medium",
      startDate: "2025-03-25T09:08:45.648Z",
      dueDate: "2025-03-25T09:08:45.648Z",
    },
    {
      id: 1742893783474,
      isCompleted: true,
      subTasks: [
        {
          id: 1742893769946,
          name: "subtask 1",
          description: "desc",
          assignees: ["d", "f", "e"],
          startDate: "2025-03-25T09:09:29.946Z",
          dueDate: "2025-03-25T09:09:29.946Z",
          priority: "low",
          isCompleted: true,
        },
      ],
      name: "Task 2",
      description: "task 2 desc",
      priority: "medium",
      startDate: "2025-03-25T09:09:22.131Z",
      dueDate: "2025-03-25T09:09:22.131Z",
    },
  ],
};

export type SubTask = {
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

export type WeatherData = {
  condition: string;
  temperature: string;
  humidity: string;
  windSpeed: string;
  location: string;
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
  return new Promise((resolve) => {
    resolve(tasksData);
  });
}

export async function writeData(data: DataStructure): Promise<void> {
  return new Promise((resolve) => {
    tasksData = data;
    resolve();
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
      setTimeout(() => resolve(filteredData), 30);
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

      setTimeout(() => resolve(newTask), 50);
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

      setTimeout(() => resolve(task), 50);
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

      setTimeout(() => resolve(task), 50);
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
      setTimeout(() => resolve(id), 50);
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
      setTimeout(() => resolve(subtaskId), 50);
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
      setTimeout(() => resolve(id), 50);
    } catch (error) {
      reject(error);
    }
  });
}

export async function getWeatherByIp(ip: string): Promise<WeatherData> {
  console.log("ip", ip);
  const response = await fetch(`https://wttr.in/${ip}?format=%C|%t|%h|%w|%l&m`, {
    headers: {
      "User-Agent": "curl/7.64.1",
    },
  });

  const data = await response.text();
  const [condition, temperature, humidity, windSpeed, location] =
    data.split("|");

  return {
    condition: condition.trim(),
    temperature: temperature.trim(),
    humidity: humidity.trim(),
    windSpeed: windSpeed.trim(),
    location: location.trim(),
  };
}
