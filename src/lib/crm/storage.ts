import type { Lead } from "./types";

/**
 * Storage schema version. Bump this when the persisted shape changes in a way
 * that should invalidate previously stored data (e.g. a deliberate reset).
 */
export const STORAGE_SCHEMA = 1;
const KEY = `prospecta:state:v${STORAGE_SCHEMA}`;

export interface PersistedState {
  leads: Lead[];
  done: Record<number, boolean>;
}

function available(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadState(): PersistedState | null {
  if (!available()) return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    if (!parsed || !Array.isArray(parsed.leads)) return null;
    return { leads: parsed.leads as Lead[], done: parsed.done ?? {} };
  } catch {
    return null;
  }
}

export function saveState(state: PersistedState): void {
  if (!available()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / serialization errors */
  }
}

export function clearStorage(): void {
  if (!available()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
