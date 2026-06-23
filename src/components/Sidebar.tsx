import { useMemo } from "react";
import { useCrm } from "@/store";
import { pipeMini } from "@/lib/crm/derive";
import { cn } from "@/lib/utils";
import type { View } from "@/lib/crm/types";

function LogoMark() {
  return (
    <div className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-lg bg-brand">
      <svg width="16" height="16" viewBox="0 0 16 16">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#fff" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="#ffffff" opacity="0.55" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="#ffffff" opacity="0.55" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#fff" />
      </svg>
    </div>
  );
}

function DashIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 16 16">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function KanbanIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 16 16">
      <rect x="1" y="2" width="4" height="12" rx="1" fill="currentColor" />
      <rect x="6" y="2" width="4" height="8" rx="1" fill="currentColor" />
      <rect x="11" y="2" width="4" height="10" rx="1" fill="currentColor" />
    </svg>
  );
}

function TasksIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 16 16">
      <rect x="1" y="2" width="14" height="3" rx="1.5" fill="currentColor" />
      <rect x="1" y="6.5" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
      <rect x="1" y="11" width="9" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

interface NavItemProps {
  view: View;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  badge?: number;
  onClick: () => void;
}

function NavItem({ label, icon, active, badge, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-[11px] rounded-lg px-2.5 py-[9px] text-left text-[13.5px] font-medium transition-colors",
        active
          ? "bg-[rgba(109,74,255,0.18)] text-white"
          : "text-[#9a9aa8] hover:bg-white/5",
      )}
    >
      <span className="flex-none">{icon}</span>
      {label}
      {badge != null && badge > 0 && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-[10px] bg-brand px-1.5 text-[11px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

export function Sidebar({ tasksBadge }: { tasksBadge: number }) {
  const { state, actions } = useCrm();
  const pipe = useMemo(() => pipeMini(state.leads), [state.leads]);

  return (
    <aside className="flex w-[236px] flex-none flex-col bg-brand-sidebar px-3.5 py-[18px] text-[#cfcfd9]">
      <div className="flex items-center gap-2.5 px-2 pb-[22px] pt-1.5">
        <LogoMark />
        <div className="leading-[1.1]">
          <div className="text-[15px] font-bold tracking-[-0.2px] text-white">
            Prospecta
          </div>
          <div className="text-[11px] text-[#7c7c8c]">CRM de prospecção</div>
        </div>
      </div>

      <nav className="flex flex-col gap-[3px]">
        <NavItem
          view="dashboard"
          label="Dashboard"
          icon={<DashIcon />}
          active={state.view === "dashboard"}
          onClick={() => actions.setView("dashboard")}
        />
        <NavItem
          view="kanban"
          label="Funil de leads"
          icon={<KanbanIcon />}
          active={state.view === "kanban"}
          onClick={() => actions.setView("kanban")}
        />
        <NavItem
          view="tarefas"
          label="Tarefas do dia"
          icon={<TasksIcon />}
          active={state.view === "tarefas"}
          badge={tasksBadge}
          onClick={() => actions.setView("tarefas")}
        />
      </nav>

      <div className="mt-6 px-2.5 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.6px] text-[#5c5c6c]">
        Pipeline
      </div>
      <div className="flex flex-col gap-[9px] px-2.5">
        {pipe.map((p) => (
          <div key={p.label} className="flex items-center gap-2 text-[12.5px]">
            <span
              className="h-2 w-2 flex-none rounded-sm"
              style={{ background: p.color }}
            />
            <span className="text-[#a6a6b4]">{p.label}</span>
            <span className="ml-auto font-semibold tabular-nums text-[#e6e6ee]">
              {p.count}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-2.5 border-t border-[#26262f] px-2.5 pb-1 pt-3">
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#2c2c38] text-[13px] font-semibold text-[#cfcfd9]">
          RT
        </div>
        <div className="min-w-0 leading-[1.2]">
          <div className="truncate text-[12.5px] font-semibold text-[#eaeaf0]">
            Rafael Torres
          </div>
          <div className="text-[11px] text-[#6c6c7c]">Dev freelancer</div>
        </div>
      </div>
    </aside>
  );
}
