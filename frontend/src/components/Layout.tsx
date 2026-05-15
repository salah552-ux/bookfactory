import { NavLink, Outlet } from "react-router-dom";
import {
  Activity,
  BookOpen,
  Cog,
  Layers,
  Library,
  Menu,
  Moon,
  Network,
  Play,
  Plus,
  Sun,
  X,
} from "lucide-react";
import { useWsStatus } from "@/hooks/useWs";
import { cn } from "@/lib/cn";
import { useUi } from "@/stores/ui";

const nav = [
  { to: "/", label: "Fleet", Icon: Library, end: true },
  { to: "/books/new", label: "New book", Icon: Plus },
  { to: "/series", label: "Series", Icon: Network },
  { to: "/agents", label: "Agents", Icon: Layers },
  { to: "/runs", label: "Runs", Icon: Activity },
  { to: "/demo", label: "Demo", Icon: Play },
  { to: "/settings", label: "Settings", Icon: Cog },
];

export function Layout() {
  const status = useWsStatus();
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen } = useUi();

  return (
    <div className="min-h-screen flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          aria-label="Close menu"
        />
      )}

      <aside
        className={cn(
          "fixed md:static z-40 inset-y-0 left-0 w-60 md:w-56 shrink-0",
          "border-r border-slate-800 bg-slate-950 flex flex-col",
          "transition-transform md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-5 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="size-5 text-brand-tan" />
              <span className="font-display text-lg tracking-tight text-slate-100">
                BookFactory
              </span>
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">
              Control Surface
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-100"
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-1">
          {nav.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-slate-800/70 text-slate-100"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                )
              }
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-slate-800 space-y-2">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded px-2 py-1.5 text-xs text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
          >
            <span className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="size-3.5" />
              ) : (
                <Sun className="size-3.5" />
              )}
              {theme === "dark" ? "Dark" : "Light"} mode
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-600">
              toggle
            </span>
          </button>
          <div className="flex items-center gap-2 px-2 text-xs text-slate-500">
            <span
              className={cn(
                "inline-block size-2 rounded-full",
                status === "open"
                  ? "bg-emerald-400"
                  : status === "connecting"
                    ? "bg-yellow-400 animate-pulse"
                    : "bg-red-500"
              )}
            />
            <span className="capitalize">{status}</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 bg-slate-950 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-950">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-300 hover:text-slate-100"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <BookOpen className="size-4 text-brand-tan" />
          <span className="font-display text-base">BookFactory</span>
        </header>

        {import.meta.env.VITE_DEMO === "true" && (
          <div className="bg-amber-900/40 text-amber-200 text-xs px-4 py-2 border-b border-amber-800 flex items-center gap-2 justify-center">
            <span className="font-bold">DEMO MODE —</span>
            <span>
              Mock data, no real agents. Run{" "}
              <code className="text-amber-100">bash start-ui.sh</code> on your
              own machine to drive the real pipeline.
            </span>
          </div>
        )}
        <div className="flex-1 min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
