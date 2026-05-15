import { NavLink, Outlet } from "react-router-dom";
import { Activity, BookOpen, Cog, Layers, Library, Play, Plus, Network } from "lucide-react";
import { useWsStatus } from "@/hooks/useWs";
import { cn } from "@/lib/cn";

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
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 shrink-0 border-r border-slate-800 bg-slate-950 flex flex-col">
        <div className="px-5 py-5 border-b border-slate-800">
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
        <nav className="flex-1 px-2 py-3 space-y-1">
          {nav.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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
        <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-2">
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
