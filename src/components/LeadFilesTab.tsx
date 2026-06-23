import { useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { useCrm } from "@/store";
import { cn } from "@/lib/utils";
import { deleteFile, uploadFile } from "@/lib/crm/files";
import type { Arquivo } from "@/lib/crm/types";

export function LeadFilesTab({
  leadId,
  arquivos,
}: {
  leadId: number;
  arquivos: Arquivo[];
}) {
  const { actions } = useCrm();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    const list = Array.from(files);
    setUploading((n) => n + list.length);
    await Promise.all(
      list.map(async (file) => {
        try {
          const arquivo = await uploadFile(leadId, file);
          actions.addArquivo(leadId, arquivo);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Falha no upload");
        } finally {
          setUploading((n) => n - 1);
        }
      }),
    );
  };

  const remove = async (af: Arquivo) => {
    // Demo files have no server id; just drop them from state.
    if (af.id) {
      try {
        await deleteFile(leadId, af.id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao excluir");
        return;
      }
    }
    actions.removeArquivo(leadId, af.id);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "mb-[18px] w-full rounded-xl border-2 border-dashed p-[26px] text-center transition-colors",
          dragOver
            ? "border-brand bg-brand-soft"
            : "border-[#e0e0e8] hover:border-[#cfcfdb] hover:bg-[#fafafc]",
        )}
      >
        <div className="text-[13px] text-[#8c8c98]">
          Arraste arquivos aqui ou{" "}
          <span className="font-semibold text-brand">selecione</span>
        </div>
        <div className="mt-1 text-[11.5px] text-[#b0b0bc]">
          Propostas, contratos, escopos, PDFs, capturas
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error && (
        <div className="mb-3 rounded-lg border border-[#f3d4da] bg-[#fdeef0] px-3 py-2 text-[12px] text-[#e11d48]">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {uploading > 0 && (
          <div className="flex items-center gap-2.5 rounded-[10px] border border-border px-[13px] py-[11px] text-[12.5px] text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-brand" />
            Enviando {uploading} arquivo{uploading > 1 ? "s" : ""}…
          </div>
        )}

        {arquivos.map((af, i) => {
          const clickable = !!af.url;
          const Row = (
            <>
              <div
                className="flex h-[38px] w-8 flex-none items-end justify-center rounded-[5px] pb-[5px]"
                style={{ background: af.bg }}
              >
                <span className="text-[8px] font-bold tracking-[0.3px] text-white">
                  {af.ext}
                </span>
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="truncate text-[13px] font-semibold text-[#2c2c38]">
                  {af.nome}
                </div>
                <div className="text-[11px] text-[#9a9aa8]">{af.meta}</div>
              </div>
            </>
          );
          return (
            <div
              key={af.id || `demo-${i}`}
              className="flex items-center gap-[11px] rounded-[10px] border border-border px-[13px] py-[11px]"
            >
              {clickable ? (
                <a
                  href={af.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-w-0 flex-1 items-center gap-[11px] hover:opacity-80"
                >
                  {Row}
                </a>
              ) : (
                <div
                  className="flex min-w-0 flex-1 items-center gap-[11px]"
                  title="Arquivo de exemplo (sem download)"
                >
                  {Row}
                </div>
              )}
              <button
                onClick={() => remove(af)}
                className="flex h-7 w-7 flex-none items-center justify-center rounded-md text-[#9a9aa8] hover:bg-[#fdeef0] hover:text-[#e11d48]"
                aria-label={`Remover ${af.nome}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}

        {arquivos.length === 0 && uploading === 0 && (
          <div className="p-2 text-center text-[12.5px] text-[#a0a0ac]">
            Nenhum arquivo anexado.
          </div>
        )}
      </div>
    </>
  );
}
