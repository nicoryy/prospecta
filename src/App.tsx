import { useMemo } from "react";
import { useCrm } from "@/store";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Dashboard } from "@/components/views/Dashboard";
import { Kanban } from "@/components/views/Kanban";
import { Tarefas } from "@/components/views/Tarefas";
import { LeadDrawer } from "@/components/LeadDrawer";
import { AddLeadModal } from "@/components/AddLeadModal";
import { buildTasks } from "@/lib/crm/derive";

export default function App() {
  const { state } = useCrm();
  const tasksBadge = useMemo(
    () => buildTasks(state.leads, state.done).badge,
    [state.leads, state.done],
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <Sidebar tasksBadge={tasksBadge} />

      <main className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <div className="min-h-0 flex-1 overflow-auto">
          {state.view === "dashboard" && <Dashboard />}
          {state.view === "kanban" && <Kanban />}
          {state.view === "tarefas" && <Tarefas />}
        </div>
      </main>

      {state.selectedId != null && <LeadDrawer />}
      <AddLeadModal />
    </div>
  );
}
