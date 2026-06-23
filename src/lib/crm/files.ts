import type { Arquivo } from "./types";

export function extOf(name: string): string {
  const i = name.lastIndexOf(".");
  if (i < 0 || i === name.length - 1) return "FILE";
  return name.slice(i + 1).toUpperCase().slice(0, 4);
}

export function colorForExt(ext: string): string {
  const e = ext.toLowerCase();
  if (e === "pdf") return "#f43f5e";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "heic"].includes(e)) return "#10b981";
  if (["doc", "docx", "txt", "md", "rtf"].includes(e)) return "#3b82f6";
  if (["xls", "xlsx", "csv"].includes(e)) return "#059669";
  if (["ppt", "pptx", "key"].includes(e)) return "#f97316";
  if (["zip", "rar", "7z", "tar", "gz"].includes(e)) return "#f59e0b";
  return "#6d4aff";
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
  return (bytes / 1024 / 1024).toFixed(1).replace(".", ",") + " MB";
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const z = (n: number) => String(n).padStart(2, "0");
  return `${z(d.getDate())}/${z(d.getMonth() + 1)}/${d.getFullYear()}`;
}

async function errorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (data && typeof data.error === "string") return data.error;
  } catch {
    /* not JSON */
  }
  return fallback;
}

/** Uploads a single file to the local file server and returns its Arquivo metadata. */
export async function uploadFile(leadId: number, file: File): Promise<Arquivo> {
  let res: Response;
  try {
    res = await fetch(`/api/files/${leadId}`, {
      method: "POST",
      headers: {
        "x-file-name": encodeURIComponent(file.name),
        "content-type": file.type || "application/octet-stream",
      },
      body: file,
    });
  } catch {
    throw new Error("Servidor de arquivos indisponível. Rode `npm run serve`.");
  }
  if (!res.ok) throw new Error(await errorMessage(res, "Falha no upload"));

  const data = (await res.json()) as { id: string; url: string; uploadedAt: string };
  const ext = extOf(file.name);
  return {
    id: data.id,
    nome: file.name,
    ext,
    meta: `${formatSize(file.size)} · ${fmtDate(data.uploadedAt)}`,
    bg: colorForExt(ext),
    url: data.url,
  };
}

/** Deletes a file from the local file server. */
export async function deleteFile(leadId: number, id: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`/api/files/${leadId}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch {
    throw new Error("Servidor de arquivos indisponível.");
  }
  if (!res.ok && res.status !== 204) {
    throw new Error(await errorMessage(res, "Falha ao excluir o arquivo"));
  }
}
