import { useState } from "react";
import { useCrm, type LeadPatch } from "@/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORIGENS, PERFIL, SERVICOS, STATUS, TODAY } from "@/lib/crm/constants";
import type { Lead, NewLeadForm, StatusKey } from "@/lib/crm/types";

const PERFIS = Object.keys(PERFIL);

function emptyForm(): NewLeadForm {
  return {
    empresa: "",
    contato: "",
    cargo: "",
    telefone: "",
    whatsapp: "",
    email: "",
    site: "",
    cidade: "",
    origem: "Google Maps",
    servico: "Site Institucional",
    perfil: "Cliente Frio",
    status: "nao_contatado",
    valor: "",
    proximaAcao: "Fazer primeiro contato",
    dataProx: TODAY,
  };
}

function formFromLead(l: Lead): NewLeadForm {
  const clean = (v: string) => (v === "—" ? "" : v);
  return {
    empresa: l.empresa,
    contato: clean(l.contato),
    cargo: clean(l.cargo),
    telefone: clean(l.telefone),
    whatsapp: clean(l.whatsapp),
    email: clean(l.email),
    site: clean(l.site),
    cidade: clean(l.cidade),
    origem: l.origem,
    servico: l.servico,
    perfil: l.perfil,
    status: l.status,
    valor: l.valor != null ? String(l.valor) : "",
    proximaAcao: l.proximaAcao ?? "",
    dataProx: l.dataProx ?? "",
  };
}

export function LeadFormModal() {
  const { state, actions } = useCrm();
  const editing =
    state.editId != null
      ? state.leads.find((l) => l.id === state.editId) ?? null
      : null;
  const open = state.addOpen || editing != null;

  const close = () => (editing ? actions.closeEdit() : actions.closeAdd());

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent
        className="w-[540px] max-w-[calc(100vw-1.5rem)] gap-0 p-0"
        onInteractOutside={(event) => {
          // O dropdown do Select é renderizado num portal fora da árvore do
          // Dialog. Sem isto, clicar numa área do dropdown que não é um item
          // conta como "clique fora" e fecha o modal, perdendo os dados.
          const target = event.detail.originalEvent.target as HTMLElement | null;
          if (target?.closest("[data-radix-popper-content-wrapper]")) {
            event.preventDefault();
          }
        }}
      >
        {open && (
          <LeadForm
            key={editing ? `edit-${editing.id}` : "new"}
            editing={editing}
            onCancel={close}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function LeadForm({
  editing,
  onCancel,
}: {
  editing: Lead | null;
  onCancel: () => void;
}) {
  const { actions } = useCrm();
  const isEdit = editing != null;
  const [form, setForm] = useState<NewLeadForm>(() =>
    editing ? formFromLead(editing) : emptyForm(),
  );

  const set = <K extends keyof NewLeadForm>(k: K, v: NewLeadForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canSave = form.empresa.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    if (isEdit && editing) {
      const patch: LeadPatch = {
        empresa: form.empresa.trim(),
        contato: form.contato.trim() || "—",
        cargo: form.cargo.trim() || "—",
        telefone: form.telefone.trim() || "—",
        whatsapp: form.whatsapp.trim() || "—",
        email: form.email.trim() || "—",
        site: form.site.trim() || "—",
        cidade: form.cidade.trim() || "—",
        origem: form.origem,
        servico: form.servico,
        perfil: form.perfil,
        status: form.status,
        valor: form.valor ? Number(form.valor) : null,
        proximaAcao: form.proximaAcao.trim() || null,
        dataProx: form.dataProx || null,
      };
      actions.updateLead(editing.id, patch);
    } else {
      actions.saveAdd(form);
    }
  };

  return (
    <>
      <DialogHeader className="flex flex-row items-center border-b border-border px-4 py-5 sm:px-6">
        <DialogTitle>{isEdit ? "Editar lead" : "Novo lead"}</DialogTitle>
      </DialogHeader>

      <div className="grid max-h-[64vh] grid-cols-1 gap-3.5 overflow-y-auto px-4 py-[22px] sm:grid-cols-2 sm:px-6">
        <Field label="Empresa *" className="sm:col-span-2">
          <Input
            value={form.empresa}
            onChange={(e) => set("empresa", e.target.value)}
            placeholder="Nome da empresa"
            autoFocus
          />
        </Field>
        <Field label="Contato">
          <Input
            value={form.contato}
            onChange={(e) => set("contato", e.target.value)}
            placeholder="Nome do contato"
          />
        </Field>
        <Field label="Cargo">
          <Input
            value={form.cargo}
            onChange={(e) => set("cargo", e.target.value)}
            placeholder="Cargo"
          />
        </Field>
        <Field label="Telefone">
          <Input
            value={form.telefone}
            onChange={(e) => set("telefone", e.target.value)}
            placeholder="(11) 90000-0000"
          />
        </Field>
        <Field label="WhatsApp">
          <Input
            value={form.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            placeholder="(11) 90000-0000"
          />
        </Field>
        <Field label="E-mail">
          <Input
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="contato@empresa.com.br"
          />
        </Field>
        <Field label="Site">
          <Input
            value={form.site}
            onChange={(e) => set("site", e.target.value)}
            placeholder="www.empresa.com.br"
          />
        </Field>
        <Field label="Cidade">
          <Input
            value={form.cidade}
            onChange={(e) => set("cidade", e.target.value)}
            placeholder="Cidade"
          />
        </Field>
        <Field label="Valor estimado (R$)">
          <Input
            value={form.valor}
            onChange={(e) => set("valor", e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="10000"
            inputMode="numeric"
          />
        </Field>
        <Field label="Origem">
          <SelectField
            value={form.origem}
            onChange={(v) => set("origem", v)}
            options={ORIGENS}
          />
        </Field>
        <Field label="Serviço">
          <SelectField
            value={form.servico}
            onChange={(v) => set("servico", v)}
            options={SERVICOS}
          />
        </Field>
        <Field label="Perfil">
          <SelectField
            value={form.perfil}
            onChange={(v) => set("perfil", v)}
            options={PERFIS}
          />
        </Field>
        <Field label="Status">
          <Select
            value={form.status}
            onValueChange={(v) => set("status", v as StatusKey)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS.map((s) => (
                <SelectItem key={s.key} value={s.key}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Próxima ação">
          <Input
            value={form.proximaAcao}
            onChange={(e) => set("proximaAcao", e.target.value)}
            placeholder="Ligar novamente"
          />
        </Field>
        <Field label="Data da próxima ação">
          <Input
            type="date"
            value={form.dataProx}
            onChange={(e) => set("dataProx", e.target.value)}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-2.5 border-t border-border px-4 py-4 sm:px-6">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={save} disabled={!canSave}>
          {isEdit ? "Salvar alterações" : "Adicionar lead"}
        </Button>
      </div>
    </>
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className}>
      <span className="text-[11.5px] font-semibold text-[#6c6c7c]">{label}</span>
      <div className="mt-[5px]">{children}</div>
    </label>
  );
}
