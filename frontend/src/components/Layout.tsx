import { NavLink, Outlet } from "react-router-dom";
import {
  Activity,
  Cog,
  Layers,
  LibraryBig,
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
  { to: "/",          label: "Fleet",     Icon: LibraryBig, end: true },
  { to: "/books/new", label: "New book",  Icon: Plus },
  { to: "/series",    label: "Series",    Icon: Network },
  { to: "/agents",    label: "Agents",    Icon: Layers },
  { to: "/runs",      label: "Runs",      Icon: Activity },
  { to: "/demo",      label: "Demo",      Icon: Play },
  { to: "/settings",  label: "Settings",  Icon: Cog },
];

/** Linear/Vercel wordmark — no monogram, just type. */
function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="size-1.5 rounded-full bg-accent" />
      <span className="text-md font-semibold tracking-tight text-text-1">
        BookFactory
      </span>
    </div>
  );
}

export function Layout() {
  const status = useWsStatus();
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen } = useUi();

  return (
    <div className="min-h-screen flex bg-bg">
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          aria-label="Close menu"
        />
      )}

      <aside
        className={cn(
          "fixed md:static z-40 inset-y-0 left-0 w-56 shrink-0 flex flex-col",
          "border-r border-line bg-bg",
          "transition-transform md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-12 px-4 border-b border-line flex items-center justify-between">
          <Brand />
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-text-3 hover:text-text-1"
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-px">
          {nav.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-raised text-text-1"
                    : "text-text-3 hover:bg-raised/60 hover:text-text-1"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "size-4 transition-colors",
                      isActive ? "text-text-1" : "text-text-4 group-hover:text-text-2"
                    )}
                    strokeWidth={1.75}
                  />
                  <span>{label}</span>
                  {isActive && (
                    <span className="ml-auto size-1 rounded-full bg-accent" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 py-3 border-t border-line space-y-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-text-3 hover:bg-raised hover:text-text-1 transition-colors"
          >
            <span className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="size-3.5" strokeWidth={1.75} />
              ) : (
                <Sun className="size-3.5" strokeWidth={1.75} />
              )}
              {theme === "dark" ? "Dark" : "Light"}
            </span>
            <span className="kbd">⌥T</span>
          </button>
          <div className="flex items-center gap-2 px-2.5 py-1 text-xs text-text-4">
            <span
              className={cn(
                "status-dot",
                status === "open"
                  ? "bg-ok"
                  : status === "connecting"
                    ? "bg-warn"
                    : "bg-err"
              )}
            />
            <span className="capitalize">{status}</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col bg-bg">
        <header className="md:hidden h-12 flex items-center gap-3 px-4 border-b border-line bg-bg sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-text-2 hover:text-text-1"
            aria-label="Open menu"
          >
            <Menu className="size-4" strokeWidth={1.75} />
          </button>
          <Brand />
        </header>

        {import.meta.env.VITE_DEMO === "true" && (
          <div className="h-7 bg-warn/10 text-warn text-xs px-4 border-b border-warn/20 flex items-center gap-2 justify-center">
            <span className="font-medium">DEMO MODE</span>
            <span className="text-warn/80">
              · Mock data, no real agents · Run
              <code className="mx-1 kbd">bash start-ui.sh</code>
              locally for the real pipeline
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
