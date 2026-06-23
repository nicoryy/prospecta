import { TODAY } from "./constants";

export function parse(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function iso(d: Date): string {
  const z = (n: number) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
}

/** "2026-06-23" -> "23/06/2026" */
export function fmt(s: string | null): string {
  if (!s) return "—";
  const [y, m, d] = s.split("-");
  return d + "/" + m + "/" + y;
}

export function daysAgo(n: number): string {
  const d = parse(TODAY);
  d.setDate(d.getDate() - n);
  return iso(d);
}

/** Whole-day difference a - b (positive when a is later than b). */
export function diff(a: string, b: string): number {
  return Math.round((parse(a).getTime() - parse(b).getTime()) / 86400000);
}

export function brl(n: number | null | undefined): string {
  if (n == null) return "—";
  return "R$ " + Number(n).toLocaleString("pt-BR");
}

/** Compact currency: 28000 -> "R$ 28k", 4500 -> "R$ 4.5k" */
export function brlK(n: number | null | undefined): string {
  if (!n) return "R$ 0";
  if (n >= 1000) return "R$ " + (n / 1000).toFixed(n % 1000 ? 1 : 0) + "k";
  return "R$ " + n;
}

export function saudacao(): string {
  const hr = parse(TODAY).getHours();
  return hr < 12 ? "Bom dia" : hr < 18 ? "Boa tarde" : "Boa noite";
}
