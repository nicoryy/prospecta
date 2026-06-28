import { STATUS_BY_KEY, STATUS } from "./constants";
import type { Lead, StatusKey } from "./types";

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

// ---------------------------------------------------------------------------
// Import (CSV → Lead[])
// ---------------------------------------------------------------------------

const STATUS_LABEL_TO_KEY: Record<string, string> = {};
for (const def of STATUS) {
  STATUS_LABEL_TO_KEY[def.label] = def.key;
}

/** RFC 4180 line parser: respects quoted fields with "" escaping. */
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQ = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQ = true;
    } else if (ch === ",") {
      fields.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

export interface CsvImportResult {
  leads: Lead[];
  totalRows: number;
  duplicates: number;
}

/**
 * Parses a CSV string (same columns as the export) and returns only the leads
 * that do NOT duplicate existing ones. Dedup is done by normalized fields:
 * empresa, telefone, whatsapp, email, site (case-insensitive, digits-only phones).
 */
export function csvToLeads(csvText: string, existingLeads: Lead[]): CsvImportResult {
  const text = csvText.replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return { leads: [], totalRows: 0, duplicates: 0 };

  const header = parseCsvLine(lines[0]);

  const existingKeys = new Set<string>();
  for (const lead of existingLeads) {
    for (const v of [lead.empresa, lead.telefone, lead.whatsapp, lead.email, lead.site]) {
      const norm = normalizeKey(v);
      if (norm) existingKeys.add(norm);
    }
  }

  let maxId = Math.max(0, ...existingLeads.map((l) => l.id));
  let nextId = maxId + 1;
  const leads: Lead[] = [];
  let totalRows = 0;
  let duplicates = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    totalRows++;

    const fields = parseCsvLine(line);
    if (fields.length < 2) continue;

    const row: Record<string, string> = {};
    for (let j = 0; j < header.length && j < fields.length; j++) {
      row[header[j]] = fields[j].trim();
    }

    const empresa = row["empresa"]?.trim() || "";
    if (!empresa) continue;

    const telefone = row["telefone"]?.trim() || "";
    const whatsapp = row["whatsapp"]?.trim() || "";
    const email = row["email"]?.trim() || "";
    const site = row["site"]?.trim() || "";

    const candidateKeys = [empresa, telefone, whatsapp, email, site].map(normalizeKey).filter(Boolean);
    const isDup = candidateKeys.some((k) => k && existingKeys.has(k));
    if (isDup) {
      duplicates++;
      continue;
    }

    for (const k of candidateKeys) {
      if (k) existingKeys.add(k);
    }

    const statusLabel = row["status"]?.trim() || "";
    const status = (STATUS_LABEL_TO_KEY[statusLabel] ?? "nao_contatado") as StatusKey;

    leads.push({
      id: nextId++,
      empresa,
      contato: row["contato"]?.trim() || "—",
      cargo: row["cargo"]?.trim() || "—",
      cidade: row["cidade"]?.trim() || "—",
      origem: row["origem"]?.trim() || "",
      servico: row["servico"]?.trim() || "",
      perfil: row["perfil"]?.trim() || "",
      status,
      valor: row["valor_estimado"] ? Number(row["valor_estimado"]) || null : null,
      proximaAcao: row["proxima_acao"]?.trim() || null,
      dataProx: row["data_proxima_acao"]?.trim() || null,
      parado: row["dias_parado"] ? Number(row["dias_parado"]) || null : null,
      motivo: row["motivo_perda"]?.trim() || null,
      telefone: telefone || "—",
      whatsapp: whatsapp || "—",
      email: email || "—",
      site: site || "—",
      observacoes: row["observacoes"]?.trim() || "",
      timeline: [],
      arquivos: [],
    });
  }

  return { leads, totalRows, duplicates };
}

function normalizeKey(v: string | null | undefined): string | null {
  if (!v) return null;
  const s = v.toLowerCase().trim();
  if (!s || s === "—") return null;

  const digitsOnly = s.replace(/\D/g, "");
  if (digitsOnly.length >= 6) return digitsOnly;

  return s;
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
