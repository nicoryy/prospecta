import { useMemo } from "react";
import { useCrm } from "@/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { saudacao } from "@/lib/crm/date";
import {
  buildFunnel,
  buildKpis,
  buildMotivos,
  buildOrigens,
  buildTasks,
  conversao,
  paradosCount,
  pipelineSummary,
} from "@/lib/crm/derive";

export function Dashboard() {
  const { state, actions } = useCrm();
  const leads = state.leads;

  const model = useMemo(() => {
    const kpis = buildKpis(leads);
    const tasks = buildTasks(leads, state.done);
    return {
      kpis,
      funnel: buildFunnel(leads),
      motivos: buildMotivos(leads),
      origens: buildOrigens(leads),
      pipeline: pipelineSummary(leads),
      conversao: conversao(leads),
      paradosCount: paradosCount(leads),
      resumoHoje: tasks.badge,
      resumoPropostas: leads.filter((l) => l.status === "proposta").length,
      resumoReunioes: leads.filter((l) => l.status === "reuniao").length,
    };
  }, [leads, state.done]);

  return (
    <div className="max-w-[1280px] px-4 pb-10 pt-6 sm:px-7">
      {/* hero row */}
      <div className="mb-[22px] flex flex-wrap gap-4">
        <div className="min-w-[260px] flex-1 rounded-2xl bg-[linear-gradient(120deg,#6d4aff,#8b6bff)] px-6 py-[22px] text-white">
          <div className="text-[13px] font-medium opacity-85">
            {saudacao()}, Rafael
          </div>
          <div className="mb-4 mt-1 text-[21px] font-bold tracking-[-0.3px]">
            Seu resumo de hoje
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-[26px]">
            <ResumoStat value={model.resumoHoje} label="contatos para hoje" />
            <ResumoStat value={model.resumoPropostas} label="propostas aguardando" />
            <ResumoStat value={model.resumoReunioes} label="reuniões agendadas" />
          </div>
        </div>

        <Card className="flex min-w-[260px] flex-1 flex-col justify-center rounded-2xl px-[22px] py-5">
          <div className="text-[12.5px] font-semibold uppercase tracking-[0.5px] text-muted-foreground">
            Valor potencial do pipeline
          </div>
          <div className="my-1 mt-1.5 text-[34px] font-bold tracking-[-0.8px] tabular-nums">
            {model.pipeline.totalFmt}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-[18px] gap-y-1 text-[12.5px] text-[#6c6c7c]">
            <span>
              Negociação <b className="text-foreground">{model.pipeline.negFmt}</b>
            </span>
            <span>
              Propostas <b className="text-foreground">{model.pipeline.propFmt}</b>
            </span>
          </div>
        </Card>
      </div>

      {/* KPI grid */}
      <div className="mb-[22px] grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {model.kpis.map((k) => (
          <Card key={k.label} className="rounded-[13px] px-4 py-[15px]">
            <div className="flex items-center gap-[7px]">
              <span
                className="h-2 w-2 flex-none rounded-sm"
                style={{ background: k.color }}
              />
              <span className="text-[12px] font-medium text-[#7c7c88]">
                {k.label}
              </span>
            </div>
            <div className="mt-2 text-[28px] font-bold tracking-[-0.5px] tabular-nums">
              {k.value}
            </div>
          </Card>
        ))}
      </div>

      {/* funnel + motivos */}
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="rounded-[14px] px-[22px] py-5">
          <div className="mb-4 text-sm font-bold">Funil de conversão</div>
          <div className="flex flex-col gap-[9px]">
            {model.funnel.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-[120px] flex-none text-[12.5px] text-[#6c6c7c]">
                  {f.label}
                </div>
                <div className="h-[30px] flex-1 overflow-hidden rounded-[7px] bg-[#f2f2f5]">
                  <div
                    className="flex h-full min-w-[34px] items-center rounded-[7px] pl-[11px] text-[12.5px] font-semibold text-white"
                    style={{ width: f.pct, background: f.color }}
                  >
                    {f.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-[#f0f0f3] pt-3.5 text-[12.5px] text-[#6c6c7c]">
            Taxa de conversão geral:{" "}
            <b className="text-[#10b981]">{model.conversao}</b>
          </div>
        </Card>

        <Card className="rounded-[14px] px-[22px] py-5">
          <div className="mb-4 text-sm font-bold">Motivos de perda</div>
          <div className="flex flex-col gap-[13px]">
            {model.motivos.map((m) => (
              <div key={m.label}>
                <div className="mb-[5px] flex justify-between text-[12.5px]">
                  <span className="text-[#4c4c58]">{m.label}</span>
                  <span className="font-semibold text-[#9a9aa8]">{m.pct}</span>
                </div>
                <div className="h-[7px] overflow-hidden rounded bg-[#f2f2f5]">
                  <div
                    className="h-full rounded bg-[#f43f5e]"
                    style={{ width: m.pct }}
                  />
                </div>
              </div>
            ))}
            {model.motivos.length === 0 && (
              <div className="py-2 text-[12.5px] text-muted-foreground">
                Nenhuma perda registrada.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* parados + origens */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card className="rounded-[14px] px-[22px] py-5">
          <div className="mb-1.5 flex items-center gap-[9px]">
            <span className="h-[9px] w-[9px] flex-none rounded-full bg-[#f59e0b]" />
            <div className="text-sm font-bold">Leads parados</div>
          </div>
          <div className="text-[13px] leading-[1.5] text-[#6c6c7c]">
            <b className="text-foreground">{model.paradosCount} empresas</b> estão
            sem interação há mais de 15 dias. Vale retomar o contato antes que
            esfriem.
          </div>
          <Button
            variant="outline"
            onClick={() => actions.setView("tarefas")}
            className="mt-3.5 h-auto border-[#f5e2c0] bg-[#fff7ec] px-[13px] py-2 text-[12.5px] text-[#b4760a] hover:bg-[#fdeecf]"
          >
            Ver follow-ups pendentes →
          </Button>
        </Card>

        <Card className="rounded-[14px] px-[22px] py-5">
          <div className="mb-3.5 text-sm font-bold">Desempenho por origem</div>
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 text-[12.5px]">
            <div className="border-b border-[#f0f0f3] pb-2 font-semibold text-[#9a9aa8]">
              Origem
            </div>
            <div className="border-b border-[#f0f0f3] pb-2 text-right font-semibold text-[#9a9aa8]">
              Leads
            </div>
            <div className="border-b border-[#f0f0f3] pb-2 text-right font-semibold text-[#9a9aa8]">
              Fechados
            </div>
            {model.origens.map((o) => (
              <Origem key={o.label} {...o} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ResumoStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-[30px] font-bold leading-none tabular-nums">{value}</div>
      <div className="mt-[5px] text-[12px] opacity-85">{label}</div>
    </div>
  );
}

function Origem({
  label,
  leads,
  fechados,
  fechadosColor,
}: {
  label: string;
  leads: number;
  fechados: number;
  fechadosColor: string;
}) {
  return (
    <>
      <div className="border-b border-[#f6f6f8] py-2 text-[#3c3c48]">{label}</div>
      <div className="border-b border-[#f6f6f8] py-2 text-right tabular-nums text-[#6c6c7c]">
        {leads}
      </div>
      <div
        className="border-b border-[#f6f6f8] py-2 text-right font-bold tabular-nums"
        style={{ color: fechadosColor }}
      >
        {fechados}
      </div>
    </>
  );
}
