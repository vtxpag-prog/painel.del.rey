import { Consultant } from '../types/diagnosis';

export const INITIAL_CONSULTANTS: Consultant[] = [
  {
    id: 'cst-aci-01',
    fullName: 'Carlos Alberto Nogueira',
    cpf: '234.567.890-12',
    email: 'carlos.consultoria@acidelrei.org.br',
    phoneWhatsapp: '(32) 98844-3322',
    specialty: 'Gestão Financeira, Fluxo de Caixa e Formação de Preço',
    entity: 'ACI Del-Rei',
    calendlyUrl: 'https://calendly.com/acidelrei-carlos/devolutiva-cresce-delrei',
    bio: 'Especialista em finanças empresariais e reestruturação de fluxo de caixa para empresas de São João del-Rei há mais de 12 anos.',
    password: 'consultor123',
    isActive: true,
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'cst-aci-02',
    fullName: 'Luciana Resende Valle',
    cpf: '345.678.901-23',
    email: 'luciana.consultoria@acidelrei.org.br',
    phoneWhatsapp: '(32) 99122-4455',
    specialty: 'Gestão Comercial, Canais de Vendas e Atendimento',
    entity: 'ACI Del-Rei',
    calendlyUrl: 'https://calendly.com/acidelrei-luciana/devolutiva-cresce-delrei',
    bio: 'Consultora de expansão comercial, funil de vendas e capacitação de equipes de atendimento no varejo e serviços.',
    password: 'consultor123',
    isActive: true,
    createdAt: '2026-01-20T10:00:00.000Z',
  },
  {
    id: 'cst-vtx-01',
    fullName: 'Thiago Moreira Alvarenga',
    cpf: '456.789.012-34',
    email: 'thiago@vortextecnologia.com.br',
    phoneWhatsapp: '(32) 99911-8877',
    specialty: 'Presença Digital, Google Perfil, Tráfego Local e WhatsApp',
    entity: 'Vortex',
    calendlyUrl: 'https://calendly.com/vortex-thiago/diagnostico-devolutiva',
    bio: 'Especialista em aquisição de clientes pela internet, posicionamento local no Google e automações no WhatsApp Business.',
    password: 'consultor123',
    isActive: true,
    createdAt: '2026-02-01T10:00:00.000Z',
  },
  {
    id: 'cst-vtx-02',
    fullName: 'Fernanda Silveira Guimarães',
    cpf: '567.890.123-45',
    email: 'fernanda@vortextecnologia.com.br',
    phoneWhatsapp: '(32) 99888-5544',
    specialty: 'Mapeamento de Processos, Automação No-Code e IA Responsável',
    entity: 'Vortex',
    calendlyUrl: 'https://calendly.com/vortex-fernanda/diagnostico-devolutiva',
    bio: 'Arquiteta de processos empresariais e transformação digital com foco em redução de retrabalho e eficiência operacional.',
    password: 'consultor123',
    isActive: true,
    createdAt: '2026-02-10T10:00:00.000Z',
  },
];

export function getStoredConsultants(): Consultant[] {
  try {
    const raw = localStorage.getItem('cresce_delrei_consultants');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar consultores salvos:', err);
  }
  return INITIAL_CONSULTANTS;
}

export function saveStoredConsultants(consultants: Consultant[]): void {
  try {
    localStorage.setItem('cresce_delrei_consultants', JSON.stringify(consultants));
  } catch (err) {
    console.error('Erro ao salvar consultores:', err);
  }
}
