import { BusinessSegment } from '../types/diagnosis';

export interface PillarAverages {
  pilar1: number; // Vendas (0 a 20)
  pilar2: number; // Presença Digital (0 a 20)
  pilar3: number; // Finanças (0 a 20)
  pilar4: number; // Processos & TI (0 a 20)
  pilar5: number; // Estratégia & Pessoas (0 a 20)
}

export interface SegmentBenchmark {
  segment: BusinessSegment | 'geral';
  name: string;
  sampleSize: number; // Quantidade de empresas avaliadas na base regional
  averageIme: number; // 0 a 100
  averageIcd: number; // 0 a 100
  pillarAverages: PillarAverages;
  topStrengthSector: string;
  topBottleneckSector: string;
  description: string;
}

export const SEGMENT_BENCHMARKS: Record<string, SegmentBenchmark> = {
  comercio: {
    segment: 'comercio',
    name: 'Comércio & Varejo',
    sampleSize: 184,
    averageIme: 47.8,
    averageIcd: 43.2,
    pillarAverages: {
      pilar1: 10.4, // Vendas
      pilar2: 8.6,  // Digital
      pilar3: 11.2, // Finanças
      pilar4: 8.4,  // Processos
      pilar5: 9.2,  // Estratégia
    },
    topStrengthSector: 'Relacionamento direto no ponto de venda e giro de caixa imediato',
    topBottleneckSector: 'Ausência de CRM para pós-venda e presença digital focada apenas em redes sociais sem conversão',
    description: 'Empresas de comércio varejista e atacadista de São João del-Rei e microrregião.',
  },
  alimentacao: {
    segment: 'alimentacao',
    name: 'Alimentação & Gastronomia',
    sampleSize: 96,
    averageIme: 44.5,
    averageIcd: 49.0,
    pillarAverages: {
      pilar1: 10.1,
      pilar2: 11.2,
      pilar3: 8.8,
      pilar4: 7.6,
      pilar5: 6.8,
    },
    topStrengthSector: 'Agilidade de atendimento presencial e boa utilização de WhatsApp/Cardápios digitais',
    topBottleneckSector: 'Controle de CMV (Custo de Mercadoria Vendida), ficha técnica e alta rotatividade de funcionários',
    description: 'Restaurantes, bares, cafeterias, padarias e deliveries regionais.',
  },
  servicos_empresariais: {
    segment: 'servicos_empresariais',
    name: 'Serviços B2B & Empresariais',
    sampleSize: 112,
    averageIme: 53.6,
    averageIcd: 51.4,
    pillarAverages: {
      pilar1: 10.8,
      pilar2: 10.5,
      pilar3: 11.9,
      pilar4: 10.2,
      pilar5: 10.2,
    },
    topStrengthSector: 'Qualidade técnica dos serviços e fidelização orgânica de clientes recorrentes',
    topBottleneckSector: 'Funil estruturado de prospecção ativa e rotina disciplinada de follow-up',
    description: 'Consultorias, contabilidades, agências, escritórios de advocacia e arquitetura/engenharia.',
  },
  servicos_pessoais: {
    segment: 'servicos_pessoais',
    name: 'Serviços Pessoais, Beleza & Bem-Estar',
    sampleSize: 78,
    averageIme: 43.1,
    averageIcd: 45.8,
    pillarAverages: {
      pilar1: 9.6,
      pilar2: 10.8,
      pilar3: 8.4,
      pilar4: 7.2,
      pilar5: 7.1,
    },
    topStrengthSector: 'Fidelidade de clientes e presença visual ativa no Instagram e WhatsApp',
    topBottleneckSector: 'Separação de contas PJ/PF, precificação baseada em custos e planejamento tributário',
    description: 'Salões de beleza, barbearias, academias, estéticas e estúdios.',
  },
  saude: {
    segment: 'saude',
    name: 'Saúde & Clínicas',
    sampleSize: 64,
    averageIme: 55.2,
    averageIcd: 48.6,
    pillarAverages: {
      pilar1: 10.2,
      pilar2: 9.4,
      pilar3: 13.1,
      pilar4: 11.8,
      pilar5: 10.7,
    },
    topStrengthSector: 'Controles operacionais rigorosos e estabilidade de fluxo de caixa',
    topBottleneckSector: 'Marketing médico em conformidade com conselhos e captação de pacientes particulares',
    description: 'Consultórios, clínicas odontológicas, laboratórios e centros de reabilitação.',
  },
  educacao: {
    segment: 'educacao',
    name: 'Educação & Treinamentos',
    sampleSize: 42,
    averageIme: 51.0,
    averageIcd: 54.2,
    pillarAverages: {
      pilar1: 9.8,
      pilar2: 11.5,
      pilar3: 10.4,
      pilar4: 9.8,
      pilar5: 9.5,
    },
    topStrengthSector: 'Metodologia de ensino e adoção de ferramentas digitais em sala',
    topBottleneckSector: 'Ciclos de retenção anual de matrículas e sazonalidade financeira',
    description: 'Escolas, cursos de idiomas, centros de treinamento e reforço escolar.',
  },
  industria: {
    segment: 'industria',
    name: 'Indústria & Manufatura',
    sampleSize: 58,
    averageIme: 62.4,
    averageIcd: 46.2,
    pillarAverages: {
      pilar1: 11.6,
      pilar2: 8.1,
      pilar3: 14.5,
      pilar4: 15.2,
      pilar5: 13.0,
    },
    topStrengthSector: 'Controle de produção, processos padronizados e gestão financeira estruturada',
    topBottleneckSector: 'Presença digital institucional e automação comercial para expansão de novos canais',
    description: 'Laticínios, cerâmicas, marcenarias industriais, metalmecânica e confecções.',
  },
  construcao: {
    segment: 'construcao',
    name: 'Construção Civil & Reformas',
    sampleSize: 51,
    averageIme: 49.5,
    averageIcd: 38.8,
    pillarAverages: {
      pilar1: 10.5,
      pilar2: 6.8,
      pilar3: 11.8,
      pilar4: 10.9,
      pilar5: 9.5,
    },
    topStrengthSector: 'Execução de obras e relacionamento direto com fornecedores e mestres',
    topBottleneckSector: 'Digitalização de orçamentos, baixa maturidade digital e controle de desperdício',
    description: 'Empreiteiras, construtoras, instaladoras e comércio especializado de materiais.',
  },
  transporte_logistica: {
    segment: 'transporte_logistica',
    name: 'Transporte & Logística',
    sampleSize: 37,
    averageIme: 52.8,
    averageIcd: 47.5,
    pillarAverages: {
      pilar1: 9.9,
      pilar2: 8.2,
      pilar3: 12.6,
      pilar4: 12.4,
      pilar5: 9.7,
    },
    topStrengthSector: 'Pontualidade de rotas e acompanhamento de frotas',
    topBottleneckSector: 'Gestão de custos de combustível/manutenção preventiva e captação ativa de fretes',
    description: 'Transportadoras, distribuidores locais e serviços de entrega rápida.',
  },
  tecnologia: {
    segment: 'tecnologia',
    name: 'Tecnologia & Inovação',
    sampleSize: 33,
    averageIme: 68.2,
    averageIcd: 79.5,
    pillarAverages: {
      pilar1: 12.5,
      pilar2: 16.4,
      pilar3: 12.8,
      pilar4: 14.1,
      pilar5: 12.4,
    },
    topStrengthSector: 'Ferramentas digitais na nuvem, segurança e automações operacionais',
    topBottleneckSector: 'Previsibilidade comercial, estruturação de propostas corporativas e escala',
    description: 'Startups, software houses, provedores e agências de tecnologia.',
  },
  outro: {
    segment: 'outro',
    name: 'Outros Segmentos',
    sampleSize: 45,
    averageIme: 48.0,
    averageIcd: 44.0,
    pillarAverages: {
      pilar1: 10.0,
      pilar2: 9.0,
      pilar3: 10.5,
      pilar4: 9.5,
      pilar5: 9.0,
    },
    topStrengthSector: 'Capacidade de adaptação a demandas locais de clientes',
    topBottleneckSector: 'Sistematização de processos e investimento contínuo em capacitação',
    description: 'Negócios multissetoriais e atividades não catalogadas nas demais opções.',
  },
  geral: {
    segment: 'geral',
    name: 'Média Geral de Todos os Setores (São João del-Rei)',
    sampleSize: 742,
    averageIme: 50.4,
    averageIcd: 47.8,
    pillarAverages: {
      pilar1: 10.4, // Vendas
      pilar2: 9.7,  // Digital
      pilar3: 11.4, // Finanças
      pilar4: 10.1, // Processos
      pilar5: 9.4,  // Estratégia
    },
    topStrengthSector: 'Proximidade com o público local e dedicação direta dos fundadores/sócios',
    topBottleneckSector: 'Planejamento comercial proativo, presença digital estruturada e disciplina no fluxo de caixa',
    description: 'Média consolidada das 742 empresas participantes do programa Cresce Del-Rei na região.',
  },
};

/**
 * Retorna o benchmark de referência para o segmento especificado
 */
export function getSegmentBenchmark(segment: BusinessSegment | string): SegmentBenchmark {
  if (segment in SEGMENT_BENCHMARKS) {
    return SEGMENT_BENCHMARKS[segment];
  }
  return SEGMENT_BENCHMARKS.comercio;
}

/**
 * Calcula o percentil aproximado do negócio em relação à sua amostra regional
 */
export function calculateEstimatedPercentile(userScore: number, averageScore: number): number {
  // Desvio padrão típico de ~15 pontos numa escala de 0 a 100
  const stdDev = 15;
  const z = (userScore - averageScore) / stdDev;
  
  // Aproximação da função de distribuição acumulada normal
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  if (z > 0) {
    p = 1 - p;
  }
  
  const percentile = Math.round((1 - p) * 100);
  return Math.min(99, Math.max(5, percentile));
}
