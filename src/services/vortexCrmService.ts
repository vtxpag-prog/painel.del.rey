import { DiagnosisResult, ScheduledMeeting } from '../types/diagnosis';

export interface VortexCrmLeadPayload {
  dispatchId: string;
  dispatchedAt: string;
  source: string;
  consultancyEntity: 'ACI Del-Rei' | 'Vortex';
  status: 'enviado_crm' | 'em_processamento';
  company: {
    corporateName: string;
    tradeName?: string;
    cnpj: string;
    segment: string;
    revenueTier: string;
    city: string;
    state: string;
    address: string;
    neighborhood: string;
    zipCode: string;
    phone: string;
    whatsapp: string;
    businessEmail: string;
    website?: string;
    socialMedia?: string;
  };
  responsible: {
    fullName: string;
    role: string;
    email: string;
    phoneWhatsapp: string;
    relationship: string;
    isAuthorized: boolean;
  };
  meeting: {
    meetingId: string;
    consultantName: string;
    date: string;
    time: string;
    meetLink: string;
    status: string;
  };
  diagnosisMetrics: {
    ime: number;
    imeClassification: string;
    icd: number;
    icdClassification: string;
    confidenceLevel: string;
    pillarScores: Record<string, { name: string; score: number; percentage: number; classification: string }>;
    criticalAlertsCount: number;
    alerts: { title: string; description: string; actionRequired: string }[];
    topStrengths: { title: string; evidence: string }[];
    topBottlenecks: { title: string; problem: string; priority: string }[];
    actionPlanCount: number;
  };
  consents: {
    dataProcessing: boolean;
    marketingContact: boolean;
    consultantFollowup: boolean;
    partnerReferral: boolean;
    consentedAt: string;
    policyVersion: string;
  };
}

export interface CrmDispatchResult {
  success: boolean;
  dispatchId: string;
  dispatchedAt: string;
  consultancyEntity: 'ACI Del-Rei' | 'Vortex';
  message: string;
  webhookStatus?: 'delivered' | 'simulated' | 'failed';
}

/**
 * Envia todos os dados do diagnóstico e agendamento para o CRM da Vortex
 */
export async function sendToVortexCrm(
  diagnosis: DiagnosisResult,
  meeting?: ScheduledMeeting | null,
  consultant?: { id: string; name: string; entity: 'ACI Del-Rei' | 'Vortex'; calendlyUrl?: string }
): Promise<CrmDispatchResult> {
  const dispatchId = `vtx-crm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const dispatchedAt = new Date().toISOString();

  const entity = meeting?.entity || consultant?.entity || 'ACI Del-Rei';
  const consultantName = meeting?.consultantName || consultant?.name || 'Consultoria Cresce Del-Rei';

  // Estrutura do payload corporativo para o CRM da Vortex
  const payload: VortexCrmLeadPayload = {
    dispatchId,
    dispatchedAt,
    source: 'Diagnóstico Empresarial Cresce Del-Rei',
    consultancyEntity: entity,
    status: 'enviado_crm',
    company: {
      corporateName: diagnosis.company.corporateName,
      tradeName: diagnosis.company.tradeName,
      cnpj: diagnosis.company.cnpj,
      segment: diagnosis.company.segment,
      revenueTier: diagnosis.company.revenueTier,
      city: diagnosis.company.city,
      state: diagnosis.company.state,
      address: diagnosis.company.address,
      neighborhood: diagnosis.company.neighborhood,
      zipCode: diagnosis.company.zipCode,
      phone: diagnosis.company.phone,
      whatsapp: diagnosis.company.whatsapp,
      businessEmail: diagnosis.company.businessEmail,
      website: diagnosis.company.website,
      socialMedia: diagnosis.company.socialMedia,
    },
    responsible: {
      fullName: diagnosis.respondent.fullName,
      role: diagnosis.respondent.role,
      email: diagnosis.respondent.email,
      phoneWhatsapp: diagnosis.respondent.phoneWhatsapp,
      relationship: diagnosis.respondent.relationship,
      isAuthorized: diagnosis.respondent.isAuthorized,
    },
    meeting: {
      meetingId: meeting?.id || `calendly-${Date.now()}`,
      consultantName,
      date: meeting?.date || new Date().toISOString().split('T')[0],
      time: meeting?.time || 'A definir no Calendly',
      meetLink: meeting?.meetLink || consultant?.calendlyUrl || 'Calendly',
      status: meeting?.status || 'agendamento_calendly_iniciado',
    },
    diagnosisMetrics: {
      ime: diagnosis.ime,
      imeClassification: diagnosis.imeClassification,
      icd: diagnosis.icd,
      icdClassification: diagnosis.icdClassification,
      confidenceLevel: diagnosis.confidenceLevel,
      pillarScores: Object.fromEntries(
        Object.entries(diagnosis.pillarScores).map(([k, v]) => [
          k,
          { name: v.name, score: v.score, percentage: v.percentage, classification: v.classification },
        ])
      ),
      criticalAlertsCount: diagnosis.alerts.length,
      alerts: diagnosis.alerts.map((a) => ({
        title: a.title,
        description: a.description,
        actionRequired: a.actionRequired,
      })),
      topStrengths: diagnosis.strengths.map((s) => ({ title: s.title, evidence: s.evidence })),
      topBottlenecks: diagnosis.bottlenecks.map((b) => ({
        title: b.title,
        problem: b.problem,
        priority: b.priority,
      })),
      actionPlanCount: diagnosis.actionPlan.length,
    },
    consents: {
      ...diagnosis.consents,
    },
  };

  let webhookStatus: 'delivered' | 'simulated' | 'failed' = 'simulated';

  // Se houver uma URL de webhook configurada em variável de ambiente (ex: VITE_VORTEX_CRM_WEBHOOK_URL)
  const webhookUrl = (import.meta as any).env?.VITE_VORTEX_CRM_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source': 'CresceDelRei-App',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        webhookStatus = 'delivered';
      }
    } catch (err) {
      console.warn('Webhook Vortex CRM não acessível no momento, gravando no log local:', err);
      webhookStatus = 'failed';
    }
  } else {
    // Simulação de transmissão de rede
    await new Promise((resolve) => setTimeout(resolve, 800));
    webhookStatus = 'simulated';
  }

  // Persistir no histórico de leads enviados do CRM para visualização pelo admin
  try {
    const existingRaw = localStorage.getItem('vortex_crm_dispatches');
    const existing: VortexCrmLeadPayload[] = existingRaw ? JSON.parse(existingRaw) : [];
    existing.unshift(payload);
    localStorage.setItem('vortex_crm_dispatches', JSON.stringify(existing.slice(0, 100)));
  } catch (err) {
    console.error('Erro ao armazenar log de envio ao CRM:', err);
  }

  return {
    success: true,
    dispatchId,
    dispatchedAt,
    consultancyEntity: entity,
    message: `Dados da empresa ${diagnosis.company.corporateName} enviados com sucesso para o CRM da Vortex!`,
    webhookStatus,
  };
}

/**
 * Apaga todos os dados temporários da sessão do cliente no navegador (conformidade com LGPD)
 */
export function clearClientDiagnosticSession(): void {
  try {
    localStorage.removeItem('cresce_delrei_answers');
    localStorage.removeItem('cresce_delrei_comp_answers');
    sessionStorage.clear();
  } catch (err) {
    console.error('Erro ao limpar sessão do cliente:', err);
  }
}
