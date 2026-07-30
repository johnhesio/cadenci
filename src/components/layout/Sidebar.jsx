import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarDays, ListMusic, Users, Settings, MessageCircle } from "lucide-react";
import { useAppContext } from "@/hooks/useAppContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/catalog", label: "Catálogo", icon: ListMusic },
  { to: "/crm", label: "CRM", icon: Users },
  { to: "/settings", label: "Configurações", icon: Settings },
  { to: "/simulate", label: "Simular cliente", icon: MessageCircle },
];

export default function Sidebar() {
  const { businessRules } = useAppContext();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-pine-dark text-paper">
      <div className="flex items-center gap-2 px-6 py-6">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#B8842C" />
          <line x1="6" y1="11" x2="26" y2="11" stroke="#173630" strokeWidth="1" opacity="0.5" />
          <line x1="6" y1="16" x2="26" y2="16" stroke="#173630" strokeWidth="1" opacity="0.5" />
          <line x1="6" y1="21" x2="26" y2="21" stroke="#173630" strokeWidth="1" opacity="0.5" />
          <circle cx="12" cy="16" r="3.2" fill="#173630" />
          <circle cx="21" cy="11" r="3.2" fill="#173630" />
        </svg>
        <div>
          <p className="font-display text-lg font-semibold leading-none">Cadêci</p>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-paper/50">{businessRules.businessName}</p>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-paper/10 text-paper"
                  : "text-paper/60 hover:bg-paper/5 hover:text-paper/90"
              }`
            }
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-paper/10 px-6 py-4">
        <p className="font-mono text-[11px] text-paper/40">v0.1 · agendamento local</p>
      </div>
    </aside>
  );
}
