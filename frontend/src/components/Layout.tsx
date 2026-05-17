import { NavLink, Outlet, Link } from "react-router-dom";
import {
  Activity,
  ChevronDown,
  Cog,
  LayoutGrid,
  Layers,
  LibraryBig,
  Menu,
  Play,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { useWsStatus } from "@/hooks/useWs";
import { cn } from "@/lib/cn";
import { useUi } from "@/stores/ui";
import { BrandMark } from "./BrandMark";

const nav = [
  { to: "/",          label: "Fleet",     Icon: LayoutGrid, end: true },
  { to: "/books/new", label: "New book",  Icon: Plus },
  { to: "/series",    label: "Series",    Icon: LibraryBig },
  { to: "/agents",    label: "Agents",    Icon: Layers },
  { to: "/runs",      label: "Runs",      Icon: Activity },
  { to: "/demo",      label: "Demo",      Icon: Play },
  { to: "/settings",  label: "Settings",  Icon: Cog },
];

export function Layout() {
  const status = useWsStatus();
  const { sidebarOpen, setSidebarOpen } = useUi();

  return (
    <div className="min-h-screen flex">
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 md:hidden"
          aria-label="Close menu"
        />
      )}

      <aside
        className={cn(
          "fixed md:static z-40 inset-y-0 left-0 w-64 shrink-0 flex flex-col",
          "border-r border-line bg-bg-side/95 backdrop-blur",
          "transition-transform md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <BrandMark size={40} />
            <div className="leading-tight">
              <div className="text-md font-semibold text-text-1 tracking-tight">
                BookFactory
              </div>
              <div className="text-[9px] text-text-3 tracking-[0.15em] uppercase">
                AI Publishing Pipeline
              </div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-text-3 hover:text-text-1"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-2 space-y-1 overflow-y-auto">
          {nav.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-md transition-all",
                  isActive
                    ? "bg-violet/15 text-text-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_18px_-6px_rgba(168,85,247,0.6)] border border-violet/30"
                    : "text-text-2 hover:bg-white/[0.03] hover:text-text-1"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "size-8 rounded-md flex items-center justify-center shrink-0 transition-all",
                      isActive
                        ? "bg-violet/20 text-violet-2"
                        : "bg-white/[0.03] text-text-3"
                    )}
                  >
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* CTA card */}
        <div className="mx-3 mb-3 mt-3 p-4 rounded-xl border border-violet/30 bg-gradient-to-br from-violet/12 via-violet/5 to-magenta/10 shadow-[0_0_24px_-8px_rgba(168,85,247,0.5)]">
          <Sparkles className="size-4 text-violet-2 mb-2" strokeWidth={1.75} />
          <div className="text-md font-semibold text-text-1">Start a new book</div>
          <div className="text-xs text-text-3 mt-1 leading-snug">
            Launch a book into the pipeline and let 44 AI agents do the heavy lifting.
          </div>
          <Link
            to="/books/new"
            className="mt-3 flex items-center justify-center gap-1.5 rounded-md px-3 h-8 text-xs font-medium text-white bg-gradient-to-r from-violet to-magenta shadow-[0_0_18px_-6px_rgba(168,85,247,0.7)] hover:opacity-90 transition-opacity"
          >
            <Plus className="size-3.5" /> New book
          </Link>
        </div>

        {/* User */}
        <div className="border-t border-line px-4 py-3 flex items-center gap-2.5">
          <BrandMark size={32} />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-text-1 truncate">
              BookFactory Studio
            </div>
            <div className="text-[10px] text-text-3 truncate">Publisher</div>
          </div>
          <ChevronDown className="size-3.5 text-text-3" />
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden flex items-center gap-3 px-4 h-12 border-b border-line bg-bg-side/90 backdrop-blur sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-text-2 hover:text-text-1"
          >
            <Menu className="size-5" />
          </button>
          <BrandMark size={28} />
          <span className="text-md font-semibold">BookFactory</span>
          <span className={cn(
            "ml-auto size-2 rounded-full",
            status === "open" ? "bg-green" : status === "connecting" ? "bg-orange" : "bg-red"
          )} />
        </header>

        {import.meta.env.VITE_DEMO === "true" && (
          <div className="h-7 bg-violet/10 text-violet-2 text-xs px-4 border-b border-violet/20 flex items-center gap-2 justify-center">
            <Sparkles className="size-3" />
            <span className="font-medium">Demo mode</span>
            <span className="text-violet-2/70">· mock data — run locally for the real pipeline</span>
          </div>
        )}

        <div className="flex-1 min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
