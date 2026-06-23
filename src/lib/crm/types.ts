export type StatusKey =
  | "nao_contatado"
  | "primeiro"
  | "aguardando"
  | "reuniao"
  | "proposta"
  | "negociacao"
  | "fechado"
  | "perdido";

export type View = "dashboard" | "kanban" | "tarefas";
export type DrawerTab = "timeline" | "notas" | "arquivos";

export type TipoInteracao =
  | "Ligação"
  | "WhatsApp"
  | "E-mail"
  | "Reunião"
  | "Proposta"
  | "Follow-up"
  | "Observação";

export interface TimelineEvent {
  tipo: string;
  descricao: string;
  data: string;
}

export interface Arquivo {
  /** Stored id on the file server (the on-disk filename). Empty for demo files. */
  id: string;
  nome: string;
  ext: string;
  meta: string;
  bg: string;
  /** Download/preview URL served by the local file server. Empty for demo files. */
  url: string;
}

export interface Lead {
  id: number;
  empresa: string;
  contato: string;
  cargo: string;
  cidade: string;
  origem: string;
  servico: string;
  perfil: string;
  status: StatusKey;
  valor: number | null;
  proximaAcao: string | null;
  dataProx: string | null;
  parado: number | null;
  motivo: string | null;
  telefone: string;
  whatsapp: string;
  email: string;
  site: string;
  observacoes: string;
  timeline: TimelineEvent[];
  arquivos: Arquivo[];
}

export interface NewLeadForm {
  empresa: string;
  contato: string;
  telefone: string;
  cidade: string;
  valor: string;
  origem: string;
  servico: string;
}
