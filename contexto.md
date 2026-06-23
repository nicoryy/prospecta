# CRM Freelancer - Especificação Funcional

## Objetivo

Desenvolver um CRM pessoal voltado para prospecção ativa de clientes de desenvolvimento de software.

O sistema deve permitir organizar leads, registrar contatos, acompanhar negociações e garantir que nenhuma oportunidade seja esquecida.

O foco não é substituir CRMs corporativos, mas fornecer uma ferramenta simples e eficiente para uso individual.

---

# Princípios do Sistema

O CRM deve responder rapidamente às seguintes perguntas:

* Quem preciso contatar hoje?
* Quem está aguardando retorno?
* Quem possui reunião agendada?
* Quem recebeu proposta?
* Quem virou cliente?
* Quem rejeitou a proposta?
* Qual o valor potencial do meu pipeline?
* Qual foi minha última interação com cada empresa?

---

# Estrutura Geral

O sistema será composto por quatro módulos principais:

1. Dashboard
2. Kanban de Leads
3. Tarefas do Dia
4. Página Individual do Lead

---

# Dashboard

## Objetivo

Fornecer uma visão rápida da operação comercial.

## Indicadores (KPIs)

* Total de Leads
* Empresas Contatadas
* Empresas Aguardando Retorno
* Reuniões Agendadas
* Propostas Enviadas
* Contratos Fechados
* Oportunidades Perdidas
* Valor Potencial do Pipeline

### Exemplo

| Indicador          | Quantidade |
| ------------------ | ---------- |
| Leads              | 180        |
| Contatados         | 92         |
| Aguardando Retorno | 35         |
| Reuniões           | 8          |
| Propostas          | 4          |
| Fechados           | 2          |
| Perdidos           | 43         |

---

# Funil Comercial (Kanban)

## Objetivo

Visualizar rapidamente a situação de cada lead.

### Status

#### Não Contatado

Lead identificado mas sem nenhuma interação.

---

#### Primeiro Contato

Ligação, e-mail ou mensagem inicial realizada.

---

#### Aguardando Retorno

Cliente recebeu contato e ainda não respondeu ou pediu prazo para análise.

Exemplos:

* "Me envie uma apresentação."
* "Vou analisar."
* "Retorne semana que vem."

---

#### Reunião Agendada

Lead demonstrou interesse e existe uma reunião marcada.

---

#### Proposta Enviada

Orçamento ou proposta comercial encaminhada.

---

#### Negociação

Discussão sobre escopo, prazo ou valores.

---

#### Fechado

Cliente convertido.

---

#### Perdido

Oportunidade encerrada sem conversão.

O histórico permanece registrado.

---

# Cadastro de Lead

## Informações Básicas

### Empresa

* Nome da empresa
* Nome do contato principal
* Cargo
* Telefone
* WhatsApp
* E-mail
* Site
* Cidade

---

## Informações Comerciais

### Origem do Lead

* Google Maps
* Instagram
* LinkedIn
* Indicação
* Site próprio
* Outro

### Potencial

Classificação:

* Pequeno
* Médio
* Grande

Ou:

### Valor Estimado

Exemplos:

* R$ 3.000
* R$ 10.000
* R$ 50.000

---

# Histórico de Interações

## Objetivo

Registrar todas as ações realizadas.

Cada interação gera um registro permanente.

### Exemplo

23/06/2026 - Ligação realizada. Falou com recepcionista.

24/06/2026 - WhatsApp enviado.

26/06/2026 - Cliente respondeu demonstrando interesse.

28/06/2026 - Reunião agendada.

---

## Tipos de Interação

* Ligação
* WhatsApp
* E-mail
* Reunião
* Proposta enviada
* Follow-up
* Observação

---

# Gestão de Próximas Ações

## Objetivo

Garantir que nenhum lead seja esquecido.

Cada lead deve possuir:

### Próxima Ação

Exemplos:

* Ligar novamente
* Enviar proposta
* Enviar portfólio
* Cobrar retorno
* Agendar reunião
* Aguardar resposta

### Data da Próxima Ação

Exemplo:

30/06/2026

---

# Tela de Tarefas do Dia

## Objetivo

Funcionar como agenda comercial.

Exemplo:

* Ligar para Empresa X
* Retornar Empresa Y
* Enviar proposta para Empresa Z
* Cobrar retorno da Empresa W

A tela deve listar automaticamente todas as ações vencidas ou programadas para o dia atual.

---

# Sistema de Tags

## Objetivo

Permitir filtros rápidos.

### Exemplos

Serviços:

* Site Institucional
* Landing Page
* E-commerce
* Sistema Web
* Sistema Interno
* Aplicativo
* Automação

Perfil do Cliente:

* Cliente Quente
* Cliente Morno
* Cliente Frio
* Alto Potencial
* Pequeno Negócio
* Empresa Média

---

# Página do Lead

## Cabeçalho

Exibir:

* Nome da empresa
* Status atual
* Próxima ação
* Data da próxima ação
* Valor potencial

### Exemplo

Empresa: ABC Contabilidade

Status: Aguardando Retorno

Próxima ação: Ligar novamente

Data: 30/06/2026

---

## Timeline

Lista cronológica de todas as interações.

---

## Anotações

Campo livre para observações.

### Exemplo

* Possui site antigo.
* Reclamações sobre lentidão.
* Interesse em área do cliente.
* Deseja integração com WhatsApp.

---

## Arquivos

Permitir anexar:

* Propostas
* Contratos
* Escopos
* Apresentações
* PDFs
* Capturas de tela

---

# Gestão de Rejeições

## Objetivo

Entender padrões de perda.

### Motivos

* Sem orçamento
* Já possui fornecedor
* Sem interesse
* Momento inadequado
* Sem resposta
* Outro

---

## Estatísticas de Perda

Exemplo:

* 35% Sem orçamento
* 25% Sem interesse
* 20% Já possuem fornecedor
* 10% Sem resposta
* 10% Outros

---

# Relatórios

## Taxa de Conversão

Exemplo:

100 empresas encontradas

70 empresas contatadas

15 reuniões realizadas

5 propostas enviadas

2 contratos fechados

---

## Valor do Pipeline

### Negociações em aberto

R$ 18.000

### Propostas enviadas

R$ 25.000

### Total potencial

R$ 43.000

---

## Desempenho por Origem

Exemplo:

| Origem      | Clientes Fechados |
| ----------- | ----------------- |
| Google Maps | 3                 |
| Instagram   | 1                 |
| LinkedIn    | 2                 |
| Indicação   | 5                 |

Objetivo: identificar os canais mais rentáveis.

---

# Funcionalidades Inteligentes

## Resumo Diário

Ao acessar o sistema:

Você possui:

* 7 contatos para hoje
* 3 propostas aguardando retorno
* 2 reuniões amanhã

---

## Leads Parados

Alertar automaticamente:

"15 empresas estão sem interação há mais de 15 dias."

---

## Follow-up Automático

Listar clientes sem resposta há:

* 3 dias
* 7 dias
* 15 dias
* 30 dias

---

# Banco de Dados

## Tabela: leads

```sql
id
empresa
contato
cargo
telefone
whatsapp
email
site
cidade

origem
status

potencial
valor_estimado

proxima_acao
data_proxima_acao

observacoes

created_at
updated_at
```

## Tabela: interacoes

```sql
id
lead_id

tipo
descricao

data_interacao

created_at
```

## Tabela: tags

```sql
id
nome
```

## Tabela: lead_tags

```sql
lead_id
tag_id
```

## Tabela: anexos

```sql
id
lead_id

nome_arquivo
caminho

created_at
```

---

# MVP (Versão Inicial)

Para a primeira versão, implementar apenas:

### Dashboard

* KPIs
* Resumo do pipeline

### Leads

* Cadastro
* Edição
* Exclusão

### Kanban

* Movimentação de status

### Histórico

* Registro de interações

### Tarefas

* Próxima ação
* Agenda diária

### Relatórios Básicos

* Conversão
* Pipeline
* Motivos de perda

---

# Resultado Esperado

Ao final, o CRM deve funcionar como um centro operacional pessoal para prospecção comercial, permitindo:

* Organizar centenas de leads.
* Controlar follow-ups.
* Registrar histórico completo.
* Acompanhar negociações.
* Medir conversão.
* Evitar perda de oportunidades.
* Maximizar a eficiência da prospecção ativa.
