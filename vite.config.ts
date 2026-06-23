import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Em desenvolvimento, encaminha as rotas de arquivos para o servidor Node local
// (server/index.mjs, porta 8787) — rode `npm run serve` em paralelo ao `npm run dev`.
const FILE_SERVER = process.env.FILE_SERVER || "http://localhost:8787";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // expõe o dev server na rede local
    proxy: {
      "/api": { target: FILE_SERVER, changeOrigin: true },
      "/files": { target: FILE_SERVER, changeOrigin: true },
    },
  },
});
