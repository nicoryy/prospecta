import { Plus, Search } from "lucide-react";
import { useCrm } from "@/store";
import { Button } from "@/components/ui/button";
import { fmt } from "@/lib/crm/date";
import { TODAY } from "@/lib/crm/constants";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Visão geral da operação comercial",
  },
  kanban: {
    title: "Funil de leads",
    subtitle: "Arraste os cards entre as etapas",
  },
  tarefas: {
    title: "Tarefas do dia",
    subtitle: "Sua agenda comercial · " + fmt(TODAY),
  },
};

export function Topbar() {
  const { state, actions } = useCrm();
  const { title, subtitle } = TITLES[state.view];

  return (
    <header className="flex h-[60px] flex-none items-center gap-4 border-b border-border bg-card px-6">
      <div className="text-[17px] font-bold tracking-[-0.3px]">{title}</div>
      <div className="text-[12.5px] text-muted-foreground">{subtitle}</div>

      <div className="ml-auto flex items-center gap-2.5">
        <div className="flex w-[260px] items-center gap-2 rounded-[9px] border border-[#e6e6ec] bg-[#f2f2f5] px-[11px] py-[7px]">
          <Search className="h-[15px] w-[15px] flex-none text-[#9a9aa8]" strokeWidth={1.8} />
          <input
            value={state.search}
            onChange={(e) => actions.setSearch(e.target.value)}
            placeholder="Buscar empresa, contato, cidade…"
            className="w-full border-none bg-transparent text-[13px] text-foreground outline-none placeholder:text-[#9a9aa8]"
          />
        </div>
        <Button onClick={actions.openAdd} className="h-9 gap-[7px] px-3.5 text-[13px]">
          <Plus className="h-[13px] w-[13px]" strokeWidth={2.5} />
          Novo lead
        </Button>
      </div>
    </header>
  );
}
