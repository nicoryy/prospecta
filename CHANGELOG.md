# Changelog

Todas as mudanças notáveis deste projeto são documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/)
(`MAJOR.MINOR.PATCH`):

- **MAJOR** — mudanças incompatíveis (quebra de comportamento/dados).
- **MINOR** — novas funcionalidades retrocompatíveis.
- **PATCH** — correções retrocompatíveis e ajustes menores.

## [1.0.0] - 2026-06-23

### Adicionado

- Aplicação base do **Prospecta** (CRM de prospecção) em Vite + React + TypeScript
  + Tailwind + shadcn/ui, portada do design Claude Design (`CRM Freelancer.dc.html`).
- **Dashboard**: KPIs, valor potencial do pipeline, funil de conversão, motivos de
  perda, leads parados e desempenho por origem.
- **Funil de leads (Kanban)**: 8 etapas com arraste e solte e filtros por
  serviço/perfil.
- **Tarefas do dia**: ações atrasadas, do dia e follow-up automático.
- **Drawer do lead**: timeline de interações, dados de contato, anotações,
  arquivos e mudança de status.
- **Novo lead** via modal.
- Dados de exemplo (30 leads) em memória; "hoje" fixado em `2026-06-23`.

[1.0.0]: https://semver.org/
