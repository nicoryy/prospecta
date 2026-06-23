import type { Arquivo, Lead, StatusKey, TimelineEvent } from "./types";
import { daysAgo, fmt } from "./date";

type Seq = [tipo: string, dias: number, descricao: string];

function timelineFor(status: string, parado: number): TimelineEvent[] {
  const seqs: Record<string, Seq[]> = {
    primeiro: [
      [
        "Ligação",
        parado,
        "Primeira ligação realizada. Falei com a recepcionista, deixei recado para retornarem.",
      ],
    ],
    aguardando: [
      [
        "Ligação",
        parado + 7,
        "Primeiro contato. Demonstrou abertura, pediu uma apresentação por e-mail.",
      ],
      ["E-mail", parado + 4, "Enviei apresentação e portfólio de projetos anteriores."],
      [
        "Follow-up",
        parado,
        "Cobrança no WhatsApp. Pediu prazo para analisar internamente.",
      ],
    ],
    reuniao: [
      ["Ligação", parado + 9, "Primeiro contato. Interesse em renovar a presença digital."],
      ["WhatsApp", parado + 4, "Troca de mensagens, alinhamos disponibilidade de agenda."],
      ["Reunião", parado, "Reunião agendada para apresentação da proposta."],
    ],
    proposta: [
      [
        "Ligação",
        parado + 14,
        "Primeiro contato. Cliente bastante receptivo desde o início.",
      ],
      ["Reunião", parado + 6, "Reunião realizada. Levantei requisitos e escopo do projeto."],
      [
        "Proposta",
        parado,
        "Proposta comercial enviada por e-mail com 3 opções de pacote.",
      ],
    ],
    negociacao: [
      ["Reunião", parado + 12, "Reunião de levantamento de escopo e expectativas."],
      ["Proposta", parado + 6, "Proposta enviada conforme escopo discutido."],
      [
        "Follow-up",
        parado,
        "Pediu ajuste de prazo e parcelamento. Em negociação final.",
      ],
    ],
    fechado: [
      ["Reunião", parado + 16, "Reunião de apresentação. Aprovou a abordagem proposta."],
      ["Proposta", parado + 8, "Proposta enviada e aprovada sem ressalvas."],
      ["Reunião", parado, "Contrato assinado. Projeto fechado e kickoff agendado."],
    ],
    perdido: [
      ["Ligação", parado + 18, "Primeiro contato realizado."],
      ["Proposta", parado + 9, "Proposta enviada para avaliação."],
      ["Observação", parado, "Oportunidade encerrada sem conversão."],
    ],
  };
  const seq = seqs[status] || [];
  return seq.map(([tipo, dias, descricao]) => ({ tipo, descricao, data: daysAgo(dias) }));
}

type Row = [
  empresa: string,
  contato: string,
  cargo: string,
  cidade: string,
  origem: string,
  slug: string,
  servico: string,
  perfil: string,
  status: StatusKey,
  valor: number,
  proximaAcao: string | null,
  dataProx: string | null,
  parado: number | null,
  motivo: string | null,
  obs: string,
];

const DATA: Row[] = [
  ["ABC Contabilidade","Marcos Pereira","Sócio-diretor","Belo Horizonte","Indicação","site institucional","Site Institucional","Empresa Média","aguardando",12000,"Ligar novamente","2026-06-23",6,null,"Possui site antigo, reclama de lentidão. Quer área do cliente e integração com WhatsApp."],
  ["Restaurante Sabor Mineiro","Cláudia Nunes","Proprietária","Belo Horizonte","Google Maps","cardapio","Landing Page","Pequeno Negócio","primeiro",4500,"Enviar portfólio","2026-06-23",2,null,"Quer cardápio digital com QR Code nas mesas."],
  ["Clínica OdontoVida","Dr. Henrique Salles","Diretor clínico","Campinas","Google Maps","agendamento","Sistema Web","Alto Potencial","reuniao",28000,"Confirmar reunião","2026-06-24",2,null,"Precisa de sistema de agendamento online integrado ao prontuário."],
  ["Padaria Pão Quente","José Ribeiro","Dono","São Paulo","Google Maps","site","Site Institucional","Pequeno Negócio","nao_contatado",3000,"Fazer primeiro contato","2026-06-23",null,null,""],
  ["Auto Peças Veloz","Renata Lima","Gerente","Curitiba","Instagram","catalogo","E-commerce","Empresa Média","proposta",35000,"Cobrar retorno da proposta","2026-06-22",5,null,"Catálogo online com integração de estoque. Avaliando 2 fornecedores."],
  ["Imobiliária Lar Ideal","Paulo Andrade","Corretor responsável","Goiânia","LinkedIn","portal","Sistema Web","Alto Potencial","negociacao",42000,"Enviar proposta ajustada","2026-06-23",3,null,"Portal de imóveis com filtros e integração de leads. Negociando parcelamento."],
  ["Academia Corpo em Forma","Fernanda Rocha","Gerente","São Paulo","Instagram","app","Aplicativo","Empresa Média","aguardando",26000,"Cobrar retorno","2026-06-26",9,null,"App de check-in e agendamento de aulas."],
  ["Pet Shop Amigo Fiel","Bruno Carvalho","Proprietário","Porto Alegre","Google Maps","site","Site Institucional","Pequeno Negócio","nao_contatado",4000,"Fazer primeiro contato",null,null,null,""],
  ["Advocacia Ramos & Associados","Dra. Beatriz Ramos","Sócia","Belo Horizonte","Indicação","site","Site Institucional","Empresa Média","primeiro",9000,"Cobrar retorno","2026-06-25",3,null,"Quer site sóbrio e profissional, com blog jurídico."],
  ["Construtora Alicerce","Eng. Tiago Moreira","Diretor","Campinas","LinkedIn","sistema","Sistema Interno","Alto Potencial","proposta",58000,"Cobrar retorno da proposta","2026-06-30",7,null,"Sistema interno de gestão de obras e medições."],
  ["Floricultura Bela Flor","Sandra Dias","Dona","Curitiba","Instagram","loja","E-commerce","Pequeno Negócio","aguardando",8000,"Ligar novamente","2026-06-22",16,null,"Loja online com entrega no mesmo dia."],
  ["Salão Studio Hair","Patrícia Gomes","Proprietária","São Paulo","Instagram","agendamento","Landing Page","Pequeno Negócio","nao_contatado",3500,"Fazer primeiro contato",null,null,null,""],
  ["Mercado São Jorge","Antônio Souza","Gerente","Goiânia","Google Maps","site","Site Institucional","Pequeno Negócio","perdido",5000,null,null,40,"Sem orçamento","Achou o investimento alto para o momento."],
  ["Transportadora RodoSul","Carlos Eduardo","Diretor operacional","Porto Alegre","LinkedIn","sistema","Sistema Interno","Alto Potencial","reuniao",50000,"Preparar reunião","2026-06-24",5,null,"Sistema de rastreamento e gestão de fretes."],
  ["Clínica Veterinária BichoSaúde","Dra. Marina Alves","Veterinária responsável","Campinas","Google Maps","agendamento","Sistema Web","Empresa Média","primeiro",18000,"Enviar portfólio","2026-06-23",1,null,"Agendamento e prontuário dos pacientes."],
  ["Loja ModaViva","Júlia Fernandes","Proprietária","São Paulo","Instagram","loja","E-commerce","Empresa Média","aguardando",22000,"Cobrar retorno","2026-06-19",22,null,"E-commerce de moda feminina. Parou de responder."],
  ["Consultório Dra. Helena Costa","Dra. Helena Costa","Médica","Curitiba","Indicação","site","Landing Page","Pequeno Negócio","fechado",7000,null,null,4,null,"Fechou pacote de landing page + agendamento. Excelente indicação."],
  ["Marmoraria Pedra Nobre","Roberto Teixeira","Dono","Goiânia","Google Maps","site","Site Institucional","Pequeno Negócio","nao_contatado",4500,"Fazer primeiro contato",null,null,null,""],
  ["Distribuidora Bebidas Já","Marcelo Pinto","Gerente comercial","São Paulo","LinkedIn","sistema","Sistema Interno","Alto Potencial","primeiro",38000,"Cobrar retorno","2026-06-26",3,null,"Sistema de pedidos para representantes."],
  ["Gráfica Express","Luciana Martins","Sócia","Belo Horizonte","Google Maps","site","Site Institucional","Pequeno Negócio","perdido",6000,null,null,35,"Já possui fornecedor","Já trabalha com outra agência."],
  ["Ótica Visão Clara","Eduardo Ramos","Proprietário","Campinas","Instagram","loja","E-commerce","Empresa Média","nao_contatado",16000,"Fazer primeiro contato",null,null,null,""],
  ["Pizzaria Forno a Lenha","Giovana Esposito","Dona","São Paulo","Google Maps","app","Aplicativo","Pequeno Negócio","negociacao",14000,"Revisar escopo","2026-06-23",2,null,"App próprio de delivery para fugir das taxas dos marketplaces."],
  ["Lavanderia CleanMax","Felipe Araújo","Gerente","Porto Alegre","Google Maps","site","Landing Page","Pequeno Negócio","nao_contatado",3500,"Fazer primeiro contato",null,null,null,""],
  ["Estúdio Pilates Equilíbrio","Camila Brito","Proprietária","Curitiba","Instagram","agendamento","Sistema Web","Pequeno Negócio","aguardando",11000,"Ligar novamente","2026-06-20",18,null,"Agendamento de aulas com controle de planos."],
  ["Material ObraFácil","Sérgio Mendes","Dono","Goiânia","Google Maps","loja","E-commerce","Empresa Média","primeiro",24000,"Enviar portfólio","2026-06-24",2,null,"Loja online de materiais de construção."],
  ["Cafeteria Grão Especial","Aline Castro","Proprietária","São Paulo","Instagram","site","Landing Page","Pequeno Negócio","nao_contatado",3000,"Fazer primeiro contato",null,null,null,""],
  ["Agência MundoTour","Rodrigo Faria","Diretor","Belo Horizonte","LinkedIn","site","Site Institucional","Empresa Média","reuniao",19000,"Confirmar reunião","2026-06-24",3,null,"Site com busca de pacotes e formulário de cotação."],
  ["Barbearia Navalha de Ouro","Diego Santana","Dono","Curitiba","Instagram","agendamento","Landing Page","Pequeno Negócio","perdido",3500,null,null,28,"Sem resposta","Não retornou após 3 tentativas."],
  ["Contabilidade Fiscal Pro","Cristina Lopes","Sócia-diretora","São Paulo","Indicação","sistema","Sistema Web","Alto Potencial","proposta",45000,"Cobrar retorno da proposta","2026-07-02",6,null,"Portal do cliente com upload de documentos e dashboards fiscais."],
  ["Hamburgueria Brasa Burger","Vinícius Prado","Sócio","Campinas","Google Maps","app","Aplicativo","Pequeno Negócio","fechado",15000,null,null,9,null,"Fechou app de delivery próprio. Pagamento em 3x."],
];

export function seed(): Lead[] {
  return DATA.map((r, i) => {
    const [
      empresa,
      contato,
      cargo,
      cidade,
      origem,
      slug,
      servico,
      perfil,
      status,
      valor,
      proximaAcao,
      dataProx,
      parado,
      motivo,
      obs,
    ] = r;

    const timeline = parado == null ? [] : timelineFor(status, parado);

    const arquivos: Arquivo[] = ["proposta", "negociacao", "fechado", "perdido"].includes(
      status,
    )
      ? [
          {
            id: "",
            nome: "Proposta_" + slug + ".pdf",
            ext: "PDF",
            meta: "1,2 MB · " + fmt(daysAgo((parado || 0) + 1)),
            bg: "#f43f5e",
            url: "",
          },
        ]
      : [];
    if (status === "fechado")
      arquivos.push({
        id: "",
        nome: "Contrato_" + slug + ".pdf",
        ext: "PDF",
        meta: "420 KB · " + fmt(daysAgo(parado || 0)),
        bg: "#10b981",
        url: "",
      });

    const cleanSlug = slug.replace(/[^a-z]/g, "");
    const tel =
      "(31) 9" +
      ((8000 + ((i * 37) % 9999)).toString().padStart(4, "0")) +
      "-" +
      ((1000 + ((i * 53) % 8999)).toString().padStart(4, "0"));

    return {
      id: i + 1,
      empresa,
      contato,
      cargo,
      cidade,
      origem,
      servico,
      perfil,
      status,
      valor,
      proximaAcao,
      dataProx,
      parado,
      motivo,
      telefone: tel,
      whatsapp: tel,
      email: "contato@" + cleanSlug + (i + 1) + ".com.br",
      site: "www." + cleanSlug + ".com.br",
      observacoes: obs,
      timeline,
      arquivos,
    } satisfies Lead;
  });
}
