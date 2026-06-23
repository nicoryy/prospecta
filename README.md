# Prospecta — CRM de prospecção

CRM pessoal voltado para **prospecção ativa** de clientes de desenvolvimento de
software. Organize leads, registre contatos, acompanhe negociações e garanta que
nenhuma oportunidade seja esquecida.

Interface baseada no design **Claude Design** (Prospecta · CRM Freelancer),
implementada em React com componentes [shadcn/ui](https://ui.shadcn.com).

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** com tokens de tema do design (roxo `#6d4aff`, IBM Plex Sans)
- **shadcn/ui** (Radix UI) — Button, Card, Input, Textarea, Select, Dialog, Badge
- **lucide-react** para ícones

## Funcionalidades (MVP)

- **Dashboard** — KPIs, valor potencial do pipeline, funil de conversão, motivos
  de perda, leads parados e desempenho por origem.
- **Funil de leads (Kanban)** — 8 etapas (Não Contatado → Fechado/Perdido),
  arraste e solte cards entre as colunas, filtros por serviço e perfil.
- **Tarefas do dia** — agenda comercial com ações atrasadas, do dia e follow-up
  automático (3/7/15/30 dias sem resposta).
- **Página do lead (drawer)** — timeline de interações, dados de contato,
  anotações livres, arquivos, mudança de status, **edição** e **exclusão**.
- **Novo lead** — cadastro rápido via modal.
- **Persistência local** — leads e tarefas concluídas são salvos no `localStorage`
  do navegador automaticamente.
- **Exportação CSV** — baixe todos os leads em um arquivo `.csv`.
- **Menu de dados** (⋮ na barra superior) — carregar dados de exemplo ou limpar
  tudo para começar do zero.
- **Responsivo** — em telas pequenas a barra lateral vira um menu deslizante
  (botão ☰) e o layout se adapta para celulares e tablets.

> O app **começa vazio** (sem leads). Use **Novo lead** ou o menu de dados →
> **Carregar dados de exemplo** para popular com os 30 leads fictícios.
>
> Os dados residem no navegador (sem backend), persistidos em `localStorage`
> (chave `prospecta:state:vN`). A "data de hoje" está fixada em `2026-06-23` para
> manter as datas relativas dos dados de exemplo coerentes — veja
> `src/lib/crm/constants.ts` (`TODAY`).

## Como rodar

### Uso na rede (recomendado) — um único comando

```bash
npm install
npm start        # faz o build e sobe o servidor local em http://localhost:8787
```

O `npm start` gera o build e inicia o **servidor de arquivos** (`server/index.mjs`,
Node puro, sem dependências). Ele serve o app e recebe os anexos, acessível por
qualquer aparelho da rede em `http://<ip-da-máquina>:8787` (o IP é exibido no
console ao iniciar). Porta configurável via `PORT`.

### Desenvolvimento (hot reload)

```bash
npm run serve    # terminal 1: servidor de arquivos (porta 8787)
npm run dev      # terminal 2: Vite com hot reload (porta 5173)
```

O Vite encaminha `/api` e `/files` para o servidor de arquivos, então os uploads
funcionam também em dev. Use `npm run dev` sozinho se não precisar de anexos.

Atalhos de navegação por hash: `#kanban`, `#tarefas` (padrão: dashboard).

## Anexos (pasta FILES/)

Os arquivos anexados aos leads são gravados em `FILES/<id-do-lead>/` pelo servidor
local — **sem backend na nuvem, sem custo**. Os metadados (nome, tamanho, link)
ficam junto do lead no `localStorage`; os bytes ficam em disco em `FILES/`. O
conteúdo de `FILES/` é ignorado pelo git. Limite por arquivo: 50 MB (`MAX_UPLOAD_MB`).

## Estrutura

```
src/
  main.tsx                 # entrada; envolve App no CrmProvider
  App.tsx                  # layout (sidebar + topbar + view ativa)
  store.tsx                # estado global (useReducer + Context) e ações
  index.css                # tema Tailwind / variáveis shadcn
  lib/
    utils.ts               # cn()
    crm/
      types.ts             # tipos (Lead, StatusKey, ...)
      constants.ts         # STATUS, TIPOS, PERFIL, ORIGENS, SERVICOS, TODAY
      date.ts              # helpers de data e formatação (R$)
      seed.ts              # dados de exemplo + timelines
      derive.ts            # seletores puros (KPIs, funil, kanban, tarefas...)
      storage.ts           # persistência em localStorage
      csv.ts               # exportação CSV
      files.ts             # cliente de upload/exclusão de anexos
  components/
    Sidebar.tsx            # navegação + mini-pipeline + perfil
    Topbar.tsx             # título, busca, exportar, menu de dados, "Novo lead"
    LeadDrawer.tsx         # painel lateral do lead
    LeadFormModal.tsx      # cadastro/edição de lead
    LeadFilesTab.tsx       # upload e listagem de anexos
    EmptyState.tsx         # tela inicial sem leads
    views/
      Dashboard.tsx
      Kanban.tsx
      Tarefas.tsx
    ui/                    # primitivos shadcn/ui
server/
  index.mjs                # servidor local (estático + API de anexos em FILES/)
FILES/                     # anexos gravados em disco (ignorado pelo git)
```
