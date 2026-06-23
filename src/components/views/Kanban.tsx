import { useMemo } from "react";
import { useCrm } from "@/store";
import { cn } from "@/lib/utils";
import {
  buildColumns,
  filterLeads,
  tagChips,
  type KanbanCard as Card,
} from "@/lib/crm/derive";

export function Kanban() {
  const { state, actions } = useCrm();

  const filtered = useMemo(
    () => filterLeads(state.leads, state.search, state.activeTag),
    [state.leads, state.search, state.activeTag],
  );
  const columns = useMemo(() => buildColumns(filtered), [filtered]);
  const chips = useMemo(() => tagChips(), []);

  return (
    <div className="flex h-full flex-col">
      {/* filter bar */}
      <div className="flex flex-none flex-wrap items-center gap-[9px] border-b border-border bg-card px-6 py-3.5">
        <span className="mr-0.5 text-[12px] font-semibold text-muted-foreground">
          Filtrar:
        </span>
        {chips.map((c) => {
          const on = state.activeTag === c.key;
          return (
            <button
              key={c.label}
              onClick={() => actions.setActiveTag(c.key)}
              className={cn(
                "rounded-full border px-[11px] py-[5px] text-[12px] font-medium transition-colors",
                on
                  ? "border-brand bg-brand text-white"
                  : "border-[#e4e4ea] bg-card text-[#6c6c7c] hover:bg-secondary",
              )}
            >
              {c.label}
            </button>
          );
        })}
        <span className="ml-auto text-[12.5px] text-[#9a9aa8]">
          {filtered.length} leads
        </span>
      </div>

      {/* board */}
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden px-6 pb-5 pt-4">
        <div className="flex h-full min-w-max gap-3.5">
          {columns.map((col) => {
            const over = state.dragOverCol === col.key;
            return (
              <div
                key={col.key}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (state.dragOverCol !== col.key) actions.setDragOver(col.key);
                }}
                onDragLeave={() => {
                  if (state.dragOverCol === col.key) actions.setDragOver(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  actions.drop(col.key);
                }}
                className="flex max-h-full w-[272px] flex-none flex-col rounded-xl bg-[#f0f0f4] transition-[outline]"
                style={{ outline: `2px solid ${over ? col.color : "transparent"}` }}
              >
                <div className="flex flex-none items-center gap-2 px-3.5 pb-2.5 pt-3">
                  <span
                    className="h-[9px] w-[9px] flex-none rounded-[3px]"
                    style={{ background: col.color }}
                  />
                  <span className="text-[13px] font-bold text-[#2c2c38]">
                    {col.label}
                  </span>
                  <span className="text-[12px] font-semibold tabular-nums text-[#9a9aa8]">
                    {col.count}
                  </span>
                  <span className="ml-auto text-[11px] tabular-nums text-[#9a9aa8]">
                    {col.valorFmt}
                  </span>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-[9px] overflow-y-auto px-[9px] pb-3 pt-0.5">
                  {col.cards.map((card) => (
                    <KanbanCard
                      key={card.id}
                      card={card}
                      color={col.color}
                      dragging={state.draggingId === card.id}
                      onOpen={() => actions.openLead(card.id)}
                      onDragStart={() => actions.setDragging(card.id)}
                      onDragEnd={() => {
                        actions.setDragging(null);
                        actions.setDragOver(null);
                      }}
                    />
                  ))}
                  {col.empty && (
                    <div className="px-2 py-[18px] text-center text-[11.5px] text-[#b0b0bc]">
                      Nenhum lead
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KanbanCard({
  card,
  color,
  dragging,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  card: Card;
  color: string;
  dragging: boolean;
  onOpen: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      className="cursor-pointer rounded-[9px] border border-[#e8e8ee] bg-card p-3 shadow-[0_1px_2px_rgba(20,20,40,0.04)]"
      style={{ borderLeft: `3px solid ${color}`, opacity: dragging ? 0.4 : 1 }}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 text-[13px] font-bold leading-[1.25] text-foreground">
          {card.empresa}
        </div>
        <div className="whitespace-nowrap text-[12px] font-bold tabular-nums text-brand">
          {card.valorFmt}
        </div>
      </div>
      <div className="mt-[3px] text-[11.5px] text-[#8c8c98]">
        {card.contato} · {card.cidade}
      </div>
      <div className="mt-[9px] flex flex-wrap gap-[5px]">
        <span className="rounded-[5px] bg-[#f1edff] px-[7px] py-0.5 text-[10.5px] font-semibold text-brand">
          {card.servico}
        </span>
        <span
          className="rounded-[5px] px-[7px] py-0.5 text-[10.5px] font-semibold"
          style={{ background: card.perfilBg, color: card.perfilColor }}
        >
          {card.perfil}
        </span>
      </div>
      {card.hasAcao && (
        <div className="mt-2.5 flex items-center gap-1.5 border-t border-[#f2f2f5] pt-[9px]">
          <span
            className="h-1.5 w-1.5 flex-none rounded-full"
            style={{ background: card.acaoColor }}
          />
          <span className="text-[11.5px] font-medium text-[#4c4c58]">
            {card.proximaAcao}
          </span>
          <span
            className="ml-auto text-[11px] font-semibold tabular-nums"
            style={{ color: card.acaoColor }}
          >
            {card.dataLabel}
          </span>
        </div>
      )}
    </div>
  );
}
