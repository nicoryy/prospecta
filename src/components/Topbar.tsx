import { useState } from "react";
import {
  Download,
  Menu,
  MoreVertical,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCrm } from "@/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fmt } from "@/lib/crm/date";
import { TODAY } from "@/lib/crm/constants";
import { downloadLeadsCsv } from "@/lib/crm/csv";

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

export function Topbar({ onOpenNav }: { onOpenNav: () => void }) {
  const { state, actions } = useCrm();
  const { title, subtitle } = TITLES[state.view];
  const [confirmClear, setConfirmClear] = useState(false);
  const hasLeads = state.leads.length > 0;

  return (
    <header className="flex h-[60px] flex-none items-center gap-2 border-b border-border bg-card px-3 sm:gap-4 sm:px-6">
      <button
        onClick={onOpenNav}
        className="flex h-9 w-9 flex-none items-center justify-center rounded-lg text-foreground hover:bg-secondary md:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden text-[17px] font-bold tracking-[-0.3px] sm:block">
        {title}
      </div>
      <div className="hidden text-[12.5px] text-muted-foreground lg:block">
        {subtitle}
      </div>

      <div className="contents">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[9px] border border-[#e6e6ec] bg-[#f2f2f5] px-[11px] py-[7px] sm:ml-auto sm:w-[260px] sm:flex-none">
          <Search className="h-[15px] w-[15px] flex-none text-[#9a9aa8]" strokeWidth={1.8} />
          <input
            value={state.search}
            onChange={(e) => actions.setSearch(e.target.value)}
            placeholder="Buscar…"
            className="w-full border-none bg-transparent text-[13px] text-foreground outline-none placeholder:text-[#9a9aa8]"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => downloadLeadsCsv(state.leads)}
          disabled={!hasLeads}
          title="Exportar todos os leads em CSV"
          className="hidden h-9 gap-[7px] px-3 text-[13px] md:inline-flex"
        >
          <Download className="h-[14px] w-[14px]" strokeWidth={2} />
          Exportar
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 flex-none"
              title="Mais ações"
              aria-label="Mais ações"
            >
              <MoreVertical className="h-[18px] w-[18px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="md:hidden"
              disabled={!hasLeads}
              onSelect={() => downloadLeadsCsv(state.leads)}
            >
              <Download className="text-muted-foreground" />
              Exportar CSV
            </DropdownMenuItem>
            <DropdownMenuSeparator className="md:hidden" />
            <DropdownMenuItem onSelect={() => actions.loadSample()}>
              <Sparkles className="text-muted-foreground" />
              Carregar dados de exemplo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!hasLeads}
              onSelect={() => {
                // Defer so the menu finishes closing before the dialog grabs focus.
                setTimeout(() => setConfirmClear(true), 0);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 />
              Limpar todos os dados
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={actions.openAdd}
          className="h-9 flex-none gap-[7px] px-2.5 text-[13px] sm:px-3.5"
        >
          <Plus className="h-[15px] w-[15px] sm:h-[13px] sm:w-[13px]" strokeWidth={2.5} />
          <span className="hidden sm:inline">Novo lead</span>
        </Button>
      </div>

      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar todos os dados</AlertDialogTitle>
            <AlertDialogDescription>
              Isso vai remover <b className="text-foreground">todos os leads</b> e
              o histórico salvos neste navegador, começando do zero. Considere
              exportar um CSV antes. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => actions.clearAll()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Limpar tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
