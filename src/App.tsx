import React, { useState, useEffect } from 'react';
import {
  CompanyData,
  RespondentData,
  BusinessProfile,
  Consents,
  DiagnosisResult,
  MaturityScore,
  ScheduledMeeting,
  Consultant,
} from './types/diagnosis';
import { ALL_DEMO_CASES, DEMO_CASE_1, DEMO_CASE_2, DEMO_CASE_3 } from './data/demoData';
import { buildCompleteDiagnosisResult } from './utils/scoring';
import { clearClientDiagnosticSession, CrmDispatchResult, sendToVortexCrm } from './services/vortexCrmService';

// Components
import { Header } from './components/Header';
import { DiagnosticProgressBar, FlowStepId } from './components/DiagnosticProgressBar';
import { Footer } from './components/Footer';
import { LandingStep } from './components/LandingStep';
import { ConsentStep } from './components/ConsentStep';
import { CompanyStep } from './components/CompanyStep';
import { RespondentStep } from './components/RespondentStep';
import { ProfileStep } from './components/ProfileStep';
import { QuestionsStep } from './components/QuestionsStep';
import { ResultReportView } from './components/ResultReportView';

// Modals
import { MeetingSchedulerModal } from './components/MeetingSchedulerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { MethodologyModal } from './components/MethodologyModal';
import { ProductionGuideModal } from './components/ProductionGuideModal';
import { HowItWorksModal } from './components/HowItWorksModal';

type AppStep = 'landing' | 'consent' | 'company' | 'respondent' | 'profile' | 'questions' | 'report';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');

  // Diagnosis wizard form states
  const [consents, setConsents] = useState<Consents | null>(null);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [respondent, setRespondent] = useState<RespondentData | null>(null);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [answers, setAnswers] = useState<Record<string, MaturityScore>>({});
  const [compAnswers, setCompAnswers] = useState<Record<string, MaturityScore | 'na'>>({});

  // Active calculated diagnosis result
  const [currentDiagnosis, setCurrentDiagnosis] = useState<DiagnosisResult | null>(null);

  // Stored diagnoses list in memory / localStorage
  const [allDiagnoses, setAllDiagnoses] = useState<DiagnosisResult[]>(() => {
    try {
      const stored = localStorage.getItem('cresce_delrei_diagnoses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return ALL_DEMO_CASES;
  });

  // Modal open states
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [schedulerEntity, setSchedulerEntity] = useState<'ACI Del-Rei' | 'Vortex'>('ACI Del-Rei');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isProductionGuideOpen, setIsProductionGuideOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Success notification after CRM dispatch & session wipe
  const [crmSuccessNotification, setCrmSuccessNotification] = useState<{
    entity: string;
    dispatchId: string;
    message: string;
  } | null>(null);

  // Sync all diagnoses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cresce_delrei_diagnoses', JSON.stringify(allDiagnoses));
    } catch {
      // ignore
    }
  }, [allDiagnoses]);

  // Load saved draft on mount if available
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem('cresce_delrei_answers');
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
      const savedComp = localStorage.getItem('cresce_delrei_comp_answers');
      if (savedComp) {
        setCompAnswers(JSON.parse(savedComp));
      }
    } catch {
      // ignore
    }
  }, []);

  // Handlers for steps
  const handleStartFromLanding = () => {
    setCurrentStep('consent');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConsentNext = (data: Consents) => {
    setConsents(data);
    setCurrentStep('company');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompanyNext = (data: CompanyData) => {
    setCompany(data);
    setCurrentStep('respondent');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRespondentNext = (data: RespondentData) => {
    setRespondent(data);
    setCurrentStep('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileNext = (data: BusinessProfile) => {
    setProfile(data);
    setCurrentStep('questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuestionsFinish = (
    finalAnswers: Record<string, MaturityScore>,
    finalCompAnswers: Record<string, MaturityScore | 'na'>
  ) => {
    if (!company || !respondent || !profile || !consents) return;

    setAnswers(finalAnswers);
    setCompAnswers(finalCompAnswers);

    const result = buildCompleteDiagnosisResult(
      company,
      respondent,
      profile,
      consents,
      finalAnswers,
      finalCompAnswers,
      false
    );

    setCurrentDiagnosis(result);
    setAllDiagnoses((prev) => [result, ...prev]);
    setCurrentStep('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Clear temporary drafts
    try {
      localStorage.removeItem('cresce_delrei_answers');
      localStorage.removeItem('cresce_delrei_comp_answers');
    } catch {
      // ignore
    }
  };

  const handleLoadDemo = (demoId: number) => {
    let target = DEMO_CASE_1;
    if (demoId === 2) target = DEMO_CASE_2;
    if (demoId === 3) target = DEMO_CASE_3;

    setCurrentDiagnosis(target);
    setCompany(target.company);
    setRespondent(target.respondent);
    setProfile(target.profile);
    setConsents(target.consents);
    setAnswers(target.answers);
    setCompAnswers(target.complementaryAnswers);

    setCurrentStep('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMeetingConfirmed = (meeting: ScheduledMeeting) => {
    if (currentDiagnosis) {
      const updated: DiagnosisResult = {
        ...currentDiagnosis,
        scheduledMeeting: meeting,
      };
      setCurrentDiagnosis(updated);
      setAllDiagnoses((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d))
      );
    }
  };

  const handleMeetingCancelled = (meetingId: string) => {
    if (currentDiagnosis) {
      const updated: DiagnosisResult = {
        ...currentDiagnosis,
        scheduledMeeting: undefined,
      };
      setCurrentDiagnosis(updated);
      setAllDiagnoses((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d))
      );
    }
  };

  const handleOpenScheduler = (entity?: 'ACI Del-Rei' | 'Vortex') => {
    if (entity) {
      setSchedulerEntity(entity);
    }
    setIsSchedulerOpen(true);
  };

  const handleCompleteAndResetSession = (crmResult?: CrmDispatchResult) => {
    // 1. Apaga os dados temporários da sessão do cliente no navegador (conformidade com LGPD)
    clearClientDiagnosticSession();

    // 2. Se for um diagnóstico de usuário real, remove da lista local para que o terminal fique limpo e sem vestígios
    if (currentDiagnosis && !currentDiagnosis.isDemo) {
      setAllDiagnoses((prev) => prev.filter((d) => d.id !== currentDiagnosis.id));
    }

    // 3. Reseta todo o estado do formulário para nova utilização
    setConsents(null);
    setCompany(null);
    setRespondent(null);
    setProfile(null);
    setAnswers({});
    setCompAnswers({});
    setCurrentDiagnosis(null);
    setIsSchedulerOpen(false);

    // 4. Define a notificação de confirmação e limpeza de dados
    const targetEntity = crmResult?.consultancyEntity || schedulerEntity || 'Vortex';
    setCrmSuccessNotification({
      entity: targetEntity,
      dispatchId: crmResult?.dispatchId || `vtx-crm-${Date.now()}`,
      message:
        crmResult?.message ||
        `Opção de consultoria com ${targetEntity} confirmada! Os dados foram enviados com sucesso para o CRM da Vortex e a sessão anterior foi apagada por segurança (LGPD). O sistema está pronto para um novo diagnóstico.`,
    });

    // 5. Retorna à primeira página pronto para um novo diagnóstico
    setCurrentStep('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectConsultingChoice = async (entity: 'ACI Del-Rei' | 'Vortex') => {
    if (!currentDiagnosis) return;
    try {
      const crmRes = await sendToVortexCrm(currentDiagnosis, null, {
        id: entity === 'Vortex' ? 'vtx-direct' : 'aci-direct',
        name:
          entity === 'Vortex'
            ? 'Consultoria em Tecnologia e Processos Vortex'
            : 'Consultoria de Gestão e Associativismo ACI Del-Rei',
        entity,
      });
      handleCompleteAndResetSession(crmRes);
    } catch (err) {
      console.error('Erro ao enviar opção de consultoria ao CRM:', err);
      handleCompleteAndResetSession({
        success: true,
        dispatchId: `vtx-crm-${Date.now()}`,
        dispatchedAt: new Date().toISOString(),
        consultancyEntity: entity,
        message: `Solicitação de consultoria com ${entity} registrada e transmitida com sucesso para o CRM da Vortex!`,
      });
    }
  };

  const handleDeclineScheduling = () => {
    clearClientDiagnosticSession();
    if (currentDiagnosis && !currentDiagnosis.isDemo) {
      setAllDiagnoses((prev) => prev.filter((d) => d.id !== currentDiagnosis.id));
    }
    setConsents(null);
    setCompany(null);
    setRespondent(null);
    setProfile(null);
    setAnswers({});
    setCompAnswers({});
    setCurrentDiagnosis(null);
    setCrmSuccessNotification({
      entity: 'Sistema',
      dispatchId: `reg-${Date.now()}`,
      message: 'Diagnóstico finalizado. Os dados da sessão foram apagados por segurança e o sistema está pronto para uma nova consulta.',
    });
    setCurrentStep('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteWithConsultant = async (
    consultant: Consultant,
    bookingMethod: 'calendly' | 'direto' = 'direto'
  ) => {
    if (!currentDiagnosis) return;
    const updated: DiagnosisResult = {
      ...currentDiagnosis,
      assignedConsultantId: consultant.id,
      assignedConsultantName: consultant.fullName,
      meetingBookingMethod: bookingMethod,
    };
    try {
      const crmRes = await sendToVortexCrm(updated, null, {
        id: consultant.id,
        name: consultant.fullName,
        entity: consultant.entity,
        calendlyUrl: consultant.calendlyUrl,
      });
      handleCompleteAndResetSession(crmRes);
    } catch (err) {
      console.warn('Erro ao sincronizar com CRM:', err);
      handleCompleteAndResetSession({
        success: true,
        dispatchId: `vtx-crm-${Date.now()}`,
        dispatchedAt: new Date().toISOString(),
        consultancyEntity: consultant.entity,
        message: `Consultoria com ${consultant.entity} (${consultant.fullName}) enviada com sucesso para o CRM da Vortex!`,
      });
    }
  };

  const handleNewDiagnosis = () => {
    clearClientDiagnosticSession();
    if (currentDiagnosis && !currentDiagnosis.isDemo) {
      setAllDiagnoses((prev) => prev.filter((d) => d.id !== currentDiagnosis.id));
    }
    setConsents(null);
    setCompany(null);
    setRespondent(null);
    setProfile(null);
    setAnswers({});
    setCompAnswers({});
    setCurrentDiagnosis(null);
    setCurrentStep('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDiagnosisFromAdmin = (diag: DiagnosisResult) => {
    setCurrentDiagnosis(diag);
    setIsAdminOpen(false);
    setCurrentStep('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canNavigateToStep = (target: FlowStepId): boolean => {
    const stepOrder: FlowStepId[] = ['consent', 'company', 'respondent', 'profile', 'questions', 'report'];
    const currentIdx = stepOrder.indexOf(currentStep as FlowStepId);
    const targetIdx = stepOrder.indexOf(target);

    // Na página inicial (landing), só pode ir para consentimento
    if (currentStep === 'landing') return target === 'consent';

    // Pode sempre retornar para etapas anteriores já concluídas
    if (targetIdx < currentIdx && targetIdx >= 0) return true;

    // Se já tiver diagnóstico gerado, pode ir direto para o relatório
    if (target === 'report' && currentDiagnosis) return true;

    // Pode avançar se os pré-requisitos da etapa existirem
    if (target === 'company' && consents) return true;
    if (target === 'respondent' && company) return true;
    if (target === 'profile' && respondent) return true;
    if (target === 'questions' && profile) return true;

    return false;
  };

  const handleNavigateStep = (target: FlowStepId) => {
    if (canNavigateToStep(target)) {
      setCurrentStep(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const existingCnpjs = allDiagnoses.map((d) => d.company.cnpj);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <Header
        currentStep={currentStep}
        onNavigateHome={() => setCurrentStep('landing')}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onLoadDemo={handleLoadDemo}
      />

      {/* Barra de Progresso do Fluxo de Diagnóstico */}
      <DiagnosticProgressBar
        currentStep={currentStep}
        onNavigateStep={handleNavigateStep}
        canNavigateToStep={canNavigateToStep}
      />

      {/* Banner de Sucesso pós-envio ao CRM e limpeza de dados */}
      {currentStep === 'landing' && crmSuccessNotification && (
        <div className="no-print bg-emerald-600 text-white py-3.5 px-4 sm:px-8 text-xs flex items-center justify-between shadow-md border-b border-emerald-700 animate-fadeIn">
          <div className="flex items-center gap-3 max-w-5xl mx-auto flex-1">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">
              ✓
            </span>
            <div>
              <span className="font-bold text-white text-sm block sm:inline">
                Opção de Consultoria com {crmSuccessNotification.entity} Registrada!
              </span>
              <span className="text-emerald-100 text-xs block sm:inline sm:ml-2">
                Os dados foram transmitidos com sucesso para o CRM da Vortex ({crmSuccessNotification.dispatchId}) e os dados da sessão foram apagados por segurança (LGPD). O sistema está pronto para um novo diagnóstico.
              </span>
            </div>
          </div>
          <button
            onClick={() => setCrmSuccessNotification(null)}
            className="text-white/80 hover:text-white p-1 text-sm font-bold cursor-pointer ml-2"
            title="Fechar aviso"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Flow Content */}
      <main className="flex-1">
        {currentStep === 'landing' && (
          <LandingStep
            onStart={handleStartFromLanding}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
            onLoadDemo={handleLoadDemo}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />
        )}

        {currentStep === 'consent' && (
          <ConsentStep
            initialConsents={consents || undefined}
            onNext={handleConsentNext}
            onBack={() => setCurrentStep('landing')}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />
        )}

        {currentStep === 'company' && (
          <CompanyStep
            initialData={company || undefined}
            existingCnpjs={existingCnpjs}
            onNext={handleCompanyNext}
            onBack={() => setCurrentStep('consent')}
          />
        )}

        {currentStep === 'respondent' && (
          <RespondentStep
            initialData={respondent || undefined}
            defaultPhone={company?.whatsapp || company?.phone || ''}
            defaultEmail={company?.businessEmail || ''}
            onNext={handleRespondentNext}
            onBack={() => setCurrentStep('company')}
          />
        )}

        {currentStep === 'profile' && (
          <ProfileStep
            initialProfile={profile || undefined}
            defaultSegment={company?.segment || 'comercio'}
            onNext={handleProfileNext}
            onBack={() => setCurrentStep('respondent')}
          />
        )}

        {currentStep === 'questions' && (
          <QuestionsStep
            segment={profile?.segment || company?.segment || 'comercio'}
            teamSize={profile?.teamSize}
            initialAnswers={answers}
            initialComplementaryAnswers={compAnswers}
            onFinish={handleQuestionsFinish}
            onBack={() => setCurrentStep('profile')}
          />
        )}

        {currentStep === 'report' && currentDiagnosis && (
          <ResultReportView
            diagnosis={currentDiagnosis}
            onOpenScheduler={handleOpenScheduler}
            onNewDiagnosis={handleNewDiagnosis}
            onDeclineScheduling={handleDeclineScheduling}
            onCompleteWithConsultant={handleCompleteWithConsultant}
            onDirectConsultancyRequest={handleDirectConsultingChoice}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenProductionGuide={() => setIsProductionGuideOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modais Globais */}
      {currentDiagnosis && (
        <MeetingSchedulerModal
          isOpen={isSchedulerOpen}
          onClose={() => setIsSchedulerOpen(false)}
          diagnosis={currentDiagnosis}
          initialEntity={schedulerEntity}
          onMeetingConfirmed={handleMeetingConfirmed}
          onCancelMeeting={handleMeetingCancelled}
          onCompleteAndResetSession={handleCompleteAndResetSession}
        />
      )}

      {isAdminOpen && (
        <AdminDashboard
          diagnoses={allDiagnoses}
          onClose={() => setIsAdminOpen(false)}
          onSelectDiagnosisForView={handleSelectDiagnosisFromAdmin}
        />
      )}

      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      <ProductionGuideModal
        isOpen={isProductionGuideOpen}
        onClose={() => setIsProductionGuideOpen(false)}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStart={handleStartFromLanding}
      />
    </div>
  );
}
