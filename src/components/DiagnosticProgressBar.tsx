import React from 'react';
import {
  ShieldCheck,
  Building2,
  User,
  Compass,
  HelpCircle,
  BarChart3,
  Check,
} from 'lucide-react';

export type FlowStepId = 'consent' | 'company' | 'respondent' | 'profile' | 'questions' | 'report';

export interface StepItem {
  id: FlowStepId;
  number: number;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const DIAGNOSTIC_STEPS: StepItem[] = [
  {
    id: 'consent',
    number: 1,
    label: 'Termos & LGPD',
    shortLabel: 'Consentimento',
    description: 'Privacidade e termos',
    icon: ShieldCheck,
  },
  {
    id: 'company',
    number: 2,
    label: 'Dados da Empresa',
    shortLabel: 'Empresa',
    description: 'CNPJ e identificação',
    icon: Building2,
  },
  {
    id: 'respondent',
    number: 3,
    label: 'Responsável',
    shortLabel: 'Responsável',
    description: 'Contato e cargo',
    icon: User,
  },
  {
    id: 'profile',
    number: 4,
    label: 'Perfil do Negócio',
    shortLabel: 'Perfil',
    description: 'Segmento e equipe',
    icon: Compass,
  },
  {
    id: 'questions',
    number: 5,
    label: 'Maturidade (5 Pilares)',
    shortLabel: 'Perguntas',
    description: '25 questões chave',
    icon: HelpCircle,
  },
  {
    id: 'report',
    number: 6,
    label: 'Relatório Executivo',
    shortLabel: 'Resultado',
    description: 'IME, ICD e plano',
    icon: BarChart3,
  },
];

interface DiagnosticProgressBarProps {
  currentStep: string;
  onNavigateStep?: (step: FlowStepId) => void;
  canNavigateToStep?: (step: FlowStepId) => boolean;
}

export const DiagnosticProgressBar: React.FC<DiagnosticProgressBarProps> = ({
  currentStep,
  onNavigateStep,
  canNavigateToStep,
}) => {
  // If we're on landing page, we don't need to display the active wizard bar
  if (currentStep === 'landing') {
    return null;
  }

  const currentStepIndex = DIAGNOSTIC_STEPS.findIndex((s) => s.id === currentStep);
  // Default to 0 if not found
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const currentStepData = DIAGNOSTIC_STEPS[activeIndex];

  // Percentage calculation: step 1 = 16.6%, step 6 = 100%
  const progressPercentage = Math.round(((activeIndex + 1) / DIAGNOSTIC_STEPS.length) * 100);

  return (
    <div className="no-print bg-white border-b border-slate-200 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Visualização para Mobile (Compacta com Progresso Numérico) */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center">
                {activeIndex + 1}
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  Etapa {activeIndex + 1} de {DIAGNOSTIC_STEPS.length}: {currentStepData.label}
                </span>
                <span className="text-3xs text-slate-500">
                  {currentStepData.description}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-blue-700">
                {progressPercentage}%
              </span>
              <span className="text-3xs text-slate-400 block">concluído</span>
            </div>
          </div>

          {/* Barra de Progresso Contínua */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-linear-to-r from-blue-600 to-indigo-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Chips compactos horizontais no mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-0.5 no-scrollbar text-2xs">
            {DIAGNOSTIC_STEPS.map((step, idx) => {
              const isCompleted = idx < activeIndex;
              const isCurrent = idx === activeIndex;
              const isClickable =
                onNavigateStep && canNavigateToStep ? canNavigateToStep(step.id) : isCompleted;

              return (
                <button
                  key={step.id}
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onNavigateStep && onNavigateStep(step.id)}
                  className={`px-2 py-1 rounded-md shrink-0 flex items-center gap-1 font-medium transition-all ${
                    isCurrent
                      ? 'bg-blue-50 text-blue-800 font-bold border border-blue-300 shadow-2xs'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                      : 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed opacity-70'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <span className="text-3xs font-bold">{step.number}</span>
                  )}
                  <span>{step.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visualização para Telas Maiores (Desktop e Tablets Grandes) */}
        <div className="hidden lg:block">
          {/* Header de status superior */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Fluxo do Diagnóstico Empresarial
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Etapa {activeIndex + 1} de {DIAGNOSTIC_STEPS.length}: {currentStepData.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xs text-slate-500 font-medium">Progresso geral:</span>
              <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 inline-block">
                <div
                  className="h-full bg-linear-to-r from-blue-600 to-indigo-600 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-xs font-bold text-blue-700 min-w-[36px] text-right">
                {progressPercentage}%
              </span>
            </div>
          </div>

          {/* Stepper com os 6 passos conectados */}
          <div className="relative">
            {/* Linha conectora de fundo */}
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-200 -z-0" />
            
            {/* Linha conectora preenchida até o passo atual */}
            <div
              className="absolute top-5 left-8 h-0.5 bg-blue-600 -z-0 transition-all duration-500 ease-out"
              style={{
                width: `${(activeIndex / (DIAGNOSTIC_STEPS.length - 1)) * 100}%`,
              }}
            />

            <div className="grid grid-cols-6 gap-2 relative z-10">
              {DIAGNOSTIC_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < activeIndex;
                const isCurrent = idx === activeIndex;
                const isUpcoming = idx > activeIndex;
                const isClickable =
                  onNavigateStep && canNavigateToStep ? canNavigateToStep(step.id) : isCompleted;

                return (
                  <button
                    key={step.id}
                    type="button"
                    disabled={!isClickable}
                    onClick={() => isClickable && onNavigateStep && onNavigateStep(step.id)}
                    className={`flex flex-col items-center text-center p-1 rounded-xl transition-all group ${
                      isClickable
                        ? 'cursor-pointer hover:bg-slate-50'
                        : 'cursor-default'
                    }`}
                  >
                    {/* Círculo do Indicador */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all relative ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-xs group-hover:bg-emerald-700 group-hover:scale-105'
                          : isCurrent
                          ? 'bg-blue-700 text-white shadow-md ring-4 ring-blue-100 scale-110'
                          : 'bg-white text-slate-400 border-2 border-slate-200'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white stroke-[2.5]" />
                      ) : (
                        <Icon className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />
                      )}

                      {/* Badge numérico de canto para etapa atual */}
                      {isCurrent && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-extrabold text-3xs flex items-center justify-center shadow-xs">
                          {step.number}
                        </span>
                      )}
                    </div>

                    {/* Rótulo da Etapa */}
                    <div className="mt-2 space-y-0.5">
                      <span
                        className={`text-xs block font-bold transition-colors ${
                          isCompleted
                            ? 'text-emerald-800 group-hover:text-emerald-900'
                            : isCurrent
                            ? 'text-blue-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.shortLabel}
                      </span>
                      <span
                        className={`text-3xs block leading-tight ${
                          isCurrent
                            ? 'text-blue-700 font-medium'
                            : isCompleted
                            ? 'text-emerald-700/80'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.description}
                      </span>
                    </div>

                    {/* Status visual sutil */}
                    {isCompleted && (
                      <span className="text-3xs text-emerald-600 font-semibold mt-0.5 inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        Editar
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
