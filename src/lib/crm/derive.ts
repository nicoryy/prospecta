import {
  PERFIL,
  PERFIL_FALLBACK,
  PIPELINE_KEYS,
  SERVICOS,
  STATUS,
  STATUS_BY_KEY,
  TIPOS,
  TODAY,
} from "./constants";
import { brl, brlK, diff, fmt } from "./date";
import type { Lead, StatusKey } from "./types";

export const isActive = (l: Lead) =>
  l.status !== "fechado" && l.status !== "perdido";

const count = (leads: Lead[], k: StatusKey) =>
  leads.filter((l) => l.status === k).length;

const sumVal = (leads: Lead[], keys: StatusKey[]) =>
  leads
    .filter((l) => keys.includes(l.status))
    .reduce((a, l) => a + (l.valor || 0), 0);

// ---------- filtering ----------
export function filterLeads(
  leads: Lead[],
  search: string,
  activeTag: string | null,
): Lead[] {
  const q = search.trim().toLowerCase();
  return leads.filter((l) => {
    if (
      q &&
      !(
        l.empresa.toLowerCase().includes(q) ||
        l.contato.toLowerCase().includes(q) ||
        l.cidade.toLowerCase().includes(q)
      )
    )
      return false;
    if (activeTag && l.servico !== activeTag && l.perfil !== activeTag)
      return false;
    return true;
  });
}

// ---------- dashboard ----------
export interface Kpi {
  label: string;
  value: number;
  color: string;
}

export function buildKpis(leads: Lead[]): Kpi[] {
  return [
    { label: "Total de leads", value: leads.length, color: "#6d4aff" },
    {
      label: "Contatados",
      value: leads.filter((l) => l.status !== "nao_contatado").length,
      color: "#3b82f6",
    },
    { label: "Aguardando retorno", value: count(leads, "aguardando"), color: "#f59e0b" },
    { label: "Reuniões agendadas", value: count(leads, "reuniao"), color: "#8b5cf6" },
    { label: "Propostas enviadas", value: count(leads, "proposta"), color: "#06b6d4" },
    { label: "Em negociação", value: count(leads, "negociacao"), color: "#f97316" },
    { label: "Fechados", value: count(leads, "fechado"), color: "#10b981" },
    { label: "Perdidos", value: count(leads, "perdido"), color: "#f43f5e" },
  ];
}

export interface FunnelRow {
  label: string;
  value: number;
  color: string;
  pct: string;
}

export function buildFunnel(leads: Lead[]): FunnelRow[] {
  const encontradas = leads.length;
  const contatadas = leads.filter((l) => l.status !== "nao_contatado").length;
  const reun = leads.filter((l) =>
    ["reuniao", "proposta", "negociacao", "fechado"].includes(l.status),
  ).length;
  const props = leads.filter((l) =>
    ["proposta", "negociacao", "fechado"].includes(l.status),
  ).length;
  const fech = count(leads, "fechado");
  const maxF = Math.max(encontradas, 1);
  return [
    { label: "Leads encontrados", value: encontradas, color: "#94a3b8" },
    { label: "Contatados", value: contatadas, color: "#3b82f6" },
    { label: "Reuniões", value: reun, color: "#8b5cf6" },
    { label: "Propostas", value: props, color: "#06b6d4" },
    { label: "Fechados", value: fech, color: "#10b981" },
  ].map((f) => ({ ...f, pct: Math.max(8, Math.round((f.value / maxF) * 100)) + "%" }));
}

export function conversao(leads: Lead[]): string {
  const encontradas = leads.length;
  const fech = count(leads, "fechado");
  return encontradas ? Math.round((fech / encontradas) * 100) + "%" : "0%";
}

export interface MotivoRow {
  label: string;
  pct: string;
}

export function buildMotivos(leads: Lead[]): MotivoRow[] {
  const perdidos = leads.filter((l) => l.status === "perdido");
  const mt: Record<string, number> = {};
  perdidos.forEach((l) => {
    const m = l.motivo || "Outro";
    mt[m] = (mt[m] || 0) + 1;
  });
  const totP = Math.max(perdidos.length, 1);
  return Object.entries(mt)
    .sort((a, b) => b[1] - a[1])
    .map(([label, n]) => ({ label, pct: Math.round((n / totP) * 100) + "%" }));
}

export interface OrigemRow {
  label: string;
  leads: number;
  fechados: number;
  fechadosColor: string;
}

export function buildOrigens(leads: Lead[]): OrigemRow[] {
  const og: Record<string, { leads: number; fechados: number }> = {};
  leads.forEach((l) => {
    if (!og[l.origem]) og[l.origem] = { leads: 0, fechados: 0 };
    og[l.origem].leads++;
    if (l.status === "fechado") og[l.origem].fechados++;
  });
  return Object.entries(og)
    .sort((a, b) => b[1].fechados - a[1].fechados || b[1].leads - a[1].leads)
    .map(([label, v]) => ({
      label,
      leads: v.leads,
      fechados: v.fechados,
      fechadosColor: v.fechados > 0 ? "#10b981" : "#c4c4cc",
    }));
}

export interface PipeMiniRow {
  label: string;
  count: number;
  color: string;
}

export function pipeMini(leads: Lead[]): PipeMiniRow[] {
  return [
    { label: "Aguardando", count: count(leads, "aguardando"), color: "#f59e0b" },
    { label: "Reuniões", count: count(leads, "reuniao"), color: "#8b5cf6" },
    { label: "Propostas", count: count(leads, "proposta"), color: "#06b6d4" },
    { label: "Negociação", count: count(leads, "negociacao"), color: "#f97316" },
  ];
}

export interface PipelineSummary {
  totalFmt: string;
  negFmt: string;
  propFmt: string;
}

export function pipelineSummary(leads: Lead[]): PipelineSummary {
  return {
    totalFmt: brl(sumVal(leads, PIPELINE_KEYS)),
    negFmt: brl(sumVal(leads, ["negociacao"])),
    propFmt: brl(sumVal(leads, ["proposta"])),
  };
}

export function paradosCount(leads: Lead[]): number {
  return leads.filter((l) => isActive(l) && l.parado != null && l.parado >= 15)
    .length;
}

// ---------- tasks ----------
export interface TaskItem {
  id: number;
  acao: string;
  empresa: string;
  contato: string;
  telefone: string;
  done: boolean;
  atraso: string;
  statusLabel: string;
  statusBg: string;
  statusColor: string;
}

function mkTask(l: Lead, done: boolean): TaskItem {
  const st = STATUS_BY_KEY[l.status];
  const atrasoD = diff(TODAY, l.dataProx!);
  return {
    id: l.id,
    acao: l.proximaAcao || "",
    empresa: l.empresa,
    contato: l.contato,
    telefone: l.telefone,
    done,
    atraso: atrasoD === 1 ? "1 dia atrás" : atrasoD + " dias atrás",
    statusLabel: st.label,
    statusBg: st.bg,
    statusColor: st.color,
  };
}

export interface TasksModel {
  atrasadas: TaskItem[];
  hoje: TaskItem[];
  badge: number;
  feitasHoje: number;
}

export function buildTasks(leads: Lead[], done: Record<number, boolean>): TasksModel {
  const taskLeads = leads.filter((l) => isActive(l) && l.dataProx);
  const atrasadas = taskLeads
    .filter((l) => diff(TODAY, l.dataProx!) > 0)
    .sort((a, b) => diff(TODAY, b.dataProx!) - diff(TODAY, a.dataProx!))
    .map((l) => mkTask(l, !!done[l.id]));
  const hoje = taskLeads
    .filter((l) => l.dataProx === TODAY)
    .map((l) => mkTask(l, !!done[l.id]));
  const badge = atrasadas.length + hoje.length;
  const feitasHoje = [...atrasadas, ...hoje].filter((t) => t.done).length;
  return { atrasadas, hoje, badge, feitasHoje };
}

// ---------- follow-ups ----------
export interface FollowupLead {
  id: number;
  empresa: string;
  dias: number;
}

export interface FollowupBucket {
  label: string;
  color: string;
  count: number;
  leads: FollowupLead[];
  empty: boolean;
}

export function buildFollowups(leads: Lead[]): FollowupBucket[] {
  const contacted = leads.filter((l) => isActive(l) && l.parado != null);
  const bucket = (min: number, max: number | null): FollowupLead[] =>
    contacted
      .filter((l) => l.parado! >= min && (max == null || l.parado! < max))
      .sort((a, b) => b.parado! - a.parado!)
      .map((l) => ({ id: l.id, empresa: l.empresa, dias: l.parado! }));

  const defs: [number, number | null, string, string][] = [
    [3, 7, "3+ dias", "#f59e0b"],
    [7, 15, "7+ dias", "#f97316"],
    [15, 30, "15+ dias", "#f43f5e"],
    [30, null, "30+ dias", "#e11d48"],
  ];
  return defs.map(([mn, mx, label, color]) => {
    const lds = bucket(mn, mx);
    return { label, color, count: lds.length, leads: lds.slice(0, 4), empty: lds.length === 0 };
  });
}

// ---------- kanban ----------
export interface KanbanCard {
  id: number;
  empresa: string;
  contato: string;
  cidade: string;
  valorFmt: string;
  servico: string;
  perfil: string;
  perfilBg: string;
  perfilColor: string;
  hasAcao: boolean;
  proximaAcao: string;
  dataLabel: string;
  acaoColor: string;
}

export interface KanbanColumn {
  key: StatusKey;
  label: string;
  color: string;
  count: number;
  empty: boolean;
  valorFmt: string;
  cards: KanbanCard[];
}

export function buildColumns(filtered: Lead[]): KanbanColumn[] {
  return STATUS.map((st) => {
    const colLeads = filtered.filter((l) => l.status === st.key);
    const cards: KanbanCard[] = colLeads.map((l) => {
      const p = PERFIL[l.perfil] || PERFIL_FALLBACK;
      const overdue = !!l.dataProx && diff(TODAY, l.dataProx) > 0;
      const todayDue = l.dataProx === TODAY;
      return {
        id: l.id,
        empresa: l.empresa,
        contato: l.contato,
        cidade: l.cidade,
        valorFmt: brlK(l.valor),
        servico: l.servico,
        perfil: l.perfil,
        perfilBg: p.bg,
        perfilColor: p.color,
        hasAcao: !!l.proximaAcao && isActive(l),
        proximaAcao: l.proximaAcao || "",
        dataLabel: l.dataProx ? fmt(l.dataProx) : "",
        acaoColor: overdue ? "#e11d48" : todayDue ? "#6d4aff" : "#9a9aa8",
      };
    });
    return {
      key: st.key,
      label: st.label,
      color: st.color,
      count: cards.length,
      empty: cards.length === 0,
      valorFmt: brlK(colLeads.reduce((a, l) => a + (l.valor || 0), 0)),
      cards,
    };
  });
}

export interface TagChip {
  label: string;
  key: string | null;
}

export function tagChips(): TagChip[] {
  const allTags = [
    ...SERVICOS,
    "Cliente Quente",
    "Alto Potencial",
    "Empresa Média",
    "Pequeno Negócio",
  ];
  return [{ label: "Todos", key: null }, ...allTags.map((t) => ({ label: t, key: t }))];
}

// ---------- selected lead ----------
export interface LeadField {
  label: string;
  value: string;
}

export interface LeadTag {
  label: string;
  bg: string;
  color: string;
}

export interface TimelineView {
  tipo: string;
  descricao: string;
  dataLabel: string;
  color: string;
  bg: string;
}

export interface LeadView {
  id: number;
  status: StatusKey;
  statusLabel: string;
  statusBg: string;
  statusColor: string;
  empresa: string;
  contato: string;
  cargo: string;
  valorFmt: string;
  proximaAcao: string;
  dataLabel: string;
  dataColor: string;
  observacoes: string;
  timeline: TimelineView[];
  timelineEmpty: boolean;
  fields: LeadField[];
  tags: LeadTag[];
  arquivos: Lead["arquivos"];
  arquivosEmpty: boolean;
}

export function buildLeadView(l: Lead): LeadView {
  const st = STATUS_BY_KEY[l.status];
  const overdue = !!l.dataProx && diff(TODAY, l.dataProx) > 0;
  const perfil = PERFIL[l.perfil] || PERFIL_FALLBACK;
  return {
    id: l.id,
    status: l.status,
    statusLabel: st.label,
    statusBg: st.bg,
    statusColor: st.color,
    empresa: l.empresa,
    contato: l.contato,
    cargo: l.cargo,
    valorFmt: brl(l.valor),
    proximaAcao: l.proximaAcao || "—",
    dataLabel: fmt(l.dataProx),
    dataColor: overdue ? "#e11d48" : "#2c2c38",
    observacoes: l.observacoes,
    timeline: l.timeline.map((e) => ({
      tipo: e.tipo,
      descricao: e.descricao,
      dataLabel: fmt(e.data),
      color: TIPOS[e.tipo] || "#94a3b8",
      bg: (TIPOS[e.tipo] || "#94a3b8") + "1f",
    })),
    timelineEmpty: l.timeline.length === 0,
    fields: [
      { label: "Telefone", value: l.telefone },
      { label: "WhatsApp", value: l.whatsapp },
      { label: "E-mail", value: l.email },
      { label: "Site", value: l.site },
      { label: "Cidade", value: l.cidade },
      { label: "Origem", value: l.origem },
    ],
    tags: [
      { label: l.servico, bg: "#f1edff", color: "#6d4aff" },
      { label: l.perfil, bg: perfil.bg, color: perfil.color },
    ],
    arquivos: l.arquivos,
    arquivosEmpty: l.arquivos.length === 0,
  };
}
