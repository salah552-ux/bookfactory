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
  { to: "/",          label: "Fleet",     index: "I",    Icon: LibraryBig, end: true },
  { to: "/books/new", label: "New book",  index: "II",   Icon: Plus },
  { to: "/series",    label: "Series",    index: "III",  Icon: Layers },
  { to: "/agents",    label: "Agents",    index: "IV",   Icon: Layers },
  { to: "/runs",      label: "Runs",      index: "V",    Icon: Activity },
  { to: "/demo",      label: "Demo",      index: "VI",   Icon: Play },
  { to: "/settings",  label: "Settings",  index: "VII",  Icon: Cog },
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
          "border-r border-line bg-bg-side",
          "transition-transform md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Masthead */}
        <div className="px-6 pt-7 pb-6">
          <Link to="/" className="flex flex-col gap-3">
            <BrandMark size={48} />
            <div>
              <div className="kicker">A Publishing House</div>
              <div className="font-display text-2xl font-semibold tracking-tight text-text-1 leading-none mt-1.5">
                Book<em className="text-gold not-italic font-normal" style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic"}}>·</em>Factory
              </div>
              <div className="fig-caption mt-1.5">Vol. 1 · Est. 2026</div>
            </div>
          </Link>
        </div>

        <div className="px-6">
          <div className="gold-rule" />
        </div>

        {/* Contents / Nav */}
        <nav className="flex-1 px-6 py-5 space-y-0.5 overflow-y-auto">
          <div className="kicker mb-3">Contents</div>
          {nav.map(({ to, label, index, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "group flex items-baseline gap-3 py-1.5 transition-colors",
                  isActive ? "text-gold" : "text-text-2 hover:text-text-1"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "font-mono text-[10px] w-6 tracking-wider",
                      isActive ? "text-gold" : "text-text-4"
                    )}
                  >
                    {index}
                  </span>
                  <span className={cn(
                    "font-display text-lg leading-none",
                    isActive ? "italic" : ""
                  )}>
                    {label}
                  </span>
                  {isActive && (
                    <span className="ml-auto text-gold text-xs">·</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Colophon (footer) */}
        <div className="border-t border-line px-6 py-5">
          <div className="kicker mb-2">Status</div>
          <div className="flex items-center gap-2.5 text-xs">
            <span
              className={cn(
                "size-2 rounded-full",
                status === "open"
                  ? "bg-ok"
                  : status === "connecting"
                    ? "bg-warn"
                    : "bg-err"
              )}
            />
            <span className="text-text-2 capitalize font-mono">{status}</span>
          </div>
          <div className="fig-caption mt-4">
            S.A. Ibrahim · Publisher
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden h-12 flex items-center gap-3 px-4 border-b border-line bg-bg-side/95 backdrop-blur sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-text-2 hover:text-text-1"
          >
            <Menu className="size-5" />
          </button>
          <BrandMark size={28} />
          <span className="font-display text-lg">BookFactory</span>
          <span className={cn(
            "ml-auto size-2 rounded-full",
            status === "open" ? "bg-ok" : status === "connecting" ? "bg-warn" : "bg-err"
          )} />
        </header>

        {import.meta.env.VITE_DEMO === "true" && (
          <div className="h-7 bg-gold-soft text-gold text-xs px-4 border-b border-gold/20 flex items-center gap-2 justify-center">
            <Sparkles className="size-3" />
            <span className="font-mono tracking-widest uppercase">Demo Issue</span>
            <span className="text-gold/80 italic" style={{fontFamily:"'Cormorant Garamond',serif"}}>
              — mock data, no real agents
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
