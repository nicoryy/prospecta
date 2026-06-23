import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { useCrm } from "@/store";
import { cn } from "@/lib/utils";
import { STATUS, TIPOS } from "@/lib/crm/constants";
import { buildLeadView } from "@/lib/crm/derive";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LeadFilesTab } from "@/components/LeadFilesTab";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { DrawerTab, StatusKey } from "@/lib/crm/types";

const TABS: { key: DrawerTab; label: string }[] = [
  { key: "timeline", label: "Histórico" },
  { key: "notas", label: "Dados & Notas" },
  { key: "arquivos", label: "Arquivos" },
];

export function LeadDrawer() {
  const { state, selectedLead, actions } = useCrm();
  const [newText, setNewText] = useState("");

  if (!selectedLead) return null;
  const lead = buildLeadView(selectedLead);

  const submit = () => {
    if (!newText.trim()) return;
    actions.addInteraction(lead.id, state.newTipo, newText);
    setNewText("");
  };

  return (
    <>
      <div
        onClick={actions.closeLead}
        className="fixed inset-0 z-40 animate-fadeIn bg-[rgba(15,15,25,0.34)]"
      />
      <aside className="fixed bottom-0 right-0 top-0 z-50 flex w-[520px] max-w-[94vw] animate-drawerIn flex-col bg-card shadow-[-12px_0_40px_rgba(15,15,25,0.18)]">
        {/* header */}
        <div className="flex-none border-b border-border px-6 pb-[18px] pt-5">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <span
                className="inline-flex items-center gap-1.5 rounded-md px-[9px] py-[3px] text-[11px] font-bold uppercase tracking-[0.4px]"
                style={{ background: lead.statusBg, color: lead.statusColor }}
              >
                {lead.statusLabel}
              </span>
              <div className="mt-[9px] text-[21px] font-bold tracking-[-0.4px]">
                {lead.empresa}
              </div>
              <div className="mt-0.5 text-[13px] text-[#7c7c88]">
                {lead.contato} · {lead.cargo}
              </div>
            </div>
            <div className="flex flex-none items-center gap-1.5">
              <button
                onClick={() => actions.openEdit(lead.id)}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-[12px] font-semibold text-[#4c4c58] hover:bg-secondary"
                aria-label="Editar lead"
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#f3d4da] bg-[#fdeef0] text-[#e11d48] hover:bg-[#fbdfe4]"
                    aria-label="Excluir lead"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir lead</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir{" "}
                      <b className="text-foreground">{lead.empresa}</b>? Esta ação
                      não pode ser desfeita e todo o histórico será removido.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => actions.deleteLead(lead.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <button
                onClick={actions.closeLead}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background"
                aria-label="Fechar"
              >
                <X className="h-3.5 w-3.5 text-[#6c6c7c]" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <StatBox label="Valor">
              <span className="text-[15px] font-bold tabular-nums text-brand">
                {lead.valorFmt}
              </span>
            </StatBox>
            <StatBox label="Próxima ação">
              <span className="text-[13px] font-semibold text-[#2c2c38]">
                {lead.proximaAcao}
              </span>
            </StatBox>
            <StatBox label="Data">
              <span
                className="text-[13px] font-semibold tabular-nums"
                style={{ color: lead.dataColor }}
              >
                {lead.dataLabel}
              </span>
            </StatBox>
          </div>

          <div className="mt-3.5 flex items-center gap-2">
            <span className="text-[11.5px] font-semibold text-[#9a9aa8]">
              Mover para:
            </span>
            <Select
              value={lead.status}
              onValueChange={(v) => actions.changeStatus(lead.id, v as StatusKey)}
            >
              <SelectTrigger className="h-auto flex-1 py-[7px] text-[12.5px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS.map((s) => (
                  <SelectItem key={s.key} value={s.key}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* tabs */}
        <div className="flex flex-none gap-0.5 border-b border-border px-6">
          {TABS.map((tb) => {
            const on = state.drawerTab === tb.key;
            return (
              <button
                key={tb.key}
                onClick={() => actions.setDrawerTab(tb.key)}
                className={cn(
                  "mr-[18px] border-b-2 px-1 py-3 text-[13px] font-semibold transition-colors",
                  on
                    ? "border-brand text-brand"
                    : "border-transparent text-[#9a9aa8]",
                )}
              >
                {tb.label}
              </button>
            );
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-[18px]">
          {state.drawerTab === "timeline" && (
            <>
              <div className="mb-[18px] rounded-[11px] border border-[#eeeef2] bg-[#f8f8fb] p-3">
                <div className="mb-[9px] flex flex-wrap gap-[7px]">
                  {Object.keys(TIPOS).map((t) => {
                    const on = state.newTipo === t;
                    const c = TIPOS[t];
                    return (
                      <button
                        key={t}
                        onClick={() => actions.setNewTipo(t)}
                        className="rounded-md border px-2.5 py-1 text-[11.5px] font-semibold transition-colors"
                        style={{
                          background: on ? c : "#fff",
                          color: on ? "#fff" : "#6c6c7c",
                          borderColor: on ? c : "#e4e4ea",
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
                <Textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Descreva a interação…"
                  rows={2}
                  className="resize-none rounded-lg text-[13px]"
                />
                <div className="mt-[9px] flex justify-end">
                  <button
                    onClick={submit}
                    className="rounded-lg bg-brand px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-brand/90"
                  >
                    Registrar interação
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                {lead.timeline.map((ev, i) => (
                  <div key={i} className="flex gap-[13px]">
                    <div className="flex flex-none flex-col items-center">
                      <div
                        className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-lg"
                        style={{ background: ev.bg }}
                      >
                        <span
                          className="h-[9px] w-[9px] rounded-[3px]"
                          style={{ background: ev.color }}
                        />
                      </div>
                      <div className="min-h-[12px] w-0.5 flex-1 bg-[#eeeef2]" />
                    </div>
                    <div className="min-w-0 flex-1 pb-[18px]">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[12.5px] font-bold text-[#2c2c38]">
                          {ev.tipo}
                        </span>
                        <span className="text-[11.5px] tabular-nums text-[#a0a0ac]">
                          {ev.dataLabel}
                        </span>
                      </div>
                      <div className="mt-[3px] text-[13px] leading-[1.5] text-[#52525e]">
                        {ev.descricao}
                      </div>
                    </div>
                  </div>
                ))}
                {lead.timelineEmpty && (
                  <div className="py-6 text-center text-[13px] text-[#a0a0ac]">
                    Nenhuma interação registrada ainda.
                  </div>
                )}
              </div>
            </>
          )}

          {state.drawerTab === "notas" && (
            <>
              <SectionLabel>Contato</SectionLabel>
              <div className="mb-[22px] grid grid-cols-2 gap-x-4 gap-y-[11px]">
                {lead.fields.map((fl) => (
                  <div key={fl.label}>
                    <div className="text-[11px] font-medium text-[#9a9aa8]">
                      {fl.label}
                    </div>
                    <div className="mt-0.5 text-[13px] font-medium text-[#2c2c38]">
                      {fl.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-[22px] flex flex-wrap gap-1.5">
                {lead.tags.map((tg) => (
                  <span
                    key={tg.label}
                    className="rounded-md px-2.5 py-1 text-[11.5px] font-semibold"
                    style={{ background: tg.bg, color: tg.color }}
                  >
                    {tg.label}
                  </span>
                ))}
              </div>
              <SectionLabel>Anotações</SectionLabel>
              <Textarea
                value={selectedLead.observacoes}
                onChange={(e) => actions.setNotes(lead.id, e.target.value)}
                placeholder="Observações livres sobre o lead…"
                rows={6}
                className="rounded-[10px] text-[13px] leading-[1.6]"
              />
            </>
          )}

          {state.drawerTab === "arquivos" && (
            <LeadFilesTab leadId={lead.id} arquivos={selectedLead.arquivos} />
          )}
        </div>
      </aside>
    </>
  );
}

function StatBox({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[10px] bg-[#f7f7fa] px-3 py-2.5">
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.4px] text-[#9a9aa8]">
        {label}
      </div>
      <div className="mt-[3px]">{children}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[0.5px] text-[#9a9aa8]">
      {children}
    </div>
  );
}
