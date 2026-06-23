import { useState } from "react";
import { useCrm } from "@/store";
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
import { ORIGENS, SERVICOS } from "@/lib/crm/constants";
import type { NewLeadForm } from "@/lib/crm/types";

const EMPTY_FORM: NewLeadForm = {
  empresa: "",
  contato: "",
  telefone: "",
  cidade: "",
  valor: "",
  origem: "Google Maps",
  servico: "Site Institucional",
};

export function AddLeadModal() {
  const { state, actions } = useCrm();
  const [form, setForm] = useState<NewLeadForm>(EMPTY_FORM);

  const set = <K extends keyof NewLeadForm>(k: K, v: NewLeadForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const close = () => {
    actions.closeAdd();
    setForm(EMPTY_FORM);
  };

  const save = () => {
    if (!form.empresa.trim()) return;
    actions.saveAdd(form);
    setForm(EMPTY_FORM);
  };

  const canSave = form.empresa.trim().length > 0;

  return (
    <Dialog open={state.addOpen} onOpenChange={(o) => !o && close()}>
      <DialogContent className="w-[520px] max-w-full gap-0 p-0">
        <DialogHeader className="flex flex-row items-center border-b border-border px-6 py-5">
          <DialogTitle>Novo lead</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3.5 px-6 py-[22px]">
          <Field label="Empresa *" className="col-span-2">
            <Input
              value={form.empresa}
              onChange={(e) => set("empresa", e.target.value)}
              placeholder="Nome da empresa"
            />
          </Field>
          <Field label="Contato">
            <Input
              value={form.contato}
              onChange={(e) => set("contato", e.target.value)}
              placeholder="Nome do contato"
            />
          </Field>
          <Field label="Telefone">
            <Input
              value={form.telefone}
              onChange={(e) => set("telefone", e.target.value)}
              placeholder="(11) 90000-0000"
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
            <Select value={form.origem} onValueChange={(v) => set("origem", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORIGENS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Serviço">
            <Select value={form.servico} onValueChange={(v) => set("servico", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVICOS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="flex justify-end gap-2.5 px-6 pb-[22px]">
          <Button variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button onClick={save} disabled={!canSave}>
            Adicionar lead
          </Button>
        </div>
      </DialogContent>
    </Dialog>
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
