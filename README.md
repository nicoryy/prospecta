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
  anotações livres, arquivos e mudança de status.
- **Novo lead** — cadastro rápido via modal.

> Os dados são fictícios e residem em memória (sem backend). A "data de hoje"
> está fixada em `2026-06-23` para manter as datas relativas dos dados de exemplo
> coerentes — veja `src/lib/crm/constants.ts` (`TODAY`).

## Como rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento (http://localhost:5173)
npm run build    # type-check + build de produção
npm run preview  # serve o build de produção
```

Atalhos de navegação por hash: `#kanban`, `#tarefas` (padrão: dashboard).

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
  components/
    Sidebar.tsx            # navegação + mini-pipeline + perfil
    Topbar.tsx             # título, busca e "Novo lead"
    LeadDrawer.tsx         # painel lateral do lead
    AddLeadModal.tsx       # cadastro de lead
    views/
      Dashboard.tsx
      Kanban.tsx
      Tarefas.tsx
    ui/                    # primitivos shadcn/ui
```
