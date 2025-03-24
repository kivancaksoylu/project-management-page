import { create } from "zustand";

interface TaskStore {
  search: string;
  setSearch: (search: string) => void;
}

export const taskStore = create<TaskStore>((set) => ({
  search: "",
  setSearch: (search) => set({ search }),
}));
