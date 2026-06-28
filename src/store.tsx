import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { STATUS_BY_KEY, TODAY } from "@/lib/crm/constants";
import { seed } from "@/lib/crm/seed";
import { loadState, saveState } from "@/lib/crm/storage";
import type {
  Arquivo,
  DrawerTab,
  Lead,
  NewLeadForm,
  StatusKey,
  View,
} from "@/lib/crm/types";

interface State {
  view: View;
  leads: Lead[];
  search: string;
  activeTag: string | null;
  selectedId: number | null;
  drawerTab: DrawerTab;
  newTipo: string;
  draggingId: number | null;
  dragOverCol: StatusKey | null;
  done: Record<number, boolean>;
  addOpen: boolean;
  editId: number | null;
}

export type LeadPatch = Partial<Omit<Lead, "id" | "timeline" | "arquivos">>;

type Action =
  | { type: "setView"; view: View }
  | { type: "openLead"; id: number }
  | { type: "closeLead" }
  | { type: "setSearch"; value: string }
  | { type: "setActiveTag"; tag: string | null }
  | { type: "setDrawerTab"; tab: DrawerTab }
  | { type: "setNewTipo"; tipo: string }
  | { type: "setDragging"; id: number | null }
  | { type: "setDragOver"; col: StatusKey | null }
  | { type: "drop"; statusKey: StatusKey }
  | { type: "addInteraction"; id: number; tipo: string; text: string }
  | { type: "setNotes"; id: number; text: string }
  | { type: "changeStatus"; id: number; key: StatusKey }
  | { type: "toggleDone"; id: number }
  | { type: "openAdd" }
  | { type: "closeAdd" }
  | { type: "saveAdd"; form: NewLeadForm }
  | { type: "openEdit"; id: number }
  | { type: "closeEdit" }
  | { type: "updateLead"; id: number; patch: LeadPatch }
  | { type: "deleteLead"; id: number }
  | { type: "clearAll" }
  | { type: "loadSample" }
  | { type: "importLeads"; leads: Lead[] }
  | { type: "addArquivo"; id: number; arquivo: Arquivo }
  | { type: "removeArquivo"; id: number; arquivoId: string };

function initialView(): View {
  const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
  return hash === "kanban" || hash === "tarefas" ? hash : "dashboard";
}

function initialState(): State {
  const persisted = loadState();
  return {
    view: initialView(),
    // Começa do zero: sem dados de exemplo por padrão. Use o menu de dados
    // ("Carregar dados de exemplo") para popular com os leads fictícios.
    leads: persisted?.leads ?? [],
    search: "",
    activeTag: null,
    selectedId: null,
    drawerTab: "timeline",
    newTipo: "Ligação",
    draggingId: null,
    dragOverCol: null,
    done: persisted?.done ?? {},
    addOpen: false,
    editId: null,
  };
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "setView":
      return { ...s, view: a.view };
    case "openLead":
      return { ...s, selectedId: a.id, drawerTab: "timeline" };
    case "closeLead":
      return { ...s, selectedId: null };
    case "setSearch":
      return { ...s, search: a.value };
    case "setActiveTag":
      return { ...s, activeTag: a.tag };
    case "setDrawerTab":
      return { ...s, drawerTab: a.tab };
    case "setNewTipo":
      return { ...s, newTipo: a.tipo };
    case "setDragging":
      return { ...s, draggingId: a.id };
    case "setDragOver":
      return { ...s, dragOverCol: a.col };
    case "drop": {
      const id = s.draggingId;
      if (id == null) return { ...s, dragOverCol: null };
      const leads = s.leads.map((l) => {
        if (l.id !== id || l.status === a.statusKey) return l;
        const stLabel = STATUS_BY_KEY[a.statusKey].label;
        return {
          ...l,
          status: a.statusKey,
          parado: 0,
          timeline: [
            { tipo: "Observação", descricao: `Movido para "${stLabel}".`, data: TODAY },
            ...l.timeline,
          ],
        };
      });
      return { ...s, leads, draggingId: null, dragOverCol: null };
    }
    case "addInteraction": {
      const txt = a.text.trim();
      if (!txt) return s;
      return {
        ...s,
        leads: s.leads.map((l) =>
          l.id !== a.id
            ? l
            : {
                ...l,
                parado: 0,
                timeline: [
                  { tipo: a.tipo, descricao: txt, data: TODAY },
                  ...l.timeline,
                ],
              },
        ),
      };
    }
    case "setNotes":
      return {
        ...s,
        leads: s.leads.map((l) =>
          l.id !== a.id ? l : { ...l, observacoes: a.text },
        ),
      };
    case "changeStatus":
      return {
        ...s,
        leads: s.leads.map((l) => {
          if (l.id !== a.id || l.status === a.key) return l;
          const stLabel = STATUS_BY_KEY[a.key].label;
          return {
            ...l,
            status: a.key,
            parado: 0,
            timeline: [
              {
                tipo: "Observação",
                descricao: `Status alterado para "${stLabel}".`,
                data: TODAY,
              },
              ...l.timeline,
            ],
          };
        }),
      };
    case "toggleDone":
      return { ...s, done: { ...s.done, [a.id]: !s.done[a.id] } };
    case "openAdd":
      return { ...s, addOpen: true };
    case "closeAdd":
      return { ...s, addOpen: false };
    case "saveAdd": {
      const f = a.form;
      if (!f.empresa.trim()) return s;
      const id = Math.max(0, ...s.leads.map((l) => l.id)) + 1;
      const lead: Lead = {
        id,
        empresa: f.empresa.trim(),
        contato: f.contato.trim() || "—",
        cargo: f.cargo.trim() || "—",
        cidade: f.cidade.trim() || "—",
        origem: f.origem,
        servico: f.servico,
        perfil: f.perfil,
        status: f.status,
        valor: f.valor ? Number(f.valor) : null,
        proximaAcao: f.proximaAcao.trim() || null,
        dataProx: f.dataProx || null,
        parado: null,
        motivo: null,
        telefone: f.telefone.trim() || "—",
        whatsapp: f.whatsapp.trim() || "—",
        email: f.email.trim() || "—",
        site: f.site.trim() || "—",
        observacoes: "",
        timeline: [],
        arquivos: [],
      };
      return {
        ...s,
        leads: [lead, ...s.leads],
        addOpen: false,
        view: "kanban",
      };
    }
    case "openEdit":
      return { ...s, editId: a.id, addOpen: false };
    case "closeEdit":
      return { ...s, editId: null };
    case "updateLead":
      return {
        ...s,
        editId: null,
        leads: s.leads.map((l) => (l.id !== a.id ? l : { ...l, ...a.patch })),
      };
    case "deleteLead": {
      const done = { ...s.done };
      delete done[a.id];
      return {
        ...s,
        leads: s.leads.filter((l) => l.id !== a.id),
        done,
        selectedId: s.selectedId === a.id ? null : s.selectedId,
        editId: s.editId === a.id ? null : s.editId,
      };
    }
    case "clearAll":
      return {
        ...s,
        leads: [],
        done: {},
        selectedId: null,
        editId: null,
        addOpen: false,
        activeTag: null,
        search: "",
      };
    case "loadSample":
      return {
        ...s,
        leads: seed(),
        done: {},
        selectedId: null,
        editId: null,
        addOpen: false,
        activeTag: null,
        search: "",
      };
    case "importLeads":
      return { ...s, leads: [...a.leads, ...s.leads] };
    case "addArquivo":
      return {
        ...s,
        leads: s.leads.map((l) =>
          l.id !== a.id ? l : { ...l, arquivos: [a.arquivo, ...l.arquivos] },
        ),
      };
    case "removeArquivo":
      return {
        ...s,
        leads: s.leads.map((l) =>
          l.id !== a.id
            ? l
            : { ...l, arquivos: l.arquivos.filter((af) => af.id !== a.arquivoId) },
        ),
      };
    default:
      return s;
  }
}

interface CrmContextValue {
  state: State;
  selectedLead: Lead | null;
  actions: {
    setView: (view: View) => void;
    openLead: (id: number) => void;
    closeLead: () => void;
    setSearch: (value: string) => void;
    setActiveTag: (tag: string | null) => void;
    setDrawerTab: (tab: DrawerTab) => void;
    setNewTipo: (tipo: string) => void;
    setDragging: (id: number | null) => void;
    setDragOver: (col: StatusKey | null) => void;
    drop: (statusKey: StatusKey) => void;
    addInteraction: (id: number, tipo: string, text: string) => void;
    setNotes: (id: number, text: string) => void;
    changeStatus: (id: number, key: StatusKey) => void;
    toggleDone: (id: number) => void;
    openAdd: () => void;
    closeAdd: () => void;
    saveAdd: (form: NewLeadForm) => void;
    openEdit: (id: number) => void;
    closeEdit: () => void;
    updateLead: (id: number, patch: LeadPatch) => void;
    deleteLead: (id: number) => void;
    clearAll: () => void;
    loadSample: () => void;
    importLeads: (leads: Lead[]) => void;
    addArquivo: (id: number, arquivo: Arquivo) => void;
    removeArquivo: (id: number, arquivoId: string) => void;
  };
}

const CrmContext = createContext<CrmContextValue | null>(null);

export function CrmProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  // Persist the durable slice (leads + completed tasks) on every change.
  useEffect(() => {
    saveState({ leads: state.leads, done: state.done });
  }, [state.leads, state.done]);

  const value = useMemo<CrmContextValue>(() => {
    const selectedLead =
      state.leads.find((l) => l.id === state.selectedId) ?? null;
    return {
      state,
      selectedLead,
      actions: {
        setView: (view) => dispatch({ type: "setView", view }),
        openLead: (id) => dispatch({ type: "openLead", id }),
        closeLead: () => dispatch({ type: "closeLead" }),
        setSearch: (value) => dispatch({ type: "setSearch", value }),
        setActiveTag: (tag) => dispatch({ type: "setActiveTag", tag }),
        setDrawerTab: (tab) => dispatch({ type: "setDrawerTab", tab }),
        setNewTipo: (tipo) => dispatch({ type: "setNewTipo", tipo }),
        setDragging: (id) => dispatch({ type: "setDragging", id }),
        setDragOver: (col) => dispatch({ type: "setDragOver", col }),
        drop: (statusKey) => dispatch({ type: "drop", statusKey }),
        addInteraction: (id, tipo, text) =>
          dispatch({ type: "addInteraction", id, tipo, text }),
        setNotes: (id, text) => dispatch({ type: "setNotes", id, text }),
        changeStatus: (id, key) => dispatch({ type: "changeStatus", id, key }),
        toggleDone: (id) => dispatch({ type: "toggleDone", id }),
        openAdd: () => dispatch({ type: "openAdd" }),
        closeAdd: () => dispatch({ type: "closeAdd" }),
        saveAdd: (form) => dispatch({ type: "saveAdd", form }),
        openEdit: (id) => dispatch({ type: "openEdit", id }),
        closeEdit: () => dispatch({ type: "closeEdit" }),
        updateLead: (id, patch) => dispatch({ type: "updateLead", id, patch }),
        deleteLead: (id) => dispatch({ type: "deleteLead", id }),
    clearAll: () => dispatch({ type: "clearAll" }),
    loadSample: () => dispatch({ type: "loadSample" }),
    importLeads: (leads) => dispatch({ type: "importLeads", leads }),
    addArquivo: (id, arquivo) => dispatch({ type: "addArquivo", id, arquivo }),
        removeArquivo: (id, arquivoId) =>
          dispatch({ type: "removeArquivo", id, arquivoId }),
      },
    };
  }, [state]);

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCrm(): CrmContextValue {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm must be used within CrmProvider");
  return ctx;
}
