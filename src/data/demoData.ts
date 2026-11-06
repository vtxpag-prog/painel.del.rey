import { DiagnosisResult, MaturityScore } from '../types/diagnosis';
import { buildCompleteDiagnosisResult } from '../utils/scoring';

/**
 * Casos de Demonstração oficiais conforme item 16 do Prompt Mestre:
 * 1. Microempresa com baixa presença digital e boa organização financeira;
 * 2. Empresa de serviços com boa presença digital, mas baixa gestão comercial;
 * 3. Empresa estruturada com bom resultado geral e oportunidade de automação.
 */

// CASO 1: Mecânica e Autopeças Dom Bosco Ltda ME (Boa organização financeira, baixa presença digital)
const answersCaso1: Record<string, MaturityScore> = {
  // P1: Vendas (médio/baixo)
  'P1.1': 2,
  'P1.2': 1,
  'P1.3': 1,
  'P1.4': 1,
  'P1.5': 1,
  // P2: Presença Digital (baixo - invisível)
  'P2.1': 0,
  'P2.2': 1,
  'P2.3': 1,
  'P2.4': 0,
  'P2.5': 0,
  // P3: Finanças (forte)
  'P3.1': 3,
  'P3.2': 3,
  'P3.3': 3,
  'P3.4': 3,
  'P3.5': 2,
  // P4: Operações (médio)
  'P4.1': 2,
  'P4.2': 2,
  'P4.3': 1,
  'P4.4': 1,
  'P4.5': 2,
  // P5: Estratégia (médio)
  'P5.1': 2,
  'P5.2': 1,
  'P5.3': 2,
  'P5.4': 1,
  'P5.5': 0,
};

export const DEMO_CASE_1: DiagnosisResult = buildCompleteDiagnosisResult(
  {
    corporateName: 'Oficina Mecânica Dom Bosco Ltda ME',
    tradeName: 'Auto Mecânica Dom Bosco',
    cnpj: '11.428.187/0001-44', // CNPJ com DV válido fictício
    segment: 'comercio',
    revenueTier: 'micro',
    address: 'Rua das Mercês, 142',
    neighborhood: 'Centro Histórico',
    city: 'São João del-Rei',
    state: 'MG',
    zipCode: '36300-012',
    phone: '(32) 3371-2090',
    whatsapp: '(32) 98845-1200',
    businessEmail: 'contato@mecanicadombosco.com.br',
    website: '',
    socialMedia: '@mecanica_dombosco_sjr',
  },
  {
    fullName: 'Carlos Eduardo Resende',
    role: 'Sócio-Proprietário',
    phoneWhatsapp: '(32) 98845-1200',
    email: 'carlos@mecanicadombosco.com.br',
    relationship: 'socio_proprietario',
    isAuthorized: true,
  },
  {
    segment: 'comercio',
    age: 'mais_10_anos',
    teamSize: '2_a_5',
    mainGoal: 'mais_clientes',
    mainBottleneck: 'pouca_divulgacao',
  },
  {
    dataProcessing: true,
    marketingContact: true,
    consultantFollowup: true,
    partnerReferral: false,
    consentedAt: '2026-03-10T14:20:00.000Z',
    policyVersion: '1.0',
  },
  answersCaso1,
  {
    'C.1': 3,
    'C.2': 3,
    'C.3': 1,
    'C.4': 2,
    'C.5': 1,
  },
  true,
  'Caso 1: Microempresa com boa finança e baixa presença digital'
);

// CASO 2: Estúdio & Consultoria Arquitetura Del-Rei (Boa presença digital, baixa gestão comercial)
const answersCaso2: Record<string, MaturityScore> = {
  // P1: Vendas (baixo - funil fraco)
  'P1.1': 2,
  'P1.2': 2,
  'P1.3': 0,
  'P1.4': 1,
  'P1.5': 0,
  // P2: Digital (forte)
  'P2.1': 3,
  'P2.2': 3,
  'P2.3': 3,
  'P2.4': 3,
  'P2.5': 2,
  // P3: Finanças (médio)
  'P3.1': 2,
  'P3.2': 1,
  'P3.3': 1,
  'P3.4': 2,
  'P3.5': 1,
  // P4: Operações (médio)
  'P4.1': 2,
  'P4.2': 3,
  'P4.3': 1,
  'P4.4': 1,
  'P4.5': 2,
  // P5: Estratégia (médio)
  'P5.1': 2,
  'P5.2': 1,
  'P5.3': 2,
  'P5.4': 2,
  'P5.5': 2,
};

export const DEMO_CASE_2: DiagnosisResult = buildCompleteDiagnosisResult(
  {
    corporateName: 'Studio Vertente Arquitetura & Design Ltda',
    tradeName: 'Vertente Arquitetura',
    cnpj: '45.123.890/0001-92',
    segment: 'servicos_empresariais',
    revenueTier: 'pequena',
    address: 'Avenida Leite de Castro, 850, Sala 302',
    neighborhood: 'Fábricas',
    city: 'São João del-Rei',
    state: 'MG',
    zipCode: '36301-180',
    phone: '(32) 3372-5500',
    whatsapp: '(32) 99123-4567',
    businessEmail: 'projetos@vertentearq.com.br',
    website: 'https://vertentearq.com.br',
    socialMedia: '@vertentearquitetura',
  },
  {
    fullName: 'Mariana Silveira Guimarães',
    role: 'Diretora Criativa e Sócia',
    phoneWhatsapp: '(32) 99123-4567',
    email: 'mariana@vertentearq.com.br',
    relationship: 'socio_proprietario',
    isAuthorized: true,
  },
  {
    segment: 'servicos_empresariais',
    age: '4_a_10_anos',
    teamSize: '6_a_10',
    mainGoal: 'aumentar_vendas',
    mainBottleneck: 'baixa_conversao',
  },
  {
    dataProcessing: true,
    marketingContact: true,
    consultantFollowup: true,
    partnerReferral: true,
    consentedAt: '2026-03-12T10:15:00.000Z',
    policyVersion: '1.0',
  },
  answersCaso2,
  {
    'S.1': 2,
    'S.2': 1,
    'S.3': 2,
    'S.4': 3,
    'S.5': 1,
  },
  true,
  'Caso 2: Serviços com boa presença digital e baixa gestão comercial'
);

// CASO 3: Indústria de Laticínios e Doces São João (Estruturada, alta maturidade, oportunidade de automação e escala)
const answersCaso3: Record<string, MaturityScore> = {
  // P1: Vendas (estruturado)
  'P1.1': 3,
  'P1.2': 3,
  'P1.3': 3,
  'P1.4': 3,
  'P1.5': 3,
  // P2: Presença Digital (estruturado)
  'P2.1': 3,
  'P2.2': 3,
  'P2.3': 3,
  'P2.4': 3,
  'P2.5': 2,
  // P3: Finanças (competitivo)
  'P3.1': 4,
  'P3.2': 3,
  'P3.3': 3,
  'P3.4': 4,
  'P3.5': 3,
  // P4: Operações (estruturado, automação inicial)
  'P4.1': 3,
  'P4.2': 3,
  'P4.3': 3,
  'P4.4': 2, // oportunidade de automação
  'P4.5': 3,
  // P5: Estratégia (estruturado)
  'P5.1': 3,
  'P5.2': 3,
  'P5.3': 3,
  'P5.4': 3,
  'P5.5': 2, // oportunidade de IA responsável
};

export const DEMO_CASE_3: DiagnosisResult = buildCompleteDiagnosisResult(
  {
    corporateName: 'Doces & Sabores Del-Rei Indústria de Alimentos S.A.',
    tradeName: 'Laticínios Del-Rei Artesanal',
    cnpj: '03.882.451/0001-19',
    segment: 'industria',
    revenueTier: 'media',
    address: 'Rodovia BR-265, Km 258, Distrito Industrial',
    neighborhood: 'Colônia do Marçal',
    city: 'São João del-Rei',
    state: 'MG',
    zipCode: '36302-300',
    phone: '(32) 3373-1000',
    whatsapp: '(32) 99988-7711',
    businessEmail: 'diretoria@laticiniosdelrei.ind.br',
    website: 'https://laticiniosdelrei.ind.br',
    socialMedia: '@laticiniosdelrei',
  },
  {
    fullName: 'Roberto Antônio Alvarenga',
    role: 'Gerente Geral de Operações',
    phoneWhatsapp: '(32) 99988-7711',
    email: 'roberto@laticiniosdelrei.ind.br',
    relationship: 'diretor',
    isAuthorized: true,
  },
  {
    segment: 'industria',
    age: 'mais_10_anos',
    teamSize: '11_a_30',
    mainGoal: 'melhorar_processos',
    mainBottleneck: 'processos_manuais',
  },
  {
    dataProcessing: true,
    marketingContact: true,
    consultantFollowup: true,
    partnerReferral: true,
    consentedAt: '2026-03-14T16:45:00.000Z',
    policyVersion: '1.0',
  },
  answersCaso3,
  {
    'I.1': 3,
    'I.2': 3,
    'I.3': 4,
    'I.4': 3,
    'I.5': 4,
  },
  true,
  'Caso 3: Indústria estruturada com oportunidade de automação e escala'
);

DEMO_CASE_1.assignedConsultantId = 'cst-aci-01';
DEMO_CASE_1.assignedConsultantName = 'Carlos Alberto Nogueira';

DEMO_CASE_2.assignedConsultantId = 'cst-aci-02';
DEMO_CASE_2.assignedConsultantName = 'Luciana Resende Valle';

DEMO_CASE_3.assignedConsultantId = 'cst-vtx-01';
DEMO_CASE_3.assignedConsultantName = 'Thiago Moreira Alvarenga';

export const ALL_DEMO_CASES: DiagnosisResult[] = [
  DEMO_CASE_1,
  DEMO_CASE_2,
  DEMO_CASE_3,
];
