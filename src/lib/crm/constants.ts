import type { StatusKey } from "./types";

export interface StatusDef {
  key: StatusKey;
  label: string;
  color: string;
  bg: string;
}

export const STATUS: StatusDef[] = [
  { key: "nao_contatado", label: "Não Contatado", color: "#94a3b8", bg: "#eef1f5" },
  { key: "primeiro", label: "Primeiro Contato", color: "#3b82f6", bg: "#e8f0fe" },
  { key: "aguardando", label: "Aguardando Retorno", color: "#f59e0b", bg: "#fdf2dd" },
  { key: "reuniao", label: "Reunião Agendada", color: "#8b5cf6", bg: "#f0eafe" },
  { key: "proposta", label: "Proposta Enviada", color: "#06b6d4", bg: "#e1f6fb" },
  { key: "negociacao", label: "Negociação", color: "#f97316", bg: "#feeede" },
  { key: "fechado", label: "Fechado", color: "#10b981", bg: "#e3f7ef" },
  { key: "perdido", label: "Perdido", color: "#f43f5e", bg: "#fdeaed" },
];

export const STATUS_BY_KEY: Record<StatusKey, StatusDef> = STATUS.reduce(
  (acc, s) => {
    acc[s.key] = s;
    return acc;
  },
  {} as Record<StatusKey, StatusDef>,
);

export const TIPOS: Record<string, string> = {
  Ligação: "#3b82f6",
  WhatsApp: "#10b981",
  "E-mail": "#8b5cf6",
  Reunião: "#f59e0b",
  Proposta: "#06b6d4",
  "Follow-up": "#f97316",
  Observação: "#94a3b8",
};

export interface PerfilStyle {
  bg: string;
  color: string;
}

export const PERFIL: Record<string, PerfilStyle> = {
  "Cliente Quente": { bg: "#fdeaed", color: "#e11d48" },
  "Cliente Morno": { bg: "#fdf2dd", color: "#b4760a" },
  "Cliente Frio": { bg: "#e8f0fe", color: "#2563eb" },
  "Alto Potencial": { bg: "#f0eafe", color: "#7c3aed" },
  "Pequeno Negócio": { bg: "#eef1f5", color: "#64748b" },
  "Empresa Média": { bg: "#e3f7ef", color: "#059669" },
};

export const PERFIL_FALLBACK: PerfilStyle = { bg: "#eef1f5", color: "#64748b" };

export const ORIGENS = [
  "Google Maps",
  "Instagram",
  "LinkedIn",
  "Indicação",
  "Site próprio",
  "Outro",
];

export const SERVICOS = [
  "Site Institucional",
  "Landing Page",
  "E-commerce",
  "Sistema Web",
  "Sistema Interno",
  "Aplicativo",
  "Automação",
];

/** Status keys that compose the active pipeline value. */
export const PIPELINE_KEYS: StatusKey[] = [
  "primeiro",
  "aguardando",
  "reuniao",
  "proposta",
  "negociacao",
];

/** "Today" is fixed so the seed's relative dates stay meaningful. */
export const TODAY = "2026-06-23";
