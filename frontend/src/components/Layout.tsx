import { NavLink, Outlet } from "react-router-dom";
import {
  Activity,
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
  { to: "/",            label: "Fleet",     Icon: Library, end: true },
  { to: "/books/new",   label: "New book",  Icon: Plus },
  { to: "/series",      label: "Series",    Icon: Network },
  { to: "/agents",      label: "Agents",    Icon: Layers },
  { to: "/runs",        label: "Runs",      Icon: Activity },
  { to: "/demo",        label: "Demo",      Icon: Play },
  { to: "/settings",    label: "Settings",  Icon: Cog },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="size-9 rounded-md bg-gradient-to-br from-[#284b73] via-[#1b3a5c] to-[#0a1424] flex items-center justify-center border border-brand-tan/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <span className="text-display text-lg gold-text leading-none">B</span>
        </div>
        <span className="absolute -bottom-1 -right-1 size-2.5 rounded-full bg-brand-tan ring-2 ring-[#07101c]" />
      </div>
      <div className="leading-tight">
        <div className="text-display text-[15px] tracking-tight text-slate-100">
          BookFactory
        </div>
        <div className="eyebrow !text-[9px]">Control Surface</div>
      </div>
    </div>
  );
}

export function Layout() {
  const status = useWsStatus();
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen } = useUi();

  return (
    <div className="min-h-screen flex">
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
          aria-label="Close menu"
        />
      )}

      <aside
        className={cn(
          "fixed md:static z-40 inset-y-0 left-0 w-64 md:w-60 shrink-0 flex flex-col",
          "border-r border-slate-800/60",
          "bg-gradient-to-b from-[#0a1424] to-[#07101c]",
          "backdrop-blur-md",
          "transition-transform md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-5 py-5 border-b border-slate-800/60 flex items-center justify-between">
          <BrandMark />
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-100"
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <div className="eyebrow px-3 pb-2">Navigate</div>
          {nav.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-all",
                  isActive
                    ? "bg-gradient-to-r from-slate-800/80 to-slate-800/30 text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "size-4 transition-colors",
                      isActive ? "text-brand-tan" : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  <span>{label}</span>
                  {isActive && (
                    <span className="ml-auto size-1.5 rounded-full bg-brand-tan" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800/60 space-y-2">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="size-3.5" />
              ) : (
                <Sun className="size-3.5" />
              )}
              {theme === "dark" ? "Dark mode" : "Light mode"}
            </span>
            <span className="kbd">⌥T</span>
          </button>
          <div className="flex items-center gap-2 px-3 text-[11px] text-slate-500">
            <span
              className={cn(
                "inline-block size-2 rounded-full",
                status === "open"
                  ? "bg-emerald-400 pulse-glow"
                  : status === "connecting"
                    ? "bg-yellow-400 animate-pulse"
                    : "bg-red-500"
              )}
            />
            <span className="capitalize tracking-wide">{status}</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-300 hover:text-slate-100"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <BrandMark />
        </header>

        {import.meta.env.VITE_DEMO === "true" && (
          <div className="bg-gradient-to-r from-amber-900/30 via-amber-800/40 to-amber-900/30 text-amber-100 text-xs px-4 py-2 border-b border-amber-800/50 flex items-center gap-2 justify-center backdrop-blur">
            <span className="size-1.5 rounded-full bg-amber-300 animate-pulse" />
            <span className="font-semibold tracking-wide">DEMO MODE</span>
            <span className="text-amber-200/80">
              · Mock data, no real agents · Run
              <code className="mx-1.5 px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-100">
                bash start-ui.sh
              </code>
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
