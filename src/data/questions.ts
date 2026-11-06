import { QuestionDefinition, BusinessSegment } from '../types/diagnosis';

export interface PillarMeta {
  id: string;
  name: string;
  code: string;
  description: string;
}

export const PILLARS_META: Record<string, PillarMeta> = {
  pilar1: {
    id: 'pilar1',
    code: 'P1',
    name: 'Receita, Clientes e Vendas',
    description: 'Capacidade de atrair clientes, conduzir oportunidades, fechar vendas e medir resultados comerciais.',
  },
  pilar2: {
    id: 'pilar2',
    code: 'P2',
    name: 'Presença Digital e Mercado',
    description: 'Visibilidade nos canais digitais, comunicação no WhatsApp, consistência da marca e atração online.',
  },
  pilar3: {
    id: 'pilar3',
    code: 'P3',
    name: 'Finanças e Resiliência',
    description: 'Separação e controle de caixa, margem, formação de preços, capital de giro e sustentabilidade.',
  },
  pilar4: {
    id: 'pilar4',
    code: 'P4',
    name: 'Operações, Processos e Tecnologia',
    description: 'Estruturação dos processos do dia a dia, ferramentas operacionais, produtividade e segurança.',
  },
  pilar5: {
    id: 'pilar5',
    code: 'P5',
    name: 'Estratégia, Pessoas e Crescimento',
    description: 'Definição de metas claras, capacitação da equipe, capacidade de melhoria e uso responsável da tecnologia.',
  },
};

export const CORE_QUESTIONS: QuestionDefinition[] = [
  // --- PILAR 1: RECEITA, CLIENTES E VENDAS ---
  {
    id: 'P1.1',
    pillarId: 'pilar1',
    title: 'Clareza de cliente e oferta',
    description: 'A empresa sabe qual cliente deseja atender e qual problema resolve?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Não há definição de público-alvo ou a oferta é totalmente genérica.',
        example: 'Ex.: Vende para "todo mundo" sem saber quem realmente compra ou valoriza a solução.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Existe uma noção na cabeça dos sócios, mas não é formalizada nem compartilhada com a equipe.',
        example: 'Ex.: Os sócios sabem o cliente ideal por intuição, mas novos atendentes não recebem essa orientação.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Existe um perfil inicial traçado, porém a oferta ainda é ampla e pouco diferenciada.',
        example: 'Ex.: Tem ideia dos clientes prioritários, mas aceita qualquer pedido mesmo fora do foco.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Público-alvo e proposta de valor definidos, comunicados à equipe e refletidos no atendimento.',
        example: 'Ex.: Toda a equipe sabe para quem a empresa vende, seus diferenciais e dores que soluciona.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Público segmentado, proposta validada com clientes e revisada periodicamente com base em dados.',
        example: 'Ex.: Realiza pesquisas de satisfação e ajusta ofertas por perfil de comprador recorrente.',
      },
    ],
  },
  {
    id: 'P1.2',
    pillarId: 'pilar1',
    title: 'Geração de oportunidades',
    description: 'A empresa possui canais definidos para gerar oportunidades de negócio (indicação, Google, redes, parcerias, prospecção)?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'A empresa apenas espera clientes entrarem ou ligarem por acaso.',
        example: 'Ex.: Nenhuma ação ativa de atração; receita oscila sem saber a origem dos contatos.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Depende quase que exclusivamente de indicações esporádicas ou boca a boca não estimulado.',
        example: 'Ex.: Quando as vendas caem, posta algo rápido no WhatsApp sem planejamento.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Possui 1 ou 2 canais funcionando de forma irregular (ex.: perfil no Instagram e placa física).',
        example: 'Ex.: Posta nas redes sociais algumas vezes por mês, mas sem rotina de captação contínua.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Canais ativos e regulares (Google, parcerias locais, campanhas ou prospecção ativa estruturada).',
        example: 'Ex.: Campanhas ou rotinas de indicação semanais gerando fluxo previsível de orçamentos.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Diversificação de canais, monitoramento do custo por lead e otimização contínua de onde vêm os contatos.',
        example: 'Ex.: Acompanha taxa de retorno de cada canal e redireciona orçamento para os mais eficientes.',
      },
    ],
  },
  {
    id: 'P1.3',
    pillarId: 'pilar1',
    title: 'Acompanhamento do funil de vendas',
    description: 'A empresa acompanha os contatos desde o primeiro interesse até a venda?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Contatos são esquecidos; não se sabe quantos orçamentos foram passados.',
        example: 'Ex.: Cliente pede preço pelo WhatsApp e se não fechar na hora, o contato se perde.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Anotações em papel, cadernos soltos ou memória individual de quem atendeu.',
        example: 'Ex.: Vendedor anota pedidos no bloco de notas sem controle centralizado.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Planilha ou etiquetas no WhatsApp usadas de forma inconstante.',
        example: 'Ex.: Alguns contatos são etiquetados, mas outros ficam sem registro por falta de tempo.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Etapas de venda claras (novo lead -> orçamento -> negociação -> fechamento) acompanhadas com rotina.',
        example: 'Ex.: Quadro Kanban ou CRM simples onde toda a equipe visualiza o status de cada proposta.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'CRM integrado com controle de tempo em cada etapa, motivos de perda e taxa de conversão.',
        example: 'Ex.: Reunião semanal de fechamento analisando onde clientes travam e aplicando melhorias.',
      },
    ],
  },
  {
    id: 'P1.4',
    pillarId: 'pilar1',
    title: 'Resposta rápida e rotina de follow-up',
    description: 'A empresa possui rotina para responder, acompanhar propostas e recuperar oportunidades não concluídas?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Demora dias para responder orçamentos ou nunca volta a falar com quem não comprou.',
        example: 'Ex.: "Se o cliente tiver interesse, ele liga de volta".',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Responde rápido quando dá tempo, e o acompanhamento depende de lembrar de cabeça.',
        example: 'Ex.: Faz contato de novo apenas quando a meta do mês está muito longe.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Existe um prazo padrão de resposta, mas o follow-up de propostas abertas é irregular.',
        example: 'Ex.: Envia orçamento no mesmo dia, mas raramente faz a segunda ou terceira abordagem.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Rotina definida de follow-up (ex.: contato após 24h, 3 dias e 7 dias para proposta pendente).',
        example: 'Ex.: Protocolo claro de atendimento e reativação de orçamentos com mensagens padronizadas.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Automação de lembretes, metas de tempo de primeira resposta (<15 min) e recuperação ativa.',
        example: 'Ex.: Tempo médio de resposta medido e bonificação ligada à disciplina de follow-up.',
      },
    ],
  },
  {
    id: 'P1.5',
    pillarId: 'pilar1',
    title: 'Indicadores comerciais',
    description: 'A empresa acompanha vendas, taxa de conversão, ticket médio, recompra ou retenção de clientes?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Apenas sabe se o dinheiro entrou na conta no fim do mês.',
        example: 'Ex.: Desconhece quantos orçamentos foram enviados ou o valor médio das compras.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Sabe o faturamento total aproximado, mas não analisa conversão ou ticket médio.',
        example: 'Ex.: "O faturamento foi bom, mas não sei quantos clientes vieram nem o ticket".',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Acompanha o volume vendido mensalmente, mas sem cruzar com metas ou recompra.',
        example: 'Ex.: Registra vendas no sistema, mas não calcula taxa de conversão de propostas.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Monitora mensalmente ticket médio, taxa de conversão, faturamento por produto e clientes ativos.',
        example: 'Ex.: Relatório mensal consolidado com metas de vendas comparadas ao realizado.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Dashboard com métricas de retenção (LTV, churn ou recompra) e planos corretivos imediatos.',
        example: 'Ex.: Reunião quinzenal com metas comerciais desdobradas por vendedor e linha de produto.',
      },
    ],
  },

  // --- PILAR 2: PRESENÇA DIGITAL E MERCADO ---
  {
    id: 'P2.1',
    pillarId: 'pilar2',
    title: 'Google Perfil da Empresa (Google Meu Negócio)',
    description: 'A empresa possui um Google Perfil da Empresa atualizado e acompanha avaliações e informações publicadas?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Não possui perfil cadastrado ou não tem acesso à administração da ficha no Google.',
        example: 'Ex.: Quando alguém pesquisa a empresa no Google Mapas, não encontra ou os dados estão errados.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Perfil existe, mas fotos e horários estão desatualizados e avaliações nunca são respondidas.',
        example: 'Ex.: Criou há anos e nunca mais mexeu; número de telefone antigo ainda exibido.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Informações corretas, porém sem postagens periódicas e com poucas respostas a comentários.',
        example: 'Ex.: Telefone e endereço certos, mas sem fotos recentes nem solicitação de novas avaliações.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Ficha completa, fotos profissionais, horários atualizados e rotina de solicitar avaliações a clientes.',
        example: 'Ex.: Responde a todas as avaliações em até 48 horas e atualiza produtos/serviços no Google.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Acompanha métricas de visualizações, ligações e rotas geradas pelo Google com otimização contínua de SEO local.',
        example: 'Ex.: Analisa relatórios mensais do Google para entender termos mais buscados na microrregião.',
      },
    ],
  },
  {
    id: 'P2.2',
    pillarId: 'pilar2',
    title: 'WhatsApp Business estruturado',
    description: 'O WhatsApp Business está organizado para atendimento e conversão (catálogo, horário, respostas rápidas, etiquetas)?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Usa WhatsApp pessoal comum sem recursos empresariais.',
        example: 'Ex.: Foto de perfil pessoal, sem catálogo e sem separação de mensagens profissionais.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Usa versão Business, mas só configurou o nome e foto; não usa etiquetas nem mensagens automáticas.',
        example: 'Ex.: Mensagens de clientes se misturam e ficam sem resposta fora do horário comercial.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Possui mensagem de saudação/ausência e horário configurado, mas sem catálogo ou etiquetas ativas.',
        example: 'Ex.: Tem resposta automática, mas catálogo de preços ou serviços está vazio.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Catálogo atualizado, respostas rápidas para dúvidas frequentes, etiquetas de clientes e links diretos.',
        example: 'Ex.: Atendente usa atalhos (/preço, /pix, /endereço) e categoriza conversas em "Orçamento", "Pago", "Entregue".',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Múltiplos atendentes em plataforma centralizada ou chatbot com triagem inteligente e histórico unificado.',
        example: 'Ex.: Sistema multiatendimento no mesmo número oficial com métricas de tempo de espera.',
      },
    ],
  },
  {
    id: 'P2.3',
    pillarId: 'pilar2',
    title: 'Consistência dos canais digitais',
    description: 'As informações da empresa (endereço, telefone, horário, oferta) são consistentes entre Google, redes sociais, site e catálogo?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Canais divergentes gerando confusão e perda de clientes.',
        example: 'Ex.: No Instagram tem um telefone, no Google outro, e o horário de funcionamento não bate.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Apenas atualiza quando algum cliente reclama de informação errada.',
        example: 'Ex.: Mudou de endereço há 3 meses mas a bio da rede social ainda tem o antigo.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Principais canais alinhados, mas ofertas e links secundários desatualizados.',
        example: 'Ex.: Endereço e telefone certos, mas o link da bio vai para página fora do ar.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Informações, identidade visual e propostas de valor perfeitamente padronizadas em todos os pontos de contato.',
        example: 'Ex.: Mesma identidade visual, cardápio/catálogo atualizado e dados institucionais idênticos em todas as redes.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Manual de marca digital, checklist periódico de auditoria de canais e domínio próprio verificado.',
        example: 'Ex.: Auditoria trimestral de links e canais para garantir experiência sem fricção ao cliente.',
      },
    ],
  },
  {
    id: 'P2.4',
    pillarId: 'pilar2',
    title: 'Conteúdo e campanhas com objetivo',
    description: 'A empresa realiza conteúdos ou campanhas com objetivo definido, público, oferta e chamada para ação (CTA)?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Nenhuma publicação ou anúncio.',
        example: 'Ex.: Redes sociais abandonadas há meses.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Posta apenas fotos aleatórias de "bom dia" ou produtos sem objetivo nem link para comprar.',
        example: 'Ex.: Posta no Instagram quando dá na telha, sem legenda clara nem chamado para ação.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Postagens frequentes, mas focadas somente em likes e sem transformar seguidores em contatos comerciais.',
        example: 'Ex.: Vídeos que têm visualizações, mas não geram chamadas no WhatsApp.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Linhas editoriais claras (educação, produto, prova social) com chamada clara para orçamento ou visita.',
        example: 'Ex.: Calendário de posts semanais com campanhas pontuais em datas comemorativas e anúncios locais direcionados.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Gestão de tráfego pago regional com teste A/B, métricas de retorno sobre investimento publicitário (ROAS) e atração contínua.',
        example: 'Ex.: Investimento regular no Meta/Google Ads acompanhando custo por mensagem recebida no WhatsApp.',
      },
    ],
  },
  {
    id: 'P2.5',
    pillarId: 'pilar2',
    title: 'Mensuração da conversão digital',
    description: 'A empresa sabe exatamente quais canais digitais geram mais contatos, orçamentos ou vendas fechadas?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Não faz ideia de onde vêm os clientes que chegam pelo digital.',
        example: 'Ex.: Não pergunta para o cliente onde ele conheceu a empresa.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Pergunta de vez em quando na conversa, mas não anota nem consolida.',
        example: 'Ex.: Lembra que alguém disse ter visto no Instagram, mas sem dados concretos.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Campo "como nos conheceu" no cadastro, mas pouco preenchido ou analisado.',
        example: 'Ex.: Coleta a informação na comanda ou cadastro mas nunca gerou um relatório disso.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Rastreamento claro: links com parâmetros (UTMs), formulários e registro sistemático da origem do cliente.',
        example: 'Ex.: Sabe exatamente que 40% das vendas vieram do Google Maps e 35% do Instagram.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Dashboard de atribuição de canais e cálculo do Custo de Aquisição de Clientes (CAC) por canal.',
        example: 'Ex.: Reunião mensal decidindo alocação de verba com base nos canais de maior taxa de conversão.',
      },
    ],
  },

  // --- PILAR 3: FINANÇAS E RESILIÊNCIA ---
  {
    id: 'P3.1',
    pillarId: 'pilar3',
    title: 'Separação e registro de movimentações',
    description: 'A empresa separa rigorosamente as finanças pessoais das empresariais e registra todas as entradas e saídas?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Conta bancária pessoal e empresarial misturadas; contas da casa pagas com dinheiro da empresa.',
        example: 'Ex.: Usa a mesma conta PJ para fazer compras de supermercado da família e pagar fornecedores.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Possui conta PJ, mas ainda ocorrem saques e transferências pessoais sem registro nem pró-labore fixo.',
        example: 'Ex.: Retira dinheiro do caixa conforme surge necessidade pessoal sem registrar.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Contas bancárias separadas, mas registros manuais incompletos e atrasados.',
        example: 'Ex.: Anota a maior parte das despesas no caderno, mas pequenas saídas se perdem.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Contas bancárias 100% separadas, pró-labore fixado para sócios e conciliação bancária semanal em sistema ou planilha.',
        example: 'Ex.: Todos os comprovantes arquivados, registro diário de entradas/saídas e retiradas sócias programadas.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Plano de contas estruturado, DRE mensal, conciliação diária e auditoria periódica com a contabilidade.',
        example: 'Ex.: Fechamento mensal formal analisando Demonstrativo de Resultados do Exercício (DRE).',
      },
    ],
  },
  {
    id: 'P3.2',
    pillarId: 'pilar3',
    title: 'Fluxo de caixa projetado',
    description: 'A empresa possui fluxo de caixa projetado (previsão futura) e compara o previsto com o realizado?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Não sabe se terá dinheiro para pagar contas da próxima semana ou mês.',
        example: 'Ex.: Descobre que falta dinheiro apenas quando o boleto vence ou o cheque bate.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Faz contas de cabeça para os próximos dias com base nas contas na gaveta.',
        example: 'Ex.: Olha o saldo no aplicativo do banco todo dia e torce para entrar vendas suficientes.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Acompanha contas a pagar e receber da semana, mas sem projeção para 30, 60 ou 90 dias.',
        example: 'Ex.: Planilha simples de contas do mês corrente, sem visão do mês seguinte.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Fluxo de caixa projetado para pelo menos 60 a 90 dias, atualizado semanalmente.',
        example: 'Ex.: Sabe antecipadamente quando haverá sobras ou apertos de caixa e se planeja.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Simulações de cenários (otimista, realista, pessimista), análise de desvios e reserva de emergência constituída.',
        example: 'Ex.: Reserva de contingência equivalente a 3 a 6 meses de custos fixos mantida em aplicação líquida.',
      },
    ],
  },
  {
    id: 'P3.3',
    pillarId: 'pilar3',
    title: 'Margem de lucro e formação de preço',
    description: 'A empresa conhece sua margem real, utiliza critérios técnicos para formar preços e sabe qual é seu ponto de equilíbrio?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Preço definido apenas copiando concorrentes ou no "chute".',
        example: 'Ex.: Vende com prejuízo sem perceber porque esquece de impostos, taxas de cartão e custos fixos.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Multiplica o custo por 2 (mark-up simples) sem considerar taxas de cartão, impostos ou despesas operacionais.',
        example: 'Ex.: Compra por R$ 10 e vende por R$ 20, mas no fim do mês falta dinheiro.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Considera custos diretos e taxas, mas desconhece a margem líquida real e o ponto de equilíbrio em reais.',
        example: 'Ex.: Sabe a margem bruta de alguns produtos, mas não sabe quanto precisa faturar para cobrir a estrutura.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Fórmula de precificação considerando custos fixos, variáveis, impostos, taxas e margem líquida desejada, com ponto de equilíbrio calculado.',
        example: 'Ex.: Planilha de precificação com ponto de equilíbrio bem definido (ex.: precisa faturar R$ 42 mil/mês para zerar custos).',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Análise de margem de contribuição por produto/serviço, curva ABC de lucratividade e política dinâmica de descontos.',
        example: 'Ex.: Deixa de vender produtos de baixa margem e foca em mix de alta rentabilidade.',
      },
    ],
  },
  {
    id: 'P3.4',
    pillarId: 'pilar3',
    title: 'Contas a receber, pagar e capital de giro',
    description: 'A empresa controla contas a receber, a pagar, inadimplência, prazos médios e necessidade de capital de giro?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Sem controle de cobranças; clientes em atraso não são cobrados sistematicamente.',
        example: 'Ex.: Carnês ou fiados esquecidos; paga juros frequentes por atraso em boletos.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Controla em cadernos ou memória; cobra clientes apenas quando falta dinheiro no caixa.',
        example: 'Ex.: Cobra quem deve somente quando precisa pagar a folha no dia seguinte.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Controla recebimentos e pagamentos, mas sofre com descasamento de prazos (paga fornecedor antes de receber do cliente).',
        example: 'Ex.: Vende em 6x no cartão e compra insumo à vista, ficando sem capital de giro.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Rotina formal de régua de cobrança, conciliação de maquininhas de cartão e controle de prazos médios de pagamento e recebimento.',
        example: 'Ex.: Mensagem cordial antes do vencimento, renegociação padrão e alinhamento de prazos.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Cálculo contínuo da Necessidade de Capital de Giro (NCG) e taxa de inadimplência mantida abaixo da meta histórica.',
        example: 'Ex.: Gestão otimizada de ciclo financeiro permitindo operar com capital próprio sem depender de cheque especial.',
      },
    ],
  },
  {
    id: 'P3.5',
    pillarId: 'pilar3',
    title: 'Decisão financeira e sustentabilidade',
    description: 'A empresa acompanha indicadores financeiros e avalia capacidade real antes de assumir dívidas, investimentos ou expansão?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Pega empréstimos ou compra máquinas por impulso sem avaliar o impacto no caixa.',
        example: 'Ex.: Contrata crédito emergencial caro para cobrir despesas operacionais correntes.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Avalia apenas se "a parcela cabe no bolso no primeiro mês".',
        example: 'Ex.: Assume financiamento sem projetar se os meses fracos do ano suportarão a parcela.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Consulta o contador ou calcula retorno superficial antes de investir.',
        example: 'Ex.: Pensa no retorno, mas não mede índice de endividamento da empresa.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Critérios claros para novos investimentos: taxa de retorno, prazo de retorno (payback) e impacto na liquidez.',
        example: 'Ex.: Avalia pelo menos 3 cotações e projeta se o novo equipamento se paga com a demanda existente.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Planejamento de orçamento anual (Capex e Opex), análise de viabilidade econômico-financeira e estrutura de capital equilibrada.',
        example: 'Ex.: Decisões baseadas em indicadores sólidos com proteção de liquidez da empresa.',
      },
    ],
  },

  // --- PILAR 4: OPERAÇÕES, PROCESSOS E TECNOLOGIA ---
  {
    id: 'P4.1',
    pillarId: 'pilar4',
    title: 'Processos críticos mapeados e responsáveis',
    description: 'Os processos mais importantes da empresa estão definidos, documentados e possuem responsáveis claros?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Cada colaborador faz do seu jeito; se o dono não estiver presente, a empresa trava.',
        example: 'Ex.: Quando o responsável falta, ninguém sabe como atender o cliente ou entregar o serviço.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Instruções apenas verbais transmitidas no calor do momento.',
        example: 'Ex.: Treina novo funcionário dizendo "olha como eu faço e repete".',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Existem anotações ou listas de tarefas (checklists), mas nem sempre são seguidas.',
        example: 'Ex.: Tem lista de abertura e fechamento de loja, mas muitos dias fica esquecida.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Procedimentos operacionais padrão (POPs) ou rotinas documentadas com responsáveis por cada etapa.',
        example: 'Ex.: Manuais práticos em vídeo ou documento para atendimento, produção, entrega e suporte.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Cultura de melhoria contínua dos processos com auditorias de qualidade e revisão trimestral.',
        example: 'Ex.: Reuniões de lições aprendidas e atualização dos fluxos de trabalho quando ocorrem falhas.',
      },
    ],
  },
  {
    id: 'P4.2',
    pillarId: 'pilar4',
    title: 'Ferramentas e sistemas adequados',
    description: 'A empresa utiliza ferramentas adequadas para sua operação (sistema de gestão/ERP, estoque, agenda, atendimento)?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Totalmente dependente de papel, anotações perdidas ou memória.',
        example: 'Ex.: Controle de estoque e de pedidos em comandas de papel que se extraviam.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Usa aplicativos gratuitos ou sistemas genéricos sem configuração adequada ao setor.',
        example: 'Ex.: Usa planilha básica no celular onde arquivos são corrompidos com frequência.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Possui sistema contratado, mas usa menos de 20% das funções (ex.: só emite nota fiscal).',
        example: 'Ex.: Paga mensalidade de ERP comercial mas o estoque continua controlado à mão.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Sistema de gestão adequado ao segmento operando integrado (vendas, estoque, financeiro, fiscal).',
        example: 'Ex.: Toda a equipe usa o software padrão da empresa com cadastros centralizados.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Sistemas conectados via nuvem, relatórios em tempo real e avaliação contínua do custo-benefício de softwares.',
        example: 'Ex.: Acessa indicadores no celular de qualquer lugar e integra estoque físico com online.',
      },
    ],
  },
  {
    id: 'P4.3',
    pillarId: 'pilar4',
    title: 'Indicadores operacionais e de qualidade',
    description: 'A empresa acompanha prazos de entrega, produtividade, qualidade, erros ou retrabalho?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Desconhece quanto tempo leva para entregar ou quantas vezes precisa refazer o trabalho.',
        example: 'Ex.: Clientes reclamam de atraso com frequência e a empresa não sabe o motivo.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Percebe erros graves quando geram reclamação ou devolução de mercadoria.',
        example: 'Ex.: "Tivemos muito retrabalho essa semana", mas sem saber a quantidade exata.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Registra devoluções ou cancelamentos, mas sem investigar as causas raízes.',
        example: 'Ex.: Anota troca de produto mas não avalia se o erro foi no cadastro, separação ou fornecedor.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Indicadores monitorados (taxa de entrega no prazo - OTIF, índice de refações ou tempo de ciclo de atendimento).',
        example: 'Ex.: Meta clara de entregar serviços em até 48 horas com acompanhamento do percentual cumprido.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Gestão visual da operação, controle estatístico de qualidade e planos de ação para erros recorrentes.',
        example: 'Ex.: Painel operacional transparente com metas diárias e bonificação por precisão.',
      },
    ],
  },
  {
    id: 'P4.4',
    pillarId: 'pilar4',
    title: 'Automação e redução de redundâncias',
    description: 'A empresa automatiza tarefas repetitivas e evita digitar ou controlar a mesma informação em vários lugares?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Digitação duplicada em cadernos, planilhas e sistemas; trabalho manual excessivo.',
        example: 'Ex.: Copia o pedido do WhatsApp para o bloco de papel e depois digita tudo de novo para emitir a nota.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Copia e cola dados manualmente entre ferramentas diferentes.',
        example: 'Ex.: Exporta relatório do banco para redigitar linha por linha em planilha.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Algumas integrações pontuais (ex.: leitor de código de barras ou emissor de nota automático).',
        example: 'Ex.: Emite nota pelo sistema mas o controle financeiro continua sendo feito em outro lugar manual.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Processos integrados onde o pedido gera automaticamente a baixa no estoque, contas a receber e ordem de serviço.',
        example: 'Ex.: Venda confirmada alimenta estoque e emite cobrança sem redigitação.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Uso de automações no-code/APIs (ex.: envio automático de WhatsApp pós-compra, conciliação bancária automática por OFX/API).',
        example: 'Ex.: Lembretes automáticos aos clientes antes do vencimento economizando horas de trabalho da equipe.',
      },
    ],
  },
  {
    id: 'P4.5',
    pillarId: 'pilar4',
    title: 'Segurança, backup e continuidade',
    description: 'A empresa possui backup automático, controle de senhas/acessos, proteção de dados e plano para continuar operando em caso de falha?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Se o computador principal queimar ou for roubado, a empresa perde tudo e para de funcionar.',
        example: 'Ex.: Todos os arquivos em um único notebook velho sem cópia de segurança em nenhum lugar.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Faz cópia em pendrive esporadicamente quando lembra, ou compartilha a mesma senha entre todos.',
        example: 'Ex.: Todos os colaboradores usam a mesma senha de acesso administrativo.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Possui arquivos no Google Drive ou nuvem, mas sem política de permissões nem antivírus atualizado.',
        example: 'Ex.: Arquivos na nuvem, mas ex-funcionários ainda mantêm acesso aos documentos.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Backup automático diário na nuvem, controle individual de senhas com dupla autenticação (2FA) e cuidados com LGPD.',
        example: 'Ex.: Cada funcionário tem seu usuário, dados de clientes são protegidos e existe cópia segura diária.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Plano formal de continuidade do negócio testado periodicamente com recuperação rápida contra desastres ou ransomware.',
        example: 'Ex.: Teste anual de restauração de backup garantindo retorno da operação em menos de 4 horas.',
      },
    ],
  },

  // --- PILAR 5: ESTRATÉGIA, PESSOAS E CRESCIMENTO ---
  {
    id: 'P5.1',
    pillarId: 'pilar5',
    title: 'Objetivos e metas claros para 12 meses',
    description: 'A empresa possui objetivos e metas quantitativos e qualitativos definidos para os próximos 12 meses?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'A empresa vive um dia de cada vez, sem direção futura.',
        example: 'Ex.: "Meu objetivo é pagar as contas desse mês e ver o que acontece".',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Existe um desejo na cabeça dos sócios (ex.: "quero crescer 20%"), mas sem desdobramento em ações.',
        example: 'Ex.: Quer faturar mais, mas não sabe quantos novos clientes precisa nem o plano para isso.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Metas gerais de faturamento, mas sem metas para clientes, processos ou redução de custos.',
        example: 'Ex.: Sabe o valor total de vendas almejado, mas não tem metas por mês ou por setor.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Objetivos claros divididos em metas trimestrais, comunicados à equipe e desdobrados em planos de ação.',
        example: 'Ex.: Metas claras para 12 meses: novos clientes, faturamento, satisfação e capacitação da equipe.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Metodologia de metas (ex.: OKRs ou BSC) com revisão trimestral formal e alinhamento estratégico contínuo.',
        example: 'Ex.: Reunião trimestral de estratégia para calibrar metas com base nas mudanças do mercado regional.',
      },
    ],
  },
  {
    id: 'P5.2',
    pillarId: 'pilar5',
    title: 'Execução das metas com prazos e responsáveis',
    description: 'As metas possuem responsáveis diretos, prazos de entrega e indicadores de acompanhamento contínuo?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Nenhum acompanhamento; planos ficam no papel.',
        example: 'Ex.: No início do ano faz planos, mas em fevereiro já foram esquecidos na rotina do dia a dia.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'O dono cobra quando lembra, gerando cobranças desordenadas.',
        example: 'Ex.: Lembra de cobrar uma melhoria apenas quando surge um problema grave.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Existe responsável, mas sem reuniões regulares de alinhamento e prazos flexibilizados em excesso.',
        example: 'Ex.: Define quem deve fazer, mas prazos são adiados indefinidamente sem justificativa.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Rotina quinzenal ou mensal de prestação de contas dos projetos, com planos de ação corretivos quando o prazo atrasa.',
        example: 'Ex.: Reunião mensal com pauta fixa: o que foi concluído, o que atrasou e o plano para recuperar o ritmo.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Gestão visual de projetos com indicadores de cumprimento de prazos e programa de incentivos atrelado à entrega das metas.',
        example: 'Ex.: Mais de 85% das ações estratégicas concluídas no prazo acordado nos últimos 12 meses.',
      },
    ],
  },
  {
    id: 'P5.3',
    pillarId: 'pilar5',
    title: 'Pessoas, papéis claros e treinamento',
    description: 'A equipe possui papéis bem definidos e recebe treinamento ou orientação periódica para executar suas atividades?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Funções confusas ("todo mundo faz tudo"), sem clareza de autoridade e sem qualquer treinamento.',
        example: 'Ex.: Cliente é jogado de um funcionário para outro porque ninguém sabe de quem é a responsabilidade.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Treinamento acontece apenas nos primeiros dias de contratação e depois cessa.',
        example: 'Ex.: O funcionário aprende na base do erro e da bronca.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Funções descritas basicamente, mas sem plano contínuo de capacitação e desenvolvimento.',
        example: 'Ex.: Sabe quem é vendedor e quem é caixa, mas nunca fez curso de atendimento ou técnicas de vendas.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Descrição de cargos clara, programa de integração de novos membros e treinamentos programados ao longo do ano.',
        example: 'Ex.: Participação em capacitações da ACI Del-Rei/Sebrae e reuniões mensais de treinamento interno.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Avaliação de desempenho periódica, plano de cargos/evolução, clima organizacional medido e retenção de talentos.',
        example: 'Ex.: Feedback estruturado semestral com plano individual de desenvolvimento para cada colaborador.',
      },
    ],
  },
  {
    id: 'P5.4',
    pillarId: 'pilar5',
    title: 'Experimentação e capacidade de melhoria',
    description: 'A empresa consegue testar novos canais, produtos, processos ou formatos de atendimento e aprende com os resultados?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'A empresa faz as coisas exatamente do mesmo jeito há anos e resiste a qualquer mudança.',
        example: 'Ex.: "Sempre fizemos assim e sempre deu certo, não vejo por que mudar".',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Tenta coisas novas apenas no susto ou desespero quando perde clientes importantes.',
        example: 'Ex.: Testa uma ideia nova sem método e desiste na primeira semana se não der resultado imediato.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Testa novidades esporadicamente, mas não avalia se deram lucro ou aprendizado real.',
        example: 'Ex.: Lança um novo prato ou serviço sem calcular o retorno gerado.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Ambiente receptivo a ideias da equipe, pequenos testes rápidos com baixo custo e avaliação dos resultados.',
        example: 'Ex.: Testa uma nova oferta durante 15 dias com um grupo de clientes e mede a aceitação antes de expandir.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Cultura de inovação contínua: orçamento para testes, análise pós-projeto e rápida escala de ideias bem-sucedidas.',
        example: 'Ex.: Ciclos ágeis de melhoria com novos produtos ou canais contribuindo para mais de 15% do faturamento.',
      },
    ],
  },
  {
    id: 'P5.5',
    pillarId: 'pilar5',
    title: 'Uso responsável de IA e tecnologia moderna',
    description: 'A empresa utiliza tecnologia ou inteligência artificial com objetivo claro, revisão humana, proteção de dados e avaliação de resultados?',
    options: [
      {
        score: 0,
        label: '0 — Não existe ou desconheço',
        detail: 'Não utiliza inteligência artificial nem ferramentas tecnológicas modernas na gestão.',
        example: 'Ex.: Não conhece ferramentas modernas ou considera distantes da realidade da sua empresa.',
      },
      {
        score: 1,
        label: '1 — Informal',
        detail: 'Usa IA (ex.: ChatGPT) de forma individual e isolada apenas para tirar dúvidas rápidas ou textos informais.',
        example: 'Ex.: Sócio usa esporadicamente para revisar uma mensagem no WhatsApp sem critério corporativo.',
      },
      {
        score: 2,
        label: '2 — Parcial',
        detail: 'Utiliza ferramentas de IA para criar conteúdo ou imagens, mas sem diretrizes de proteção de dados e com pouca revisão.',
        example: 'Ex.: Coloca dados de clientes em ferramentas públicas sem saber os riscos de privacidade.',
      },
      {
        score: 3,
        label: '3 — Estruturado',
        detail: 'Uso orientado de IA na rotina (atendimento, redação, análise de dados) com revisão humana e proteção estrita de dados sigilosos.',
        example: 'Ex.: Equipe treinada para acelerar pesquisas e atendimentos com validação humana antes do envio final.',
      },
      {
        score: 4,
        label: '4 — Gerenciado',
        detail: 'Automações inteligentes integradas ao negócio, mensuração de produtividade gerada e governança ética de tecnologia.',
        example: 'Ex.: Processos acelerados com IA gerando economia comprovada de horas, com conformidade total à LGPD.',
      },
    ],
  },
];

// Módulos complementares por segmento (5 perguntas práticas)
export const COMPLEMENTARY_MODULES: Record<string, { title: string; questions: QuestionDefinition[] }> = {
  comercio: {
    title: 'Módulo Específico: Comércio Varejista e Atacadista',
    questions: [
      {
        id: 'C.1',
        pillarId: 'complementar',
        title: 'Controle de estoque e giro',
        description: 'A empresa controla o giro das mercadorias, evita rupturas e identifica produtos parados há muito tempo?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Sem controle de estoque.', example: 'Falta produto sem perceber ou sobra mercadoria encalhada.' },
          { score: 1, label: '1 — Informal', detail: 'Olhar visual das prateleiras.', example: 'Pede reposição quando vê a prateleira vazia.' },
          { score: 2, label: '2 — Parcial', detail: 'Inventário esporádico.', example: 'Conta estoque uma vez por ano.' },
          { score: 3, label: '3 — Estruturado', detail: 'Estoque mínimo cadastrado e compras baseadas no histórico de vendas.', example: 'Alerta quando o estoque atinge ponto de ressuprimento.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Curva ABC de giro, prazo médio de estoque e queima planejada de encalhes.', example: 'Giro rápido preservando o capital de giro.' },
        ],
      },
      {
        id: 'C.2',
        pillarId: 'complementar',
        title: 'Margem real por linha de produto',
        description: 'A empresa conhece a margem líquida de cada categoria de produto considerando custos, perdas e tributação?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Aplica a mesma margem para tudo sem distinção.', example: 'Desconhece quais itens dão lucro real.' },
          { score: 1, label: '1 — Informal', detail: 'Noção genérica do que "dá mais lucro".', example: 'Supõe que itens mais caros são os mais lucrativos.' },
          { score: 2, label: '2 — Parcial', detail: 'Conhece o custo das mercadorias vendidas (CMV), mas não detalha perdas.', example: 'Não contabiliza avarias e furtos.' },
          { score: 3, label: '3 — Estruturado', detail: 'Margem calculada por departamento com regras para promoções.', example: 'Sabe exatamente até onde pode conceder desconto.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Rentabilidade líquida monitorada por SKU com mix balanceado.', example: 'Decisão de compras pautada no retorno sobre o metro quadrado ou linha.' },
        ],
      },
      {
        id: 'C.3',
        pillarId: 'complementar',
        title: 'Acompanhamento do ticket médio',
        description: 'A empresa acompanha o valor médio gasto por cliente e treina a equipe para cross-selling (venda cruzada)?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Desconhece o valor do ticket médio.', example: 'Atendimento passivo; só vende o que o cliente pede.' },
          { score: 1, label: '1 — Informal', detail: 'Sabe por alto o valor das compras.', example: 'Vendedor às vezes sugere outro item.' },
          { score: 2, label: '2 — Parcial', detail: 'Mede o ticket médio, mas sem ações práticas para elevá-lo.', example: 'Vê o número no relatório e nada faz.' },
          { score: 3, label: '3 — Estruturado', detail: 'Técnicas ativas de venda adicional (combo, checkout) com meta diária.', example: 'Ofertas complementares no caixa ou atendimento.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Incentivos para elevação de itens por atendimento e ticket médio por categoria.', example: 'Campanhas internas premiando elevação do valor médio.' },
        ],
      },
      {
        id: 'C.4',
        pillarId: 'complementar',
        title: 'Medição e estímulo de recompra',
        description: 'A empresa mantém contato com clientes que já compraram para trazê-los de volta à loja?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Cliente compra e nunca mais recebe contato.', example: 'Não há cadastro de clientes.' },
          { score: 1, label: '1 — Informal', detail: 'Cadastra apenas se o cliente pedir nota fiscal.', example: 'Dados ficam parados sem uso comercial.' },
          { score: 2, label: '2 — Parcial', detail: 'Manda mensagens em massa esporádicas no WhatsApp.', example: 'Disparo genérico sem personalização.' },
          { score: 3, label: '3 — Estruturado', detail: 'Programa de fidelidade ou mensagens no aniversário e ciclo de reposição.', example: 'Contato no tempo estimado em que o produto costuma acabar.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Clube de relacionamento com taxa de recompra e intervalo médio medidos.', example: 'Recompra representa mais de 40% do faturamento da loja.' },
        ],
      },
      {
        id: 'C.5',
        pillarId: 'complementar',
        title: 'Planejamento de campanhas sazonais',
        description: 'A empresa se antecipa a datas comemorativas locais e nacionais (Natal, Dia das Mães, eventos de São João del-Rei)?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Lembra das datas na semana do evento.', example: 'Não tem estoque nem decoração prontos a tempo.' },
          { score: 1, label: '1 — Informal', detail: 'Compra produtos na véspera pagando mais caro.', example: 'Aproveita mal as festas da cidade.' },
          { score: 2, label: '2 — Parcial', detail: 'Planeja as 2 ou 3 maiores datas, mas sem campanhas integradas.', example: 'Faz algo para o Natal, mas ignora outras datas.' },
          { score: 3, label: '3 — Estruturado', detail: 'Calendário promocional anual com compras e marketing preparados com 45 dias de antecedência.', example: 'Planejamento integrado aproveitando o turismo e comércio local.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Avaliação pós-campanha do ROI, margem e liquidação planejada das sobras.', example: 'Histórico de vendas por data sazonal usado para compras cirúrgicas.' },
        ],
      },
    ],
  },
  servicos: {
    title: 'Módulo Específico: Empresas de Serviços',
    questions: [
      {
        id: 'S.1',
        pillarId: 'complementar',
        title: 'Controle de agenda e capacidade instalada',
        description: 'A empresa conhece o limite máximo de clientes ou projetos que consegue atender com qualidade?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Sem controle de capacidade.', example: 'Aceita clientes a mais e atrasa tudo, ou fica ociosa.' },
          { score: 1, label: '1 — Informal', detail: 'Agenda física com sobreposições frequentes.', example: 'Atendimentos se chocam por falta de controle central.' },
          { score: 2, label: '2 — Parcial', detail: 'Agenda eletrônica, mas sem cálculo de horas disponíveis.', example: 'Não sabe a taxa de ocupação real da equipe.' },
          { score: 3, label: '3 — Estruturado', detail: 'Agenda integrada com tempos padrão de atendimento e capacidade máxima mapeada.', example: 'Bloqueio preventivo de agenda para imprevistos.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Otimização de ocupação com precificação por horário/demanda.', example: 'Distribuição inteligente de horários reduzindo ociosidade.' },
        ],
      },
      {
        id: 'S.2',
        pillarId: 'complementar',
        title: 'Acompanhamento de horas ou ocupação vendida',
        description: 'A empresa calcula a rentabilidade real por hora de serviço prestado ou taxa de ocupação da equipe?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Não mede horas gastas na prestação do serviço.', example: 'Gasta 20 horas num projeto e cobra o mesmo que gastaria em 2.' },
          { score: 1, label: '1 — Informal', detail: 'Sabe apenas se o projeto demorou muito.', example: 'Sensação de cansaço sem comprovação em números.' },
          { score: 2, label: '2 — Parcial', detail: 'Aponta horas em alguns clientes grandes.', example: 'Sem visão da carteira inteira.' },
          { score: 3, label: '3 — Estruturado', detail: 'Custo hora/homem calculado com controle de tempo por projeto ou atendimento.', example: 'Sabe exatamente se o contrato é rentável.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Rentabilidade por cliente monitorada e reajuste ou repactuação de escopo com base em dados.', example: 'Ajuste proativo de contratos deficitários.' },
        ],
      },
      {
        id: 'S.3',
        pillarId: 'complementar',
        title: 'Controle de cancelamentos, faltas (no-show) e atrasos',
        description: 'A empresa tem rotinas para confirmar agendamentos e reduzir faltas de clientes?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Clientes faltam sem avisar e o prejuízo é absorvido.', example: 'Horários nobres perdidos todos os dias.' },
          { score: 1, label: '1 — Informal', detail: 'Lembra de mandar mensagem quando tem tempo livre.', example: 'Confirmação irregular.' },
          { score: 2, label: '2 — Parcial', detail: 'Confirma na véspera, mas sem política clara para desistências.', example: 'Não cobra sinal nem tem fila de espera.' },
          { score: 3, label: '3 — Estruturado', detail: 'Lembretes automáticos com 24h e 2h de antecedência e lista de espera ativa.', example: 'Redução drástica do no-show com reposição rápida.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Índice de faltas abaixo de 5%, política de sinal/reserva e fila de espera automática.', example: 'Garantia de remuneração da hora mesmo com imprevistos.' },
        ],
      },
      {
        id: 'S.4',
        pillarId: 'complementar',
        title: 'Produtividade e padrão de entrega da equipe',
        description: 'Os profissionais seguem o mesmo padrão de excelência ou a qualidade varia muito conforme quem atende?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Cada atendente/prestador faz de forma totalmente diferente.', example: 'Cliente só aceita ser atendido por uma pessoa específica.' },
          { score: 1, label: '1 — Informal', detail: 'Dicas rápidas entre colegas.', example: 'Falta de uniformidade.' },
          { score: 2, label: '2 — Parcial', detail: 'Checklist simples, mas pouco conferido.', example: 'Alguns serviços saem perfeitos, outros incompletos.' },
          { score: 3, label: '3 — Estruturado', detail: 'Protocolo de atendimento padronizado com critérios de aceitação e entrega.', example: 'O cliente tem a mesma experiência independentemente de quem o atende.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Pesquisa pós-atendimento (NPS/CSAT) por profissional e treinamento focado nas lacunas.', example: 'Nota de satisfação da equipe acima de 9 com melhoria contínua.' },
        ],
      },
      {
        id: 'S.5',
        pillarId: 'complementar',
        title: 'Retenção, contratos recorrentes e renovação',
        description: 'A empresa possui serviços por assinatura, contratos mensais ou planos de recorrência com os clientes?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Toda venda é avulsa; precisa conquistar os mesmos clientes todo mês do zero.', example: 'Incerteza constante sobre o faturamento do mês seguinte.' },
          { score: 1, label: '1 — Informal', detail: 'Alguns clientes fiéis que voltam por hábito sem contrato formal.', example: 'Não há garantia de continuidade.' },
          { score: 2, label: '2 — Parcial', detail: 'Poucos contratos recorrentes, mas com alto índice de cancelamento.', example: 'Dificuldade para reter o cliente após o terceiro mês.' },
          { score: 3, label: '3 — Estruturado', detail: 'Planos recorrentes estruturados (mensalidades, pacotes ou manutenções preventivas).', example: 'Receita previsível que cobre parte substancial dos custos fixos.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Gestão de sucesso do cliente com churn mínimo e taxa de renovação de contratos acima de 85%.', example: 'Base sólida de receita recorrente contratada.' },
        ],
      },
    ],
  },
  industria: {
    title: 'Módulo Específico: Indústria, Produção e Cooperativas',
    questions: [
      {
        id: 'I.1',
        pillarId: 'complementar',
        title: 'Medição de produtividade e qualidade operacional',
        description: 'A empresa acompanha o rendimento da produção, perdas de matéria-prima e conformidade dos lotes?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Sem medição de perdas ou produção.', example: 'Não sabe quanto material vira refugo.' },
          { score: 1, label: '1 — Informal', detail: 'Percebe desperdício visualmente no chão de fábrica.', example: 'Sem pesagem ou registro do descarte.' },
          { score: 2, label: '2 — Parcial', detail: 'Registra a produção diária, mas sem cruzar com insumos consumidos.', example: 'Não sabe a eficiência exata do lote.' },
          { score: 3, label: '3 — Estruturado', detail: 'Índice de perda por ordem de produção com metas de aproveitamento.', example: 'Inspeção de qualidade antes da expedição.' },
          { score: 4, label: '4 — Gerenciado', detail: 'OEE (Eficiência Global dos Equipamentos) e controle estatístico de processo.', example: 'Produção enxuta com redução contínua de desperdícios.' },
        ],
      },
      {
        id: 'I.2',
        pillarId: 'complementar',
        title: 'Controle de paradas, manutenção e retrabalho',
        description: 'A empresa possui plano de manutenção preventiva de máquinas e mede o tempo de paradas não programadas?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Só mexe na máquina quando ela quebra e a produção para.', example: 'Paradas que geram dias de atraso nas entregas.' },
          { score: 1, label: '1 — Informal', detail: 'Lubrifica ou ajusta quando alguém lembra.', example: 'Sem histórico de manutenções.' },
          { score: 2, label: '2 — Parcial', detail: 'Manutenção preventiva básica, mas peças de reposição críticas não têm estoque.', example: 'Máquina parada aguardando peça chegar de fora.' },
          { score: 3, label: '3 — Estruturado', detail: 'Cronograma preventivo periódico e registro dos motivos de paradas de linha.', example: 'Equipamentos revisados antes de períodos de pico.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Manutenção preditiva com gestão de sobressalentes e tempo médio entre falhas (MTBF) monitorado.', example: 'Paradas não programadas reduzidas a menos de 2% do tempo operacional.' },
        ],
      },
      {
        id: 'I.3',
        pillarId: 'complementar',
        title: 'Rastreabilidade e controle de lotes',
        description: 'A empresa consegue rastrear a matéria-prima utilizada e o destino de cada lote fabricado?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Se houver problema no produto, não sabe qual lote foi afetado.', example: 'Sem controle de datas ou lotes.' },
          { score: 1, label: '1 — Informal', detail: 'Anotações em pranchetas sem consolidação.', example: 'Difícil localizar histórico de um cliente antigo.' },
          { score: 2, label: '2 — Parcial', detail: 'Numera os lotes, mas sem vínculo direto com fornecedores de insumo.', example: 'Rastreabilidade apenas parcial.' },
          { score: 3, label: '3 — Estruturado', detail: 'Rastreamento completo do insumo ao cliente final via sistema com ficha técnica.', example: 'Capacidade de identificar clientes de um lote específico em minutos.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Rastreabilidade com código de barras/QR Code integrada ao sistema e plano de recall testado.', example: 'Conformidade com padrões rigorosos de qualidade e auditoria.' },
        ],
      },
      {
        id: 'I.4',
        pillarId: 'complementar',
        title: 'Integração de dados de produção e gestão (PCP)',
        description: 'O Planejamento e Controle da Produção (PCP) é integrado com vendas, compras e finanças?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Vendas vende o que a fábrica não consegue produzir, gerando atritos.', example: 'Falta de comunicação entre escritório e fábrica.' },
          { score: 1, label: '1 — Informal', detail: 'Conversas verbais diárias entre o comercial e o encarregado da fábrica.', example: 'Planos mudam toda hora sem registro.' },
          { score: 2, label: '2 — Parcial', detail: 'Planilha de PCP semanal, mas atualizada com atraso.', example: 'Compras compra material atrasado para pedidos urgentes.' },
          { score: 3, label: '3 — Estruturado', detail: 'Ordens de produção geradas no ERP com cálculo automático de demanda de insumos.', example: 'Previsibilidade de compras alinhada ao cronograma fabril.' },
          { score: 4, label: '4 — Gerenciado', detail: 'PCP dinâmico com balanceamento de linhas de produção e nivelamento de estoques (just-in-time).', example: 'Fluxo produtivo estável sem sobrecarga nem ociosidade.' },
        ],
      },
      {
        id: 'I.5',
        pillarId: 'complementar',
        title: 'Segurança do trabalho e plano de continuidade operacional',
        description: 'A empresa cumpre normas de segurança (NRs), fornece EPIs e tem rotinas para evitar acidentes e interrupções?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Sem treinamento de segurança ou fornecimento de EPIs.', example: 'Alto risco de acidentes e autuações.' },
          { score: 1, label: '1 — Informal', detail: 'Entrega EPI apenas quando o funcionário pede.', example: 'Fiscalização interna inexistente.' },
          { score: 2, label: '2 — Parcial', detail: 'EPIs fornecidos e ficha de entrega assinada, mas sem fiscalização de uso.', example: 'Trabalhadores não usam por desconforto.' },
          { score: 3, label: '3 — Estruturado', detail: 'Treinamentos de NR regulares, CIPA/designado ativo e plano contra incêndio (AVCB) em dia.', example: 'Zero acidentes com afastamento e auditoria preventiva.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Cultura de segurança comportamental, gestão ambiental de resíduos e gerador de contingência.', example: 'Sustentabilidade operacional e conformidade legal plena.' },
        ],
      },
    ],
  },
  geral: {
    title: 'Módulo Específico: Governança e Estrutura Empresarial',
    questions: [
      {
        id: 'G.1',
        pillarId: 'complementar',
        title: 'Governança e proteção de dados (LGPD)',
        description: 'A empresa possui regras para uso de dados, termos de confidencialidade e consentimento de clientes?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Desconhece exigências legais de proteção de dados.', example: 'Dados de clientes expostos em planilhas compartilhadas abertas.' },
          { score: 1, label: '1 — Informal', detail: 'Sabe que existe a lei, mas não implementou medidas práticas.', example: 'Sem consentimento documentado.' },
          { score: 2, label: '2 — Parcial', detail: 'Termos de uso no site, mas processos internos ainda vulneráveis.', example: 'Coleta dados sem informar a finalidade específica.' },
          { score: 3, label: '3 — Estruturado', detail: 'Mapeamento dos dados coletados, política de privacidade atualizada e termo assinado por funcionários.', example: 'Consentimentos registrados e canal para exclusão de dados ativo.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Encarregado de dados (DPO) nomeado ou assessoria jurídica periódica com auditoria de conformidade.', example: 'Gestão preventiva de riscos jurídicos e digitais.' },
        ],
      },
      {
        id: 'G.2',
        pillarId: 'complementar',
        title: 'Alçadas e processos formais de aprovação',
        description: 'Existem limites claros de valor e autonomia para contratações, pagamentos e descontos comerciais?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Tudo precisa passar pelo dono centralizador ou qualquer um aprova sem critério.', example: 'Gargalo decisório ou compras sem autorização.' },
          { score: 1, label: '1 — Informal', detail: 'Autorizações verbais no dia a dia gerando desencontros.', example: '"Achei que você tinha aprovado".' },
          { score: 2, label: '2 — Parcial', detail: 'Alçadas definidas apenas para compras grandes.', example: 'Pequenos gastos somados sangram o caixa sem controle.' },
          { score: 3, label: '3 — Estruturado', detail: 'Matriz de alçadas documentada (ex.: gestor aprova até R$ 2 mil, diretoria acima disso).', example: 'Fluxo no sistema com dupla aprovação para transferências.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Workflow digital de aprovação com trilha de auditoria e conformidade financeira.', example: 'Processos ágeis sem perda de controle interno.' },
        ],
      },
      {
        id: 'G.3',
        pillarId: 'complementar',
        title: 'Indicadores por área e reuniões de gestão',
        description: 'Cada departamento possui indicadores próprios e rotina mensal de prestação de resultados?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Não há divisão por áreas nem indicadores específicos.', example: 'Cada setor trabalha isolado sem metas.' },
          { score: 1, label: '1 — Informal', detail: 'Conversas esporádicas nos corredores.', example: 'Sem pauta ou ata de decisões.' },
          { score: 2, label: '2 — Parcial', detail: 'Reuniões quando há crises ou problemas graves.', example: 'Encontros apenas reativos, não preventivos.' },
          { score: 3, label: '3 — Estruturado', detail: 'Reunião mensal de diretoria com apresentação dos indicadores de cada área.', example: 'Transparência de metas entre comercial, operações e financeiro.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Comitê de gestão com painéis compartilhados (Dashboards) e planos de ação interdepartamentais.', example: 'Cultura orientada a dados em todos os níveis da empresa.' },
        ],
      },
      {
        id: 'G.4',
        pillarId: 'complementar',
        title: 'Planejamento orçamentário anual',
        description: 'A empresa elabora orçamento anual (receitas, despesas, investimentos) e acompanha o orçado versus realizado?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Não faz orçamento; gasta conforme o dinheiro entra.', example: 'Surpresas financeiras todo início de ano.' },
          { score: 1, label: '1 — Informal', detail: 'Estimativa mental de despesas para o ano.', example: 'Sem detalhamento mês a mês.' },
          { score: 2, label: '2 — Parcial', detail: 'Orçamento feito no início do ano mas nunca revisado durante os meses.', example: 'Esquecido na primeira planilha.' },
          { score: 3, label: '3 — Estruturado', detail: 'Orçamento formal elaborado no último trimestre com revisão mensal de desvios orçamentários.', example: 'Controle de centro de custos com justificativa para estouros de verba.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Orçamento matricial ou base zero com forecast móvel (projeção recalculada a cada trimestre).', example: 'Previsibilidade financeira com alocação ótima de capital.' },
        ],
      },
      {
        id: 'G.5',
        pillarId: 'complementar',
        title: 'Mapeamento e gestão de riscos',
        description: 'A empresa identifica os principais riscos do seu negócio (dependência de cliente, fornecedor, fiscal, operacional) e tem planos de contingência?',
        options: [
          { score: 0, label: '0 — Inexistente', detail: 'Não pensa em riscos até que o problema aconteça.', example: 'Mais de 60% do faturamento concentrado em um único cliente sem alternativa.' },
          { score: 1, label: '1 — Informal', detail: 'Sabe dos riscos por preocupação dos sócios, mas sem plano preventivo.', example: 'Medo de perder o fornecedor exclusivo sem ter plano B.' },
          { score: 2, label: '2 — Parcial', detail: 'Seguros patrimoniais contratados, mas sem análise de riscos contratuais ou fiscais.', example: 'Protege a loja física mas não protege contratos.' },
          { score: 3, label: '3 — Estruturado', detail: 'Matriz de riscos com limites de concentração (cliente máximo, fornecedor alternativo homologado).', example: 'Diversificação ativa de fontes de receita e insumos.' },
          { score: 4, label: '4 — Gerenciado', detail: 'Comitê periódico de gestão de riscos e governança com planos de continuidade ativáveis imediatamente.', example: 'Empresa resiliente a crises macroeconômicas ou choques setoriais.' },
        ],
      },
    ],
  },
};

export function getComplementaryModuleForSegment(segment: BusinessSegment, teamSize?: string) {
  if (teamSize === 'mais_30') {
    return COMPLEMENTARY_MODULES.geral;
  }
  if (segment === 'comercio' || segment === 'alimentacao') {
    return COMPLEMENTARY_MODULES.comercio;
  }
  if (segment === 'servicos_pessoais' || segment === 'saude' || segment === 'educacao' || segment === 'servicos_empresariais' || segment === 'tecnologia') {
    return COMPLEMENTARY_MODULES.servicos;
  }
  if (segment === 'industria' || segment === 'construcao' || segment === 'transporte_logistica') {
    return COMPLEMENTARY_MODULES.industria;
  }
  return COMPLEMENTARY_MODULES.geral;
}
