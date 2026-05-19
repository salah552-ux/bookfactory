import { describe, it, expect, beforeEach } from "vitest";
import { useUi } from "@/stores/ui";

beforeEach(() => {
  // Reset to default dark theme before each test
  useUi.setState({ theme: "dark", sidebarOpen: false });
  window.localStorage.removeItem("bf.theme");
});

describe("toggleTheme", () => {
  it("switches from dark to light", () => {
    useUi.setState({ theme: "dark" });
    useUi.getState().toggleTheme();
    expect(useUi.getState().theme).toBe("light");
  });

  it("switches from light to dark", () => {
    useUi.setState({ theme: "light" });
    useUi.getState().toggleTheme();
    expect(useUi.getState().theme).toBe("dark");
  });

  it("persists the theme to localStorage", () => {
    useUi.setState({ theme: "dark" });
    useUi.getState().toggleTheme();
    expect(window.localStorage.getItem("bf.theme")).toBe("light");
  });

  it("applies the dark class to document.documentElement when switching to dark", () => {
    useUi.setState({ theme: "light" });
    useUi.getState().toggleTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("applies the light class to document.documentElement when switching to light", () => {
    useUi.setState({ theme: "dark" });
    useUi.getState().toggleTheme();
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });
});

describe("setSidebarOpen", () => {
  it("sets sidebarOpen to true", () => {
    useUi.getState().setSidebarOpen(true);
    expect(useUi.getState().sidebarOpen).toBe(true);
  });

  it("sets sidebarOpen to false", () => {
    useUi.setState({ sidebarOpen: true });
    useUi.getState().setSidebarOpen(false);
    expect(useUi.getState().sidebarOpen).toBe(false);
  });
});
