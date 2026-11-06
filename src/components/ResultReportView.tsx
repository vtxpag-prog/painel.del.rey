import React, { useState, useEffect, useRef } from 'react';
import { DiagnosisResult, ScheduledMeeting, Consultant } from '../types/diagnosis';
import { generateExecutivePDF } from '../utils/pdfGenerator';
import { formatDateBR } from '../utils/validators';
import { getStoredConsultants } from '../data/consultantsData';
import { sendToVortexCrm } from '../services/vortexCrmService';
import { SegmentComparisonCard } from './SegmentComparisonCard';
import {
  Download,
  Printer,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Target,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Info,
  HelpCircle,
  Clock,
  Layers,
  Phone,
  Mail,
  UserCheck,
  Video,
  X,
  Timer,
} from 'lucide-react';

interface ResultReportViewProps {
  diagnosis: DiagnosisResult;
  onOpenScheduler: (entity?: 'ACI Del-Rei' | 'Vortex') => void;
  onNewDiagnosis: () => void;
  onDeclineScheduling: () => void;
  onCompleteWithConsultant: (consultant: Consultant, bookingMethod: 'calendly' | 'direto') => void;
  onDirectConsultancyRequest: (entity: 'ACI Del-Rei' | 'Vortex') => Promise<void>;
}

export const ResultReportView: React.FC<ResultReportViewProps> = ({
  diagnosis,
  onOpenScheduler,
  onNewDiagnosis,
  onDeclineScheduling,
  onCompleteWithConsultant,
  onDirectConsultancyRequest,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'plano' | 'detalhes'>('dashboard');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showPrintTooltip, setShowPrintTooltip] = useState(false);
  const [submittingEntity, setSubmittingEntity] = useState<'ACI Del-Rei' | 'Vortex' | null>(null);
  const [submittingConsultantId, setSubmittingConsultantId] = useState<string | null>(null);

  // Seção 10: Agendamento de Reunião
  const [showConsultantPicker, setShowConsultantPicker] = useState(false);
  const [consultantsList, setConsultantsList] = useState<Consultant[]>([]);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [calendlyOpened, setCalendlyOpened] = useState(false);

  // Temporizador de Inatividade de 5 Minutos (300 segundos)
  const [inactivitySecondsLeft, setInactivitySecondsLeft] = useState<number>(300);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Carregar consultores ativos
    const stored = getStoredConsultants().filter((c) => c.isActive);
    setConsultantsList(stored);
  }, []);

  // Monitoramento do temporizador de inatividade de 5 minutos
  useEffect(() => {
    if (!isTimerRunning) return;

    timerRef.current = setInterval(() => {
      setInactivitySecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoEndDueToInactivity();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Reset timer on user mouse/key interaction
    const handleActivity = () => {
      setInactivitySecondsLeft(300);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [isTimerRunning]);

  const handleAutoEndDueToInactivity = () => {
    setIsTimerRunning(false);
    onDeclineScheduling();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await new Promise((resolve) => setTimeout(resolve, 80));
      generateExecutivePDF(diagnosis);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleStartConsultantScheduling = () => {
    setShowConsultantPicker(true);
    setIsTimerRunning(true);
    setInactivitySecondsLeft(300);
  };

  const handleDirectConsultancy = async (entity: 'ACI Del-Rei' | 'Vortex') => {
    try {
      setSubmittingEntity(entity);
      await onDirectConsultancyRequest(entity);
    } catch (err) {
      console.error('Erro na solicitação direta de consultoria:', err);
    } finally {
      setSubmittingEntity(null);
    }
  };

  const handleConsultantDirect = async (consultant: Consultant) => {
    try {
      setSubmittingConsultantId(consultant.id);
      await onCompleteWithConsultant(consultant, 'direto');
    } catch (err) {
      console.error('Erro na solicitação com consultor:', err);
    } finally {
      setSubmittingConsultantId(null);
    }
  };

  const handleOpenCalendlyForConsultant = async (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setCalendlyOpened(true);
    setIsTimerRunning(true);
    setInactivitySecondsLeft(300);

    // Abrir Calendly na página do consultor
    if (consultant.calendlyUrl) {
      window.open(consultant.calendlyUrl, '_blank', 'noopener,noreferrer');
    }

    // Registrar no sistema e enviar ao CRM da Vortex
    onCompleteWithConsultant(consultant, 'calendly');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      {/* Top Banner de Demonstração (se for caso demo) */}
      {diagnosis.isDemo && (
        <div className="no-print bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Ambiente de Demonstração:</strong> Os dados exibidos referem-se a {diagnosis.demoLabel || 'caso simulado'}.
            </span>
          </div>
          <span className="text-2xs bg-amber-200/80 text-amber-800 font-bold px-2 py-0.5 rounded">
            SIMULAÇÃO
          </span>
        </div>
      )}

      {/* Cabeçalho Institucional Oficial para Impressão */}
      <div className="hidden print-only mb-6 p-4 rounded-xl border border-slate-300 bg-slate-50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center font-black text-sm shrink-0">
              ACI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900 uppercase tracking-tight">
                  ACI Del-Rei
                </span>
                <span className="text-slate-400">|</span>
                <span className="font-bold text-xs text-emerald-800">
                  Vortex Tecnologia
                </span>
              </div>
              <div className="text-2xs text-slate-600">
                Programa Cresce Del-Rei · Metodologia IME / ICD · São João del-Rei e Região / MG
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xs font-bold text-slate-500 uppercase tracking-wider block">
              Documento Oficial
            </span>
            <span className="text-xs font-extrabold text-blue-950">
              Relatório de Diagnóstico Empresarial
            </span>
            <span className="text-3xs text-slate-500 block">
              Emissão: {formatDateBR(diagnosis.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Ações Rápidas do Relatório */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white font-extrabold text-sm">
            CD
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">
              Relatório Executivo Gerado
            </div>
            <div className="text-2xs text-slate-500">
              {diagnosis.company.corporateName} · {formatDateBR(diagnosis.createdAt)}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Grupo de Download PDF com Tooltip & Dica de Impressão Nativa */}
            <div className="relative inline-flex items-center">
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="px-4 py-2 rounded-l-lg bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
                title="Gerar e baixar relatório executivo oficial em arquivo PDF"
              >
                {isGeneratingPDF ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                    <span>Gerando PDF...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Download Concluído!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>

              {/* Botão de Tooltip / Ajuda de Formatação Nativa */}
              <button
                type="button"
                onClick={() => setShowPrintTooltip((prev) => !prev)}
                className="px-2.5 py-2 rounded-r-lg bg-blue-800 hover:bg-blue-900 text-blue-200 hover:text-white border-l border-blue-600/70 text-xs transition-colors cursor-pointer flex items-center justify-center"
                title="Dica: Como imprimir em PDF usando a formatação nativa do navegador (Ctrl+P)"
                aria-label="Ajuda sobre impressão nativa do navegador"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-200" />
              </button>

              {/* Popover / Tooltip Informativo */}
              {showPrintTooltip && (
                <div className="absolute top-full left-0 mt-2 z-50 w-80 sm:w-96 p-4 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 text-xs animate-fadeIn">
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-sky-400">
                      <Printer className="w-4 h-4" />
                      <span>Como salvar via Impressão Nativa</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPrintTooltip(false)}
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                      title="Fechar dica"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="mt-2 text-slate-300 leading-relaxed text-2xs">
                    Se preferir salvar o relatório com a diagramação visual exata que está na tela (incluindo todos os cards e gráficos abertos), você pode usar o recurso nativo de impressão do seu navegador:
                  </p>

                  <ol className="mt-2.5 space-y-1.5 text-2xs text-slate-200 list-decimal list-inside bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                    <li>
                      Clique em <strong>Imprimir</strong> ou aperte <kbd className="px-1 py-0.5 rounded bg-slate-900 text-slate-100 font-mono text-3xs border border-slate-700">Ctrl + P</kbd> / <kbd className="px-1 py-0.5 rounded bg-slate-900 text-slate-100 font-mono text-3xs border border-slate-700">Cmd + P</kbd>.
                    </li>
                    <li>
                      No campo <strong>Destino / Impressora</strong>, escolha <strong>"Salvar como PDF"</strong>.
                    </li>
                    <li>
                      Em <em>"Mais definições"</em>, marque <strong>"Gráficos de segundo plano"</strong> para manter todas as cores e barras.
                    </li>
                  </ol>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPrintTooltip(false);
                        handlePrint();
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Abrir Diálogo de Impressão Agora</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Abrir diálogo de impressão do navegador (Ctrl+P / Cmd+P) para imprimir ou Salvar como PDF nativo"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={() => onOpenScheduler()}
              className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{diagnosis.scheduledMeeting ? 'Ver Agendamento' : 'Agendar Devolutiva'}</span>
            </button>

            <button
              onClick={onNewDiagnosis}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
            >
              Novo Diagnóstico
            </button>
          </div>
        </div>

        {/* Texto de Apoio / Helper Text logo abaixo da barra */}
        <div className="w-full pt-1.5 text-2xs text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>
            Prefere outra diagramação? Clique em <strong>Imprimir</strong> (ou pressione <kbd className="px-1 py-0.2 rounded bg-slate-100 font-mono text-3xs border border-slate-200">Ctrl+P</kbd>) e escolha <em>"Salvar como PDF"</em> no diálogo do navegador.
          </span>
        </div>
      </div>

      {/* Cartão de Destaque para Download do Relatório Oficial em PDF */}
      <div className="no-print bg-linear-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <Download className="w-4 h-4" />
              <span>Relatório Executivo Completo Oficial</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Baixar Relatório do Diagnóstico em PDF (Formato A4)
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Documento de 9 páginas diagramado para impressão e apresentação à diretoria, incluindo notas por pilar, gráficos de maturidade (IME e ICD), comparativo de benchmark setorial, análise de pontos fortes, alertas de gargalos e plano de ação cronológico.
            </p>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="shrink-0 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isGeneratingPDF ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                <span>Gerando PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Caixa de Texto Auxiliar (Helper Callout) sobre Impressão Nativa em PDF */}
        <div className="pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-2xs text-slate-300 bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-start sm:items-center gap-2.5">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5 sm:mt-0" />
            <span className="leading-relaxed">
              <strong>Dica de formatação alternativa:</strong> Para salvar exatamente a exibição da tela deste navegador como PDF, use o botão <button type="button" onClick={handlePrint} className="text-sky-300 hover:text-sky-200 font-bold underline cursor-pointer">Imprimir</button> ou pressione <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-3xs border border-white/20">Ctrl+P</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-3xs border border-white/20">Cmd+P</kbd> e escolha o destino <em>"Salvar como PDF"</em> (com <em>"Gráficos de segundo plano"</em> ativado).
            </span>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-2xs transition-colors shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-sky-300" />
            <span>Imprimir via Navegador</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SEÇÃO 1: CABEÇALHO EXECUTIVO E SCORECARD DO IME */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Realização ACI Del-Rei & Parceria Vortex</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {diagnosis.company.corporateName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span>CNPJ: {diagnosis.company.cnpj}</span>
              <span>·</span>
              <span>Segmento: {diagnosis.company.segment.toUpperCase()}</span>
              <span>·</span>
              <span>{diagnosis.company.city} - {diagnosis.company.state}</span>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6 shrink-0">
            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
              Data da Avaliação
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {formatDateBR(diagnosis.createdAt)}
            </span>
            <div className="text-2xs text-slate-400 mt-0.5">
              Metodologia v1.0
            </div>
          </div>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* IME Principal */}
          <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-800">
              <span>ÍNDICE DE MATURIDADE EMPRESARIAL (IME)</span>
              <span className="text-2xs px-2 py-0.5 rounded bg-blue-100 font-bold">
                0 a 100
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-blue-900">{diagnosis.ime}</span>
              <span className="text-sm font-semibold text-blue-700">/ 100</span>
            </div>
            <div className="pt-1">
              <span className="text-xs font-bold text-blue-900 block">
                Classificação: {diagnosis.imeClassification.toUpperCase()}
              </span>
              <p className="text-2xs text-blue-800 leading-relaxed mt-0.5">
                {diagnosis.imeMessage}
              </p>
            </div>
          </div>

          {/* ICD - Capacidade Digital */}
          <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>ÍNDICE DE CAPACIDADE DIGITAL (ICD)</span>
              <span className="text-2xs px-2 py-0.5 rounded bg-emerald-100 font-bold">
                Derivado
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-emerald-900">{diagnosis.icd}</span>
              <span className="text-sm font-semibold text-emerald-700">/ 100</span>
            </div>
            <div className="pt-1">
              <span className="text-xs font-bold text-emerald-900 block">
                Nível: {diagnosis.icdClassification}
              </span>
              <p className="text-2xs text-emerald-800 leading-relaxed mt-0.5">
                Avaliação de canais digitais, WhatsApp Business, integração de dados e segurança.
              </p>
            </div>
          </div>

          {/* Amostra e Nível de Confiança */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>NÍVEL DE CONFIANÇA DOS DADOS</span>
              <ShieldCheck className="w-4 h-4 text-slate-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{diagnosis.confidenceLevel}</span>
            </div>
            <div className="pt-1 text-2xs text-slate-600 leading-relaxed">
              Baseado nas respostas autodeclaradas pelo responsável {diagnosis.respondent.fullName}. O nível pode ser elevado para "Validado" mediante entrevista com consultor técnico.
            </div>
          </div>
        </div>

        {/* Alertas Críticos Identificados */}
        {diagnosis.alerts.length > 0 && (
          <div className="p-4 rounded-xl bg-red-50/80 border border-red-200 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-red-800 uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Gargalos Críticos que Demandam Atenção Imediata</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {diagnosis.alerts.map((al) => (
                <div key={al.id} className="p-3 bg-white rounded-lg border border-red-100 shadow-2xs">
                  <div className="font-bold text-red-900">{al.title}</div>
                  <p className="text-2xs text-slate-600 mt-1 leading-relaxed">
                    {al.description}
                  </p>
                  <div className="mt-2 text-2xs font-semibold text-red-700">
                    Ação: {al.actionRequired}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* SEÇÃO 2: COMPARATIVO COM A MÉDIA DO SEGMENTO (BENCHMARK REGIONAL) */}
      {/* ============================================================== */}
      <SegmentComparisonCard diagnosis={diagnosis} />

      {/* ============================================================== */}
      {/* SEÇÃO 3: VISÃO DOS 5 PILARES DE MATURIDADE */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Desempenho nos 5 Pilares de Maturidade
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cada pilar pontua de 0 a 20 e representa 20% do Índice de Maturidade Empresarial.
          </p>
        </div>

        <div className="space-y-4">
          {Object.values(diagnosis.pillarScores).map((pil, idx) => (
            <div
              key={pil.pillarId}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
                    Pilar {idx + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-900">{pil.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    {pil.classification}
                  </span>
                  <span className="text-sm font-bold text-blue-700">
                    {pil.score}/20 pts ({pil.percentage}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pil.percentage}%`,
                    backgroundColor: pil.color,
                  }}
                />
              </div>

              <p className="text-2xs text-slate-600 leading-relaxed">
                {pil.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SEÇÃO 3: PONTOS FORTES E PRINCIPAIS GARGALOS (COMPARATIVO) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pontos Fortes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Principais Pontos Fortes
            </h3>
          </div>

          <div className="space-y-3">
            {diagnosis.strengths.map((str, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs space-y-1">
                <div className="font-bold text-emerald-900">{str.title}</div>
                <p className="text-2xs text-slate-700 leading-relaxed">{str.evidence}</p>
                <div className="pt-1 text-2xs text-emerald-800">
                  <strong>Como alavancar:</strong> {str.howToLeverage}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gargalos Operacionais */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold text-slate-900">
              Principais Gargalos Operacionais
            </h3>
          </div>

          <div className="space-y-3">
            {diagnosis.bottlenecks.map((btk, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-red-50/50 border border-red-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-900">{btk.title}</span>
                  <span className="text-2xs text-red-700 font-semibold">{btk.priority}</span>
                </div>
                <p className="text-2xs text-slate-700 leading-relaxed">{btk.problem}</p>
                <div className="pt-1 text-2xs text-red-800">
                  <strong>Recomendação:</strong> {btk.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SEÇÃO 4: MATRIZ DE PRIORIDADES E PLANO DE AÇÃO EM 3 HORIZONTES */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Plano de Ação Estruturado em 3 Horizontes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ações práticas com impacto, esforço, urgência e métrica sugerida para não sobrecarregar a rotina.
          </p>
        </div>

        {/* Abas dos Horizontes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 30 Dias */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wide">
              <Clock className="w-4 h-4 text-blue-700" />
              <span>Próximos 30 Dias (Imediato)</span>
            </div>
            <div className="space-y-2.5">
              {diagnosis.actionPlan
                .filter((a) => a.horizon === '30_dias')
                .map((act) => (
                  <div key={act.id} className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1 shadow-2xs">
                    <div className="font-semibold text-slate-900 leading-tight">{act.action}</div>
                    <div className="flex items-center justify-between text-2xs text-slate-500 pt-1 border-t border-slate-100">
                      <span>Resp: {act.responsible}</span>
                      <span className="font-medium text-blue-700">{act.timeframe}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 90 Dias */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wide">
              <Target className="w-4 h-4 text-emerald-700" />
              <span>Próximos 90 Dias (Estruturação)</span>
            </div>
            <div className="space-y-2.5">
              {diagnosis.actionPlan
                .filter((a) => a.horizon === '90_dias')
                .map((act) => (
                  <div key={act.id} className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1 shadow-2xs">
                    <div className="font-semibold text-slate-900 leading-tight">{act.action}</div>
                    <div className="flex items-center justify-between text-2xs text-slate-500 pt-1 border-t border-slate-100">
                      <span>Resp: {act.responsible}</span>
                      <span className="font-medium text-emerald-700">{act.timeframe}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 12 Meses */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-3">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wide">
              <TrendingUp className="w-4 h-4 text-purple-700" />
              <span>Próximos 12 Meses (Escala)</span>
            </div>
            <div className="space-y-2.5">
              {diagnosis.actionPlan
                .filter((a) => a.horizon === '12_meses')
                .map((act) => (
                  <div key={act.id} className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1 shadow-2xs">
                    <div className="font-semibold text-slate-900 leading-tight">{act.action}</div>
                    <div className="flex items-center justify-between text-2xs text-slate-500 pt-1 border-t border-slate-100">
                      <span>Resp: {act.responsible}</span>
                      <span className="font-medium text-purple-700">{act.timeframe}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SEÇÃO 5: TRILHAS DE APOIO INSTITUCIONAL */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Trilhas de Apoio da ACI Del-Rei e Vortex
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Capacitações e projetos orientados para acompanhar as prioridades levantadas neste diagnóstico.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {diagnosis.supportTrails.map((trail, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 text-xs space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{trail.category}</span>
                  {trail.priority === 'alta' && (
                    <span className="text-2xs bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                      Prioritária
                    </span>
                  )}
                </div>
                <p className="text-2xs text-slate-600 mt-1 leading-relaxed">
                  {trail.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 10. OPÇÃO DE CONSULTORIA ESPECIALIZADA & DEVOLUTIVA */}
      {/* ============================================================== */}
      <div className="bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 space-y-8">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>10. OPÇÃO DE CONSULTORIA ESPECIALIZADA & PRÓXIMOS PASSOS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Deseja conversar sobre o resultado do seu diagnóstico?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Selecione uma das opções de consultoria abaixo para colocar o plano de ação em prática com o apoio dos especialistas do programa. Ao fazer a sua opção com a <strong>ACI Del-Rei</strong> ou com a <strong>Vortex</strong>, os dados serão enviados com segurança para o CRM da Vortex e, em estrita conformidade com a LGPD e privacidade, os dados desta sessão serão apagados do terminal, retornando à tela inicial pronto para um novo diagnóstico.
          </p>
        </div>

        {/* Notificação / Status se estiver enviando */}
        {submittingEntity && (
          <div className="p-4 rounded-2xl bg-blue-600/30 border border-blue-400/50 flex items-center gap-3 text-xs text-white animate-pulse">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
            <span>
              Transmitindo métricas e plano de ação da <strong>{diagnosis.company.corporateName}</strong> para o CRM da Vortex...
            </span>
          </div>
        )}

        {/* Grid dos Dois Cards Oficiais de Consultoria: ACI Del-Rei e Vortex */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CARD 1: CONSULTORIA COM ACI DEL-REI */}
          <div className="rounded-2xl bg-white/5 border border-blue-500/30 p-6 sm:p-7 flex flex-col justify-between hover:border-blue-400/60 transition-all shadow-lg space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-3xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      Realização Institucional
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                      Consultoria com ACI Del-Rei
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-blue-200 font-medium">
                Gestão Empresarial, Finanças, Saúde do Negócio e Mercado Regional
              </p>

              <p className="text-2xs text-slate-300 leading-relaxed">
                Orientação especializada com foco na redução de custos, estruturação de caixa, atendimento, precificação, crédito orientado e integração ao ecossistema empresarial de São João del-Rei e Campo das Vertentes.
              </p>

              <div className="space-y-2 pt-2 border-t border-white/10 text-2xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Acompanhamento presencial na sede da ACI Del-Rei ou online</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Orientação para redução de gargalos financeiros imediatos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Networking e soluções associativas para sua empresa</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/10">
              <button
                type="button"
                disabled={!!submittingEntity}
                onClick={() => handleDirectConsultancy('ACI Del-Rei')}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submittingEntity === 'ACI Del-Rei' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                    <span>Enviando ao CRM...</span>
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4 text-blue-200" />
                    <span>Optar por Consultoria com ACI Del-Rei</span>
                    <ArrowRight className="w-4 h-4 text-blue-200" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onOpenScheduler('ACI Del-Rei')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-blue-200 text-2xs font-semibold border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-300" />
                <span>Agendar Data e Horário (Google Meet)</span>
              </button>
            </div>
          </div>

          {/* CARD 2: CONSULTORIA COM A VORTEX */}
          <div className="rounded-2xl bg-white/5 border border-emerald-500/30 p-6 sm:p-7 flex flex-col justify-between hover:border-emerald-400/60 transition-all shadow-lg space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-3xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Parceria Tecnológica & Metodológica
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                      Consultoria com a Vortex
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-emerald-200 font-medium">
                Transformação Digital, Automação, IA, CRM e Canais de Vendas
              </p>

              <p className="text-2xs text-slate-300 leading-relaxed">
                Consultoria prática focada na digitalização de vendas, implantação de CRM comercial, atendimento automatizado via WhatsApp, redução de retrabalho com IA e modernização de processos.
              </p>

              <div className="space-y-2 pt-2 border-t border-white/10 text-2xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Estruturação do funil de vendas e atendimento via WhatsApp</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Automação de processos repetitivos e ganho de escala com IA</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Estratégia de presença digital, tráfego e conversão de leads</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/10">
              <button
                type="button"
                disabled={!!submittingEntity}
                onClick={() => handleDirectConsultancy('Vortex')}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submittingEntity === 'Vortex' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                    <span>Enviando ao CRM...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Optar por Consultoria com a Vortex</span>
                    <ArrowRight className="w-4 h-4 text-emerald-200" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onOpenScheduler('Vortex')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-emerald-200 text-2xs font-semibold border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                <span>Agendar Data e Horário (Google Meet)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Seletor de Consultores Específicos & Opção Alternativa */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowConsultantPicker(!showConsultantPicker)}
              className="text-xs text-blue-300 hover:text-white font-medium flex items-center gap-1.5 cursor-pointer underline"
            >
              <UserCheck className="w-4 h-4" />
              <span>
                {showConsultantPicker
                  ? 'Ocultar consultores individuais'
                  : 'Ou prefere escolher um consultor nominal da equipe?'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showConsultantPicker ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="text-2xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar PDF antes de sair</span>
              </button>

              <button
                type="button"
                onClick={onDeclineScheduling}
                className="text-2xs text-slate-400 hover:text-rose-300 cursor-pointer underline"
              >
                Não desejo consultoria agora (Concluir)
              </button>
            </div>
          </div>

          {/* Lista expandida de consultores se solicitado */}
          {showConsultantPicker && (
            <div className="p-5 rounded-2xl bg-white/5 border border-white/15 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                  Consultores Especialistas Ativos:
                </span>
                <span className="text-2xs text-slate-400">
                  Ao escolher um consultor, os dados serão enviados ao CRM da Vortex e a sessão será limpa.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {consultantsList.map((cst) => (
                  <div
                    key={cst.id}
                    className="p-4 rounded-xl bg-white/10 border border-white/15 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <div className="font-bold text-white text-xs">{cst.fullName}</div>
                        <span
                          className={`text-3xs font-bold px-1.5 py-0.5 rounded ${
                            cst.entity === 'Vortex'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-blue-950 text-blue-300 border border-blue-500/40'
                          }`}
                        >
                          {cst.entity}
                        </span>
                      </div>
                      <div className="text-2xs text-blue-300 font-medium mt-0.5">{cst.specialty}</div>
                      {cst.bio && <p className="text-3xs text-slate-300 mt-1 italic">"{cst.bio}"</p>}
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => handleConsultantDirect(cst)}
                        disabled={submittingConsultantId === cst.id}
                        className="w-full py-2 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {submittingConsultantId === cst.id ? (
                          <span>Enviando...</span>
                        ) : (
                          <>
                            <UserCheck className="w-3 h-3" />
                            <span>Optar por este Consultor</span>
                          </>
                        )}
                      </button>

                      {cst.calendlyUrl && (
                        <button
                          type="button"
                          onClick={() => handleOpenCalendlyForConsultant(cst)}
                          className="w-full py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-3xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Video className="w-2.5 h-2.5" />
                          <span>Abrir Calendly</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé LGPD da Seção 10 */}
        <div className="pt-4 border-t border-white/10 text-2xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Garantia de Privacidade & LGPD:</strong> Após a opção de consultoria, todos os dados temporários do formulário são apagados deste navegador e transmitidos exclusivamente ao CRM corporativo.
            </span>
          </div>
          <span className="text-3xs text-slate-400 shrink-0">
            Fuso horário: America/Sao_Paulo (Brasília)
          </span>
        </div>
      </div>

      {/* Rodapé Oficial Exclusivo para Impressão */}
      <div className="hidden print-block pt-4 border-t-2 border-slate-300 text-2xs text-slate-600">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Realização Institucional:</strong> Associação Comercial e Industrial de São João del-Rei (ACI Del-Rei) · Parceria Tecnológica: Vortex Tecnologia.
          </div>
          <div className="text-3xs text-slate-500">
            Documento emitido via Programa Cresce Del-Rei · Todos os direitos reservados.
          </div>
        </div>
      </div>
    </div>
  );
};
