export type BusinessSegment =
  | 'comercio'
  | 'alimentacao'
  | 'servicos_pessoais'
  | 'saude'
  | 'educacao'
  | 'transporte_logistica'
  | 'construcao'
  | 'industria'
  | 'servicos_empresariais'
  | 'tecnologia'
  | 'outro';

export type CompanyRevenueTier =
  | 'mei'
  | 'micro'
  | 'pequena'
  | 'media'
  | 'grande'
  | 'prefiro_nao_informar';

export type CompanyAge =
  | 'menos_1_ano'
  | '1_a_3_anos'
  | '4_a_10_anos'
  | 'mais_10_anos';

export type TeamSize =
  | 'somente_socios'
  | '2_a_5'
  | '6_a_10'
  | '11_a_30'
  | 'mais_30';

export type MainGoal =
  | 'mais_clientes'
  | 'aumentar_vendas'
  | 'organizar_financas'
  | 'melhorar_processos'
  | 'digitalizar'
  | 'equipe'
  | 'expandir'
  | 'reduzir_custos'
  | 'outro';

export type MainBottleneck =
  | 'falta_clientes'
  | 'pouca_divulgacao'
  | 'baixa_conversao'
  | 'fluxo_caixa'
  | 'margem_preco'
  | 'processos_manuais'
  | 'falta_equipe'
  | 'tecnologia'
  | 'planejamento'
  | 'outra';

export interface Consents {
  dataProcessing: boolean; // Obrigatória
  marketingContact: boolean; // Opcional
  consultantFollowup: boolean; // Opcional
  partnerReferral: boolean; // Opcional e específica
  consentedAt: string;
  policyVersion: string;
}

export interface CompanyData {
  corporateName: string; // Razão Social
  tradeName?: string; // Nome Fantasia
  cnpj: string;
  segment: BusinessSegment;
  revenueTier: CompanyRevenueTier;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  whatsapp: string;
  businessEmail: string;
  website?: string;
  socialMedia?: string;
}

export interface RespondentData {
  fullName: string;
  role: string;
  phoneWhatsapp: string;
  email: string;
  relationship: 'socio_proprietario' | 'diretor' | 'gerente' | 'financeiro_comercial' | 'outro';
  isAuthorized: boolean;
}

export interface BusinessProfile {
  segment: BusinessSegment;
  age: CompanyAge;
  teamSize: TeamSize;
  mainGoal: MainGoal;
  mainBottleneck: MainBottleneck;
}

export type MaturityScore = 0 | 1 | 2 | 3 | 4;

export interface QuestionDefinition {
  id: string; // e.g. P1.1
  pillarId: 'pilar1' | 'pilar2' | 'pilar3' | 'pilar4' | 'pilar5' | 'complementar';
  title: string;
  description: string;
  options: {
    score: MaturityScore;
    label: string;
    detail: string;
    example: string;
  }[];
}

export interface PillarScore {
  pillarId: string;
  name: string;
  score: number; // 0 to 20
  percentage: number; // 0 to 100%
  classification: 'Crítico' | 'Básico' | 'Estruturado' | 'Competitivo' | 'Alta Performance';
  color: string;
  description: string;
}

export interface BottleneckAlert {
  id: string;
  level: 'critico' | 'atencao';
  title: string;
  description: string;
  actionRequired: string;
}

export interface ActionPlanItem {
  id: string;
  horizon: '30_dias' | '90_dias' | '12_meses';
  action: string;
  impact: 'Alto' | 'Médio';
  effort: 'Baixo' | 'Médio' | 'Alto';
  urgency: 'Imediata' | 'Alta' | 'Média';
  timeframe: string;
  responsible: string;
  metric: string;
}

export interface DiagnosisResult {
  id: string;
  createdAt: string;
  isDemo?: boolean;
  demoLabel?: string;
  company: CompanyData;
  respondent: RespondentData;
  profile: BusinessProfile;
  consents: Consents;
  answers: Record<string, MaturityScore>;
  complementaryAnswers: Record<string, MaturityScore | 'na'>;
  
  // Calculated metrics
  pillarScores: Record<string, PillarScore>;
  ime: number; // 0 to 100
  imeClassification: 'Crítico' | 'Básico' | 'Estruturado' | 'Competitivo' | 'Alta Performance';
  imeMessage: string;
  confidenceLevel: 'Baixo' | 'Médio' | 'Alto' | 'Validado';
  icd: number; // 0 to 100
  icdClassification: 'Digitalmente Invisível' | 'Presença Inicial' | 'Digitalmente Estruturada' | 'Empresa Digital';
  
  alerts: BottleneckAlert[];
  strengths: { title: string; evidence: string; whyImportant: string; howToLeverage: string }[];
  bottlenecks: { title: string; problem: string; impact: string; priority: string; risk: string; recommendedAction: string }[];
  actionPlan: ActionPlanItem[];
  supportTrails: { category: string; description: string; priority: 'alta' | 'media' | 'baixa' }[];
  
  // Meeting scheduled
  scheduledMeeting?: ScheduledMeeting;

  // Atribuição de Consultor
  assignedConsultantId?: string;
  assignedConsultantName?: string;
  consultantReassignments?: ConsultantReassignment[];
  meetingBookingMethod?: 'calendly' | 'direto';
}

export interface Consultant {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  phoneWhatsapp: string;
  specialty: string; // Especialidade em consultoria
  entity: 'ACI Del-Rei' | 'Vortex';
  calendlyUrl: string; // Link oficial do Calendly do consultor
  bio?: string;
  password?: string; // Senha para login do consultor
  isActive: boolean;
  createdAt: string;
}

export interface ConsultantReassignment {
  id: string;
  reassignedAt: string;
  previousConsultantId?: string;
  previousConsultantName?: string;
  newConsultantId: string;
  newConsultantName: string;
  reason: string; // Motivo obrigatório da troca inserido pelo administrador
  adminUser: string;
}

export interface ScheduledMeeting {
  id: string;
  diagnosisId: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  entity: 'ACI Del-Rei' | 'Vortex';
  consultantName: string;
  consultantId?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  meetLink: string;
  status: 'confirmada' | 'cancelada' | 'remarcada';
  isDemo: boolean;
  notes?: string;
}
