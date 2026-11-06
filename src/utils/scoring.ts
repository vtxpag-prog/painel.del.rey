import {
  MaturityScore,
  PillarScore,
  BottleneckAlert,
  ActionPlanItem,
  DiagnosisResult,
  CompanyData,
  RespondentData,
  BusinessProfile,
  Consents,
} from '../types/diagnosis';
import { CORE_QUESTIONS, PILLARS_META } from '../data/questions';

export function calculatePillarScore(
  pillarId: string,
  answers: Record<string, MaturityScore>
): PillarScore {
  const meta = PILLARS_META[pillarId];
  const pillarQuestions = CORE_QUESTIONS.filter((q) => q.pillarId === pillarId);

  let rawSum = 0;
  pillarQuestions.forEach((q) => {
    const score = answers[q.id] ?? 0;
    rawSum += score;
  });

  // rawSum ranges from 0 to 20 (5 questions * 4 max score)
  let classification: PillarScore['classification'] = 'Básico';
  let color = '#3B82F6';

  if (rawSum <= 5) {
    classification = 'Crítico';
    color = '#EF4444'; // Red
  } else if (rawSum <= 10) {
    classification = 'Básico';
    color = '#F59E0B'; // Amber
  } else if (rawSum <= 15) {
    classification = 'Estruturado';
    color = '#3B82F6'; // Blue
  } else if (rawSum <= 18) {
    classification = 'Competitivo';
    color = '#10B981'; // Emerald
  } else {
    classification = 'Alta Performance';
    color = '#6366F1'; // Indigo
  }

  return {
    pillarId,
    name: meta ? meta.name : pillarId,
    score: rawSum,
    percentage: Math.round((rawSum / 20) * 100),
    classification,
    color,
    description: meta ? meta.description : '',
  };
}

export function calculateIME(pillarScores: Record<string, PillarScore>): {
  ime: number;
  classification: 'Crítico' | 'Básico' | 'Estruturado' | 'Competitivo' | 'Alta Performance';
  message: string;
} {
  const sum =
    (pillarScores.pilar1?.score || 0) +
    (pillarScores.pilar2?.score || 0) +
    (pillarScores.pilar3?.score || 0) +
    (pillarScores.pilar4?.score || 0) +
    (pillarScores.pilar5?.score || 0);

  let classification: 'Crítico' | 'Básico' | 'Estruturado' | 'Competitivo' | 'Alta Performance' = 'Básico';
  let message = 'Existem práticas iniciais, mas ainda pouco consistentes.';

  if (sum <= 39) {
    classification = 'Crítico';
    message = 'A empresa precisa priorizar organização e estabilização de rotinas essenciais.';
  } else if (sum <= 59) {
    classification = 'Básico';
    message = 'Existem práticas iniciais, mas ainda pouco consistentes no dia a dia da equipe.';
  } else if (sum <= 79) {
    classification = 'Estruturado';
    message = 'A empresa possui fundamentos consolidados e oportunidades claras de evolução competitiva.';
  } else if (sum <= 94) {
    classification = 'Competitivo';
    message = 'A empresa demonstra boa capacidade de gestão, processos organizados e consistência na execução.';
  } else {
    classification = 'Alta Performance';
    message = 'A empresa possui gestão integrada, disciplina de indicadores e foco em melhoria contínua.';
  }

  return {
    ime: sum,
    classification,
    message,
  };
}

export function calculateICD(answers: Record<string, MaturityScore>): {
  icd: number;
  classification: 'Digitalmente Invisível' | 'Presença Inicial' | 'Digitalmente Estruturada' | 'Empresa Digital';
} {
  // 4 Dimensões de 25% cada:
  // 1. Descoberta e presença digital: (P2.1 + P2.3) / 8 * 25
  const d1 = (((answers['P2.1'] ?? 0) + (answers['P2.3'] ?? 0)) / 8) * 25;
  // 2. Atendimento e relacionamento digital: (P2.2 + P1.4) / 8 * 25
  const d2 = (((answers['P2.2'] ?? 0) + (answers['P1.4'] ?? 0)) / 8) * 25;
  // 3. Dados, indicadores e integração: (P1.5 + P4.2) / 8 * 25
  const d3 = (((answers['P1.5'] ?? 0) + (answers['P4.2'] ?? 0)) / 8) * 25;
  // 4. Automação, segurança e IA responsável: (P4.4 + P4.5 + P5.5) / 12 * 25
  const d4 = (((answers['P4.4'] ?? 0) + (answers['P4.5'] ?? 0) + (answers['P5.5'] ?? 0)) / 12) * 25;

  const total = Math.round(d1 + d2 + d3 + d4);

  let classification: 'Digitalmente Invisível' | 'Presença Inicial' | 'Digitalmente Estruturada' | 'Empresa Digital' = 'Presença Inicial';
  if (total <= 25) {
    classification = 'Digitalmente Invisível';
  } else if (total <= 50) {
    classification = 'Presença Inicial';
  } else if (total <= 75) {
    classification = 'Digitalmente Estruturada';
  } else {
    classification = 'Empresa Digital';
  }

  return {
    icd: total,
    classification,
  };
}

export function detectBottleneckAlerts(
  pillarScores: Record<string, PillarScore>,
  answers: Record<string, MaturityScore>
): BottleneckAlert[] {
  const alerts: BottleneckAlert[] = [];

  // Pilares críticos gerais (<= 5)
  Object.values(pillarScores).forEach((p) => {
    if (p.score <= 5) {
      alerts.push({
        id: `alert-pilar-${p.pillarId}`,
        level: 'critico',
        title: `Pilar com Desempenho Crítico: ${p.name}`,
        description: `A pontuação total no pilar foi de ${p.score}/20 pontos, indicando vulnerabilidade operacional severa que impacta a sustentabilidade do negócio.`,
        actionRequired: `Intervenção imediata nas rotinas básicas de ${p.name} antes de assumir novos investimentos ou expansões.`,
      });
    }
  });

  // Alerta específico: Fluxo de caixa
  if ((answers['P3.2'] ?? 0) <= 1) {
    alerts.push({
      id: 'alert-cashflow',
      level: 'critico',
      title: 'Ausência de Previsibilidade no Fluxo de Caixa (P3.2)',
      description: 'A empresa opera sem fluxo de caixa projetado, correndo risco iminente de descompasso financeiro e dependência de crédito emergencial caro.',
      actionRequired: 'Implantar planilha ou sistema de fluxo de caixa projetado para pelo menos 45 a 60 dias corridos.',
    });
  }

  // Alerta específico: Margem e formação de preço
  if ((answers['P3.3'] ?? 0) <= 1) {
    alerts.push({
      id: 'alert-pricing',
      level: 'critico',
      title: 'Formação de Preço Empírica ou Desconhecimento de Margem (P3.3)',
      description: 'A precificação não contempla todos os custos diretos, impostos e custos fixos, o que pode gerar prejuízo silencioso a cada venda realizada.',
      actionRequired: 'Revisar ficha técnica e fórmula de mark-up para calcular o ponto de equilíbrio real da empresa.',
    });
  }

  // Alerta específico: Processos críticos
  if ((answers['P4.1'] ?? 0) <= 1) {
    alerts.push({
      id: 'alert-processes',
      level: 'critico',
      title: 'Dependência de Indivíduos e Processos Não Padronizados (P4.1)',
      description: 'A rotina da empresa depende excessivamente da memória ou da presença física do proprietário, dificultando delegação e escala.',
      actionRequired: 'Documentar os 3 procedimentos operacionais mais frequentes em manuais de 1 página.',
    });
  }

  // Alerta específico: Segurança e continuidade
  if ((answers['P4.5'] ?? 0) <= 1) {
    alerts.push({
      id: 'alert-security',
      level: 'critico',
      title: 'Vulnerabilidade de Backup e Continuidade Operacional (P4.5)',
      description: 'Risco de perda irreversível de dados comerciais e fiscais caso ocorra falha de equipamento, roubo ou ataque cibernético.',
      actionRequired: 'Configurar backup em nuvem automático diário e controle individualizado de acessos.',
    });
  }

  // Alerta específico: Acompanhamento de clientes
  if ((answers['P1.3'] ?? 0) <= 1) {
    alerts.push({
      id: 'alert-leads',
      level: 'atencao',
      title: 'Vazamento de Oportunidades Comerciais (P1.3)',
      description: 'Contatos e orçamentos solicitados não recebem acompanhamento estruturado, gerando perda silenciosa de vendas já atraídas.',
      actionRequired: 'Criar quadro visual simples (Kanban) para controlar status de cada orçamento em aberto.',
    });
  }

  // Alerta específico: Metas e responsáveis
  if ((answers['P5.2'] ?? 0) <= 1) {
    alerts.push({
      id: 'alert-execution',
      level: 'atencao',
      title: 'Falta de Disciplina de Execução e Responsabilidade (P5.2)',
      description: 'Planos estratégicos são definidos mas não há rotina periódica de cobrança e prestação de contas, mantendo a empresa no modo apagar incêndios.',
      actionRequired: 'Instituir reunião quinzenal curta de 30 minutos focada exclusivamente em entregas de metas acordadas.',
    });
  }

  return alerts;
}

export function generateStrengthsAndBottlenecks(
  answers: Record<string, MaturityScore>
): {
  strengths: { title: string; evidence: string; whyImportant: string; howToLeverage: string }[];
  bottlenecks: { title: string; problem: string; impact: string; priority: string; risk: string; recommendedAction: string }[];
} {
  // Sort questions by score descending for strengths, ascending for bottlenecks
  const scoredQuestions = CORE_QUESTIONS.map((q) => {
    const score = answers[q.id] ?? 0;
    const option = q.options.find((o) => o.score === score) || q.options[0];
    return {
      question: q,
      score,
      label: option.label,
      detail: option.detail,
    };
  });

  const sortedDesc = [...scoredQuestions].sort((a, b) => b.score - a.score);
  const sortedAsc = [...scoredQuestions].sort((a, b) => a.score - b.score);

  // Top 3 strengths (score >= 2 preferrably)
  const topStrengths = sortedDesc.slice(0, 3).map((item) => {
    return {
      title: `${item.question.title} (${item.score}/4)`,
      evidence: `A empresa atingiu o nível "${item.label}": ${item.detail}`,
      whyImportant: 'Constitui uma fortaleza competitiva comprovada que reduz custos operacionais e fideliza clientes.',
      howToLeverage: 'Padronizar esta prática como referência interna para as demais áreas da empresa e utilizá-la como argumento de valor.',
    };
  });

  // Top 3 bottlenecks
  const topBottlenecks = sortedAsc.slice(0, 3).map((item) => {
    return {
      title: `${item.question.title} (${item.score}/4)`,
      problem: `Nível classificado como "${item.label}": ${item.detail}`,
      impact: 'Trava o ritmo de crescimento sustentável e gera sobrecarga direta na liderança e na equipe.',
      priority: item.score <= 1 ? 'Crítica e Imediata' : 'Alta',
      risk: 'Risco de perda financeira, desmotivação da equipe ou perda de relevância competitiva perante o mercado de São João del-Rei.',
      recommendedAction: `Instituir rotina simples com responsável direto para migrar de nível nas próximas semanas.`,
    };
  });

  return {
    strengths: topStrengths,
    bottlenecks: topBottlenecks,
  };
}

export function generateActionPlan(
  pillarScores: Record<string, PillarScore>,
  answers: Record<string, MaturityScore>
): ActionPlanItem[] {
  const plan: ActionPlanItem[] = [];

  // Próximos 30 dias (3 ações de alto impacto)
  if ((answers['P3.1'] ?? 0) < 3) {
    plan.push({
      id: 'act-30-1',
      horizon: '30_dias',
      action: 'Separar rigorosamente contas PJ e PF e instituir pró-labore fixo mensal para os sócios.',
      impact: 'Alto',
      effort: 'Baixo',
      urgency: 'Imediata',
      timeframe: 'Dias 1 a 15',
      responsible: 'Sócios / Financeiro',
      metric: 'Zero despesas pessoais pagas na conta da empresa.',
    });
  } else {
    plan.push({
      id: 'act-30-1',
      horizon: '30_dias',
      action: 'Auditar e padronizar o catálogo de produtos e mensagens rápidas no WhatsApp Business.',
      impact: 'Alto',
      effort: 'Baixo',
      urgency: 'Alta',
      timeframe: 'Dias 1 a 15',
      responsible: 'Comercial / Atendimento',
      metric: '100% dos produtos principais catalogados com fotos e preços.',
    });
  }

  if ((answers['P2.1'] ?? 0) < 3) {
    plan.push({
      id: 'act-30-2',
      horizon: '30_dias',
      action: 'Otimizar o Google Perfil da Empresa (fotos recentes, horário, serviços) e solicitar 15 novas avaliações de clientes.',
      impact: 'Alto',
      effort: 'Baixo',
      urgency: 'Alta',
      timeframe: 'Dias 10 a 25',
      responsible: 'Marketing / Recepção',
      metric: 'Nota >= 4.8 no Google e mínimo de 15 novas avaliações positivas.',
    });
  } else {
    plan.push({
      id: 'act-30-2',
      horizon: '30_dias',
      action: 'Implantar régua de follow-up de 3 toques para orçamentos e propostas comerciais não respondidas.',
      impact: 'Alto',
      effort: 'Médio',
      urgency: 'Alta',
      timeframe: 'Dias 10 a 25',
      responsible: 'Vendas',
      metric: 'Aumento de 15% na taxa de conversão de orçamentos.',
    });
  }

  plan.push({
    id: 'act-30-3',
    horizon: '30_dias',
    action: 'Ativar rotina diária de backup automatizado na nuvem (Google Drive/OneDrive) e controle de senhas de equipe.',
    impact: 'Alto',
    effort: 'Baixo',
    urgency: 'Imediata',
    timeframe: 'Dias 20 a 30',
    responsible: 'TI / Operações',
    metric: 'Backup diário verificado sem interrupções.',
  });

  // Próximos 90 dias (3 ações de estruturação)
  plan.push({
    id: 'act-90-1',
    horizon: '90_dias',
    action: 'Implantar projeção contínua de fluxo de caixa para 60 dias e apurar margem de contribuição por linha de produto.',
    impact: 'Alto',
    effort: 'Médio',
    urgency: 'Alta',
    timeframe: 'Mês 2',
    responsible: 'Gestor Financeiro',
    metric: 'Fluxo previsto vs. realizado atualizado semanalmente.',
  });

  plan.push({
    id: 'act-90-2',
    horizon: '90_dias',
    action: 'Mapear e documentar os 3 principais Procedimentos Operacionais Padrão (POPs) do atendimento e entrega.',
    impact: 'Alto',
    effort: 'Médio',
    urgency: 'Média',
    timeframe: 'Mês 2 a 3',
    responsible: 'Líder Operacional',
    metric: 'Redução do tempo de integração de novos membros da equipe.',
  });

  plan.push({
    id: 'act-90-3',
    horizon: '90_dias',
    action: 'Definir metas trimestrais por setor e instituir reunião quinzenal de alinhamento com a equipe.',
    impact: 'Alto',
    effort: 'Médio',
    urgency: 'Alta',
    timeframe: 'Mês 3',
    responsible: 'Diretoria / Sócios',
    metric: '100% dos colaboradores com metas individuais conhecidas.',
  });

  // Próximos 12 meses (3 ações de crescimento/transformação)
  plan.push({
    id: 'act-360-1',
    horizon: '12_meses',
    action: 'Implantar ou aprofundar uso de sistema de gestão integrado (ERP) conectando vendas, estoque, fiscal e finanças.',
    impact: 'Alto',
    effort: 'Alto',
    urgency: 'Média',
    timeframe: 'Mês 4 a 6',
    responsible: 'Diretoria Executiva',
    metric: 'Eliminação de controles paralelos em planilhas soltas.',
  });

  plan.push({
    id: 'act-360-2',
    horizon: '12_meses',
    action: 'Estruturar programa contínuo de capacitação e retenção de colaboradores com apoio da ACI Del-Rei e parceiros.',
    impact: 'Alto',
    effort: 'Médio',
    urgency: 'Média',
    timeframe: 'Mês 6 a 9',
    responsible: 'Gestão de Pessoas',
    metric: 'Mínimo de 40 horas de treinamento por colaborador/ano.',
  });

  plan.push({
    id: 'act-360-3',
    horizon: '12_meses',
    action: 'Implementar automações e ferramentas digitais com apoio metodológico da Vortex para ganho de escala e eficiência.',
    impact: 'Alto',
    effort: 'Alto',
    urgency: 'Média',
    timeframe: 'Mês 9 a 12',
    responsible: 'Diretoria & Inovação',
    metric: 'Redução de 20% no tempo gasto em tarefas operacionais manuais.',
  });

  return plan;
}

export function generateSupportTrails(
  pillarScores: Record<string, PillarScore>
): { category: string; description: string; priority: 'alta' | 'media' | 'baixa' }[] {
  const trails = [
    {
      category: 'Capacitação Empresarial',
      description: 'Programas de desenvolvimento gerencial, liderança, atendimento ao cliente e postura profissional para equipes em São João del-Rei.',
      priority: (pillarScores.pilar5?.score ?? 0) <= 10 ? 'alta' : 'media',
    },
    {
      category: 'Geração de Negócios e Vendas',
      description: 'Estruturação de processos comerciais, técnicas de negociação, prospecção e participação em rodadas de negócios da ACI Del-Rei.',
      priority: (pillarScores.pilar1?.score ?? 0) <= 10 ? 'alta' : 'media',
    },
    {
      category: 'Presença Digital e Posicionamento Local',
      description: 'Google Meu Negócio, WhatsApp Business para vendas, criação de vitrine digital regional e comunicação alinhada aos clientes locais.',
      priority: (pillarScores.pilar2?.score ?? 0) <= 10 ? 'alta' : 'media',
    },
    {
      category: 'Organização Financeira e Sustentabilidade',
      description: 'Fluxo de caixa, precificação consciente, gestão de capital de giro e separação de finanças para garantir resiliência aos ciclos econômicos.',
      priority: (pillarScores.pilar3?.score ?? 0) <= 10 ? 'alta' : 'media',
    },
    {
      category: 'Processos e Produtividade Operacional',
      description: 'Mapeamento de gargalos, eliminação de retrabalho, padronização operacional (POPs) e integração entre setores da empresa.',
      priority: (pillarScores.pilar4?.score ?? 0) <= 10 ? 'alta' : 'media',
    },
    {
      category: 'Tecnologia, Automação e IA Responsável',
      description: 'Adoção criteriosa de ferramentas tecnológicas, automação no-code e uso ético de inteligência artificial com apoio da Vortex.',
      priority: (pillarScores.pilar4?.score ?? 0) > 10 && (pillarScores.pilar5?.score ?? 0) > 10 ? 'alta' : 'media',
    },
  ] as { category: string; description: string; priority: 'alta' | 'media' | 'baixa' }[];

  return trails;
}

export function buildCompleteDiagnosisResult(
  company: CompanyData,
  respondent: RespondentData,
  profile: BusinessProfile,
  consents: Consents,
  answers: Record<string, MaturityScore>,
  complementaryAnswers: Record<string, MaturityScore | 'na'>,
  isDemo = false,
  demoLabel?: string
): DiagnosisResult {
  const pilar1 = calculatePillarScore('pilar1', answers);
  const pilar2 = calculatePillarScore('pilar2', answers);
  const pilar3 = calculatePillarScore('pilar3', answers);
  const pilar4 = calculatePillarScore('pilar4', answers);
  const pilar5 = calculatePillarScore('pilar5', answers);

  const pillarScores = { pilar1, pilar2, pilar3, pilar4, pilar5 };
  const { ime, classification: imeClassification, message: imeMessage } = calculateIME(pillarScores);
  const { icd, classification: icdClassification } = calculateICD(answers);
  const alerts = detectBottleneckAlerts(pillarScores, answers);
  const { strengths, bottlenecks } = generateStrengthsAndBottlenecks(answers);
  const actionPlan = generateActionPlan(pillarScores, answers);
  const supportTrails = generateSupportTrails(pillarScores);

  return {
    id: `diag-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    isDemo,
    demoLabel,
    company,
    respondent,
    profile,
    consents,
    answers,
    complementaryAnswers,
    pillarScores,
    ime,
    imeClassification,
    imeMessage,
    confidenceLevel: 'Médio',
    icd,
    icdClassification,
    alerts,
    strengths,
    bottlenecks,
    actionPlan,
    supportTrails,
  };
}
