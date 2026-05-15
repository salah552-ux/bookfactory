import { create } from "zustand";

type Theme = "dark" | "light";

interface UiStore {
  theme: Theme;
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setSidebarOpen: (v: boolean) => void;
}

const stored = (): Theme => {
  if (typeof window === "undefined") return "dark";
  return (window.localStorage.getItem("bf.theme") as Theme) || "dark";
};

const applyTheme = (t: Theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", t === "dark");
  document.documentElement.classList.toggle("light", t === "light");
};

applyTheme(stored());

export const useUi = create<UiStore>((set) => ({
  theme: stored(),
  sidebarOpen: false,
  toggleTheme: () =>
    set((s) => {
      const next: Theme = s.theme === "dark" ? "light" : "dark";
      window.localStorage.setItem("bf.theme", next);
      applyTheme(next);
      return { theme: next };
    }),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
}));
