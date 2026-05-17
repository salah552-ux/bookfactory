import { NavLink, Outlet, Link } from "react-router-dom";
import {
  Activity,
  Cog,
  Layers,
  LibraryBig,
  Menu,
  Play,
  Plus,
  Sparkles,
} from "lucide-react";
import { useWsStatus } from "@/hooks/useWs";
import { cn } from "@/lib/cn";
import { useUi } from "@/stores/ui";
import { BrandMark } from "./BrandMark";

const nav = [
  { to: "/",          label: "Fleet",     Icon: LibraryBig, end: true },
  { to: "/books/new", label: "New book",  Icon: Plus },
  { to: "/series",    label: "Series",    Icon: Layers },
  { to: "/agents",    label: "Agents",    Icon: Layers },
  { to: "/runs",      label: "Runs",      Icon: Activity },
  { to: "/demo",      label: "Demo",      Icon: Play },
  { to: "/settings",  label: "Settings",  Icon: Cog },
];

export function Layout() {
  const status = useWsStatus();
  const { sidebarOpen, setSidebarOpen } = useUi();

  return (
    <div className="min-h-screen flex bg-surface">
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-label="Close menu"
        />
      )}

      <aside
        className={cn(
          "fixed md:static z-40 inset-y-0 left-0 w-64 shrink-0 flex flex-col",
          "border-r border-line bg-surface-2",
          "transition-transform md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Masthead */}
        <div className="px-6 pt-6 pb-4">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark size={44} />
            <div>
              <div
                className="text-xl text-text-1 leading-none"
                style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                BookFactory
              </div>
              <div className="kicker mt-1">A Publishing House</div>
            </div>
          </Link>
        </div>

        <div className="px-6"><div className="hairline" /></div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {nav.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                  "text-base", // 16px
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-text-2 hover:bg-raised hover:text-text-1"
                )
              }
              style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn("size-4", isActive ? "text-primary" : "text-text-3")}
                    strokeWidth={1.5}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-line px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "size-2 rounded-full",
                status === "open" ? "bg-success" : status === "connecting" ? "bg-warning" : "bg-danger"
              )}
            />
            <span className="text-text-3 capitalize font-mono text-xs">{status}</span>
          </div>
          <div className="kicker mt-3">S.A. Ibrahim · Publisher</div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col bg-surface">
        <header className="md:hidden h-14 flex items-center gap-3 px-4 border-b border-line bg-surface sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-text-2 hover:text-text-1"
          >
            <Menu className="size-5" />
          </button>
          <BrandMark size={28} />
          <span className="text-lg" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
            BookFactory
          </span>
        </header>

        {import.meta.env.VITE_DEMO === "true" && (
          <div className="h-8 bg-primary-soft text-primary text-xs px-4 border-b border-primary/20 flex items-center gap-2 justify-center font-mono">
            <Sparkles className="size-3" />
            <span className="font-semibold tracking-widest uppercase">Demo</span>
            <span className="text-primary/80">— mock data, no real agents</span>
          </div>
        )}

        <div className="flex-1 min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
