import { useMemo } from "react";
import { Check } from "lucide-react";
import { useCrm } from "@/store";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fmt } from "@/lib/crm/date";
import { TODAY } from "@/lib/crm/constants";
import { buildFollowups, buildTasks, type TaskItem } from "@/lib/crm/derive";

export function Tarefas() {
  const { state, actions } = useCrm();

  const tasks = useMemo(
    () => buildTasks(state.leads, state.done),
    [state.leads, state.done],
  );
  const followups = useMemo(() => buildFollowups(state.leads), [state.leads]);

  return (
    <div className="max-w-[880px] px-7 pb-10 pt-6">
      <Card className="mb-[18px] rounded-[14px] px-[22px] py-5">
        <div className="flex items-center gap-[9px]">
          <div className="text-[15px] font-bold">Agenda comercial</div>
          <div className="text-[12.5px] text-muted-foreground">{fmt(TODAY)}</div>
          <span className="ml-auto text-[12.5px] text-[#6c6c7c]">
            <b className="text-[#10b981]">{tasks.feitasHoje}</b> concluídas
          </span>
        </div>
      </Card>

      {/* atrasadas */}
      {tasks.atrasadas.length > 0 && (
        <>
          <SectionHeader
            dot="#f43f5e"
            label="Atrasadas"
            count={tasks.atrasadas.length}
            labelClass="text-[#e11d48]"
          />
          <div className="mb-[22px] flex flex-col gap-2">
            {tasks.atrasadas.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                overdue
                onToggle={() => actions.toggleDone(t.id)}
                onOpen={() => actions.openLead(t.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* hoje */}
      <SectionHeader dot="#6d4aff" label="Hoje" count={tasks.hoje.length} />
      <div className="mb-[22px] flex flex-col gap-2">
        {tasks.hoje.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            onToggle={() => actions.toggleDone(t.id)}
            onOpen={() => actions.openLead(t.id)}
          />
        ))}
        {tasks.hoje.length === 0 && (
          <div className="rounded-[11px] border border-dashed border-[#e0e0e8] bg-card p-[22px] text-center text-[13px] text-[#9a9aa8]">
            Nenhuma tarefa para hoje. Bom trabalho!
          </div>
        )}
      </div>

      {/* follow-up automático */}
      <div className="mx-0.5 mb-3 mt-1.5 flex items-center gap-2">
        <span className="h-[9px] w-[9px] flex-none rounded-full bg-[#f59e0b]" />
        <div className="text-[13px] font-bold">Follow-up automático</div>
        <span className="text-[12px] text-[#9a9aa8]">sem resposta há…</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {followups.map((fu) => (
          <Card key={fu.label} className="rounded-xl px-4 py-[15px]">
            <div className="mb-[11px] flex items-baseline gap-2">
              <div
                className="text-[20px] font-bold tabular-nums"
                style={{ color: fu.color }}
              >
                {fu.count}
              </div>
              <div className="text-[12.5px] font-medium text-[#6c6c7c]">
                {fu.label}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {fu.leads.map((l) => (
                <button
                  key={l.id}
                  onClick={() => actions.openLead(l.id)}
                  className="flex w-full items-center gap-2 rounded-lg border border-[#eeeef2] bg-[#f8f8fb] px-2.5 py-2 text-left hover:bg-secondary"
                >
                  <span className="text-[12.5px] font-semibold text-[#2c2c38]">
                    {l.empresa}
                  </span>
                  <span className="ml-auto text-[11px] text-[#9a9aa8]">
                    {l.dias}d
                  </span>
                </button>
              ))}
              {fu.empty && (
                <div className="px-0.5 py-1 text-[12px] text-[#b0b0bc]">
                  Nada por aqui
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({
  dot,
  label,
  count,
  labelClass,
}: {
  dot: string;
  label: string;
  count: number;
  labelClass?: string;
}) {
  return (
    <div className="mx-0.5 mb-2.5 mt-1.5 flex items-center gap-2">
      <span
        className="h-[9px] w-[9px] flex-none rounded-full"
        style={{ background: dot }}
      />
      <div className={cn("text-[13px] font-bold", labelClass)}>{label}</div>
      <span className="text-[12px] text-[#9a9aa8]">{count}</span>
    </div>
  );
}

function TaskRow({
  task,
  overdue,
  onToggle,
  onOpen,
}: {
  task: TaskItem;
  overdue?: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-[13px] rounded-[11px] border bg-card px-[15px] py-[13px]",
        overdue ? "border-[#f3d4da]" : "border-border",
      )}
    >
      <button
        onClick={onToggle}
        className="flex h-[21px] w-[21px] flex-none items-center justify-center rounded-md border-2 p-0 transition-colors"
        style={{
          borderColor: task.done ? "#10b981" : "#d0d0da",
          background: task.done ? "#10b981" : "#fff",
        }}
        aria-label={task.done ? "Marcar como pendente" : "Concluir tarefa"}
      >
        <Check
          className="h-[11px] w-[11px] text-white"
          strokeWidth={3}
          style={{ opacity: task.done ? 1 : 0 }}
        />
      </button>
      <div className="min-w-0 flex-1">
        <div
          className="text-[13.5px] font-semibold text-foreground"
          style={{ textDecoration: task.done ? "line-through" : "none" }}
        >
          {task.acao} — {task.empresa}
        </div>
        <div className="mt-0.5 text-[11.5px] text-[#8c8c98]">
          {task.contato} · {task.telefone}
        </div>
      </div>
      {overdue ? (
        <span className="whitespace-nowrap rounded-md bg-[#fdeef0] px-[9px] py-[3px] text-[11.5px] font-semibold text-[#e11d48]">
          {task.atraso}
        </span>
      ) : (
        <span
          className="whitespace-nowrap rounded-[5px] px-2 py-[3px] text-[10.5px] font-semibold"
          style={{ background: task.statusBg, color: task.statusColor }}
        >
          {task.statusLabel}
        </span>
      )}
      <button
        onClick={onOpen}
        className="whitespace-nowrap rounded-md border border-[#e8e8ee] bg-[#f4f4f7] px-[11px] py-1.5 text-[12px] font-semibold text-[#4c4c58] hover:bg-secondary"
      >
        Abrir
      </button>
    </div>
  );
}
