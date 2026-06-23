import { STATUS_BY_KEY } from "./constants";
import type { Lead } from "./types";

interface Column {
  header: string;
  value: (l: Lead) => string | number | null;
}

const COLUMNS: Column[] = [
  { header: "id", value: (l) => l.id },
  { header: "empresa", value: (l) => l.empresa },
  { header: "contato", value: (l) => l.contato },
  { header: "cargo", value: (l) => l.cargo },
  { header: "telefone", value: (l) => l.telefone },
  { header: "whatsapp", value: (l) => l.whatsapp },
  { header: "email", value: (l) => l.email },
  { header: "site", value: (l) => l.site },
  { header: "cidade", value: (l) => l.cidade },
  { header: "origem", value: (l) => l.origem },
  { header: "status", value: (l) => STATUS_BY_KEY[l.status]?.label ?? l.status },
  { header: "perfil", value: (l) => l.perfil },
  { header: "servico", value: (l) => l.servico },
  { header: "valor_estimado", value: (l) => (l.valor ?? "") },
  { header: "proxima_acao", value: (l) => l.proximaAcao ?? "" },
  { header: "data_proxima_acao", value: (l) => l.dataProx ?? "" },
  { header: "dias_parado", value: (l) => (l.parado ?? "") },
  { header: "motivo_perda", value: (l) => l.motivo ?? "" },
  { header: "observacoes", value: (l) => l.observacoes },
];

/** RFC 4180 field escaping: quote when the value contains a delimiter, quote or newline. */
function escapeField(value: string | number | null): string {
  const s = value == null ? "" : String(value);
  if (/[",\r\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export function leadsToCsv(leads: Lead[]): string {
  const header = COLUMNS.map((c) => c.header).join(",");
  const rows = leads.map((l) =>
    COLUMNS.map((c) => escapeField(c.value(l))).join(","),
  );
  return [header, ...rows].join("\r\n");
}

/** Triggers a client-side download of the leads as a CSV file (UTF-8 with BOM). */
export function downloadLeadsCsv(leads: Lead[], filename?: string): void {
  const date = new Date().toISOString().slice(0, 10);
  const name = filename ?? `prospecta-leads-${date}.csv`;
  // BOM so Excel reads accented characters correctly.
  const content = "﻿" + leadsToCsv(leads);
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
