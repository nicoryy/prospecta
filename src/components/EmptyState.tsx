import { Plus, Sparkles } from "lucide-react";
import { useCrm } from "@/store";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  const { actions } = useCrm();

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-[420px] rounded-2xl border border-border bg-card px-6 py-10 text-center sm:px-8">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft">
          <svg width="26" height="26" viewBox="0 0 16 16">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#6d4aff" />
            <rect x="9" y="1" width="6" height="6" rx="1.5" fill="#6d4aff" opacity="0.5" />
            <rect x="1" y="9" width="6" height="6" rx="1.5" fill="#6d4aff" opacity="0.5" />
            <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#6d4aff" />
          </svg>
        </div>
        <div className="text-[19px] font-bold tracking-[-0.3px]">
          Comece a prospectar
        </div>
        <p className="mx-auto mt-2 max-w-[320px] text-[13.5px] leading-relaxed text-muted-foreground">
          Você ainda não tem leads cadastrados. Adicione o primeiro para começar a
          acompanhar contatos e negociações — ou carregue dados de exemplo para
          explorar a ferramenta.
        </p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center">
          <Button onClick={actions.openAdd} className="gap-[7px]">
            <Plus className="h-[14px] w-[14px]" strokeWidth={2.5} />
            Novo lead
          </Button>
          <Button variant="outline" onClick={() => actions.loadSample()} className="gap-2">
            <Sparkles className="h-[14px] w-[14px]" />
            Carregar exemplos
          </Button>
        </div>
      </div>
    </div>
  );
}
