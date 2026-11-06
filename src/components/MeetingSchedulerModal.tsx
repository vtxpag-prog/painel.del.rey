import React, { useState, useEffect } from 'react';
import { DiagnosisResult, ScheduledMeeting } from '../types/diagnosis';
import { downloadICSFile, generateGoogleCalendarUrl } from '../utils/icsExport';
import { generateExecutivePDF } from '../utils/pdfGenerator';
import { sendToVortexCrm, CrmDispatchResult } from '../services/vortexCrmService';
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Download,
  Building2,
  Sparkles,
  Phone,
  Mail,
  RefreshCw,
  Info,
  Trash2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface MeetingSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosis: DiagnosisResult;
  initialEntity?: 'ACI Del-Rei' | 'Vortex';
  onMeetingConfirmed: (meeting: ScheduledMeeting) => void;
  onCancelMeeting?: (meetingId: string) => void;
  onCompleteAndResetSession: (crmResult?: CrmDispatchResult) => void;
}

export const MeetingSchedulerModal: React.FC<MeetingSchedulerModalProps> = ({
  isOpen,
  onClose,
  diagnosis,
  initialEntity = 'ACI Del-Rei',
  onMeetingConfirmed,
  onCancelMeeting,
  onCompleteAndResetSession,
}) => {
  const [selectedEntity, setSelectedEntity] = useState<'ACI Del-Rei' | 'Vortex'>(initialEntity);
  const [consultantName, setConsultantName] = useState<string>(
    initialEntity === 'Vortex'
      ? 'Consultoria em Tecnologia e Processos Vortex'
      : 'Consultoria de Gestão e Associativismo ACI Del-Rei'
  );

  // Next available business days in Sao Paulo
  const today = new Date();
  const dateOptions = [1, 2, 3, 4, 7, 8].map((offset) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return d.toISOString().split('T')[0];
  });

  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0]);
  const [selectedTime, setSelectedTime] = useState<string>('14:30');
  const [participantName, setParticipantName] = useState<string>(diagnosis.respondent.fullName);
  const [participantEmail, setParticipantEmail] = useState<string>(diagnosis.respondent.email);
  const [participantPhone, setParticipantPhone] = useState<string>(diagnosis.respondent.phoneWhatsapp);

  const [currentMeeting, setCurrentMeeting] = useState<ScheduledMeeting | null>(
    diagnosis.scheduledMeeting || null
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(!!diagnosis.scheduledMeeting);
  const [isSendingToCrm, setIsSendingToCrm] = useState<boolean>(false);
  const [crmDispatchResult, setCrmDispatchResult] = useState<CrmDispatchResult | null>(null);

  // Auto-countdown to clear data and return to landing
  const [countdown, setCountdown] = useState<number>(20);
  const [countdownActive, setCountdownActive] = useState<boolean>(false);

  useEffect(() => {
    if (initialEntity) {
      setSelectedEntity(initialEntity);
      setConsultantName(
        initialEntity === 'Vortex'
          ? 'Consultoria em Tecnologia e Processos Vortex'
          : 'Consultoria de Gestão e Associativismo ACI Del-Rei'
      );
    }
  }, [initialEntity]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdownActive && countdown === 0) {
      handleFinalizeAndReset();
    }
    return () => clearTimeout(timer);
  }, [countdownActive, countdown]);

  if (!isOpen) return null;

  const handleEntityChange = (entity: 'ACI Del-Rei' | 'Vortex') => {
    setSelectedEntity(entity);
    if (entity === 'ACI Del-Rei') {
      setConsultantName('Consultoria de Gestão e Associativismo ACI Del-Rei');
    } else {
      setConsultantName('Consultoria em Tecnologia e Processos Vortex');
    }
  };

  const handleConfirmSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingToCrm(true);

    // Criar código aleatório do Google Meet institucional
    const code1 = Math.random().toString(36).substring(2, 5);
    const code2 = Math.random().toString(36).substring(2, 6);
    const code3 = Math.random().toString(36).substring(2, 5);
    const meetLink = `https://meet.google.com/${code1}-${code2}-${code3}`;

    const newMeeting: ScheduledMeeting = {
      id: `meet-${Date.now()}`,
      diagnosisId: diagnosis.id,
      companyName: diagnosis.company.corporateName,
      contactName: participantName,
      contactEmail: participantEmail,
      contactPhone: participantPhone,
      entity: selectedEntity,
      consultantName,
      date: selectedDate,
      time: selectedTime,
      meetLink,
      status: 'confirmada',
      isDemo: diagnosis.isDemo || false,
      notes: `Devolutiva gerada para ${diagnosis.company.corporateName}. IME: ${diagnosis.ime}/100`,
    };

    try {
      // Envia os dados para o CRM da Vortex
      const crmRes = await sendToVortexCrm(diagnosis, newMeeting);
      setCrmDispatchResult(crmRes);
      setCurrentMeeting(newMeeting);
      setIsSuccess(true);
      onMeetingConfirmed(newMeeting);
      setCountdown(20);
      setCountdownActive(true);
    } catch (err) {
      console.error('Erro na transmissão ao CRM:', err);
    } finally {
      setIsSendingToCrm(false);
    }
  };

  const handleFinalizeAndReset = () => {
    setCountdownActive(false);
    onClose();
    onCompleteAndResetSession(crmDispatchResult || undefined);
  };

  const handleCancel = () => {
    if (currentMeeting && onCancelMeeting) {
      onCancelMeeting(currentMeeting.id);
    }
    setCurrentMeeting(null);
    setIsSuccess(false);
    setCountdownActive(false);
  };

  const handleDownloadPDF = () => {
    generateExecutivePDF(diagnosis);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Video className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base">
                Opção de Consultoria & Envio ao CRM
              </h3>
              <p className="text-2xs text-slate-300">
                Programa Cresce Del-Rei · ACI Del-Rei & Vortex Tecnologia
              </p>
            </div>
          </div>
          <button
            onClick={isSuccess ? handleFinalizeAndReset : onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner de Demonstração / Ambiente */}
        <div className="bg-blue-50 border-b border-blue-100 px-5 py-2.5 text-xs text-blue-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Fuso horário:</strong> America/Sao_Paulo (Horário de Brasília) · Duração estimada: 45 minutos
          </span>
        </div>

        <div className="p-6 space-y-6">
          {isSuccess && currentMeeting ? (
            /* Tela de Confirmação da Reunião e Envio ao CRM */
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Dados Enviados com Sucesso para o CRM da Vortex!</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  A sua solicitação de consultoria com a <strong>{currentMeeting.entity}</strong> foi transmitida com sucesso para o CRM. O link do Google Meet e o evento de calendário foram gerados.
                </p>

                {crmDispatchResult && (
                  <div className="text-2xs font-mono bg-emerald-100/70 text-emerald-800 px-3 py-1.5 rounded flex items-center justify-between">
                    <span>Protocolo CRM: {crmDispatchResult.dispatchId}</span>
                    <span className="font-bold uppercase">Status: Enviado ao CRM</span>
                  </div>
                )}
              </div>

              {/* Detalhes do Encontro */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Instituição da Consultoria:</span>
                    <strong className="text-slate-900 text-sm flex items-center gap-1.5">
                      {currentMeeting.entity === 'Vortex' ? (
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Building2 className="w-4 h-4 text-blue-600" />
                      )}
                      {currentMeeting.entity}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Consultor / Especialista:</span>
                    <strong className="text-slate-900 text-sm">{currentMeeting.consultantName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Data & Horário:</span>
                    <strong className="text-slate-900 text-sm">
                      {currentMeeting.date} às {currentMeeting.time} (Horário de Brasília)
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Participante:</span>
                    <strong className="text-slate-900 text-sm">
                      {currentMeeting.contactName} ({diagnosis.company.corporateName})
                    </strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <span className="text-slate-500 block mb-1">Sala Virtual do Google Meet:</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={currentMeeting.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-900 font-mono font-bold text-sm underline flex items-center gap-1.5"
                    >
                      <span>{currentMeeting.meetLink}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Botões de Download do Relatório e Adicionar à Agenda */}
              <div className="space-y-2">
                <div className="text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Guarde seus materiais antes de encerrar a sessão:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="py-2.5 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Relatório PDF</span>
                  </button>

                  <a
                    href={generateGoogleCalendarUrl(currentMeeting)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CalendarIcon className="w-4 h-4 text-blue-600" />
                    <span>Google Agenda</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => downloadICSFile(currentMeeting)}
                    className="py-2.5 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Baixar .ICS</span>
                  </button>
                </div>
              </div>

              {/* Caixa LGPD de Limpeza de Dados e Retorno ao Início */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-white">
                      Conformidade com LGPD & Limpeza de Dados
                    </div>
                    <p className="text-2xs text-slate-300 leading-relaxed">
                      Conforme solicitado, os dados deste diagnóstico foram enviados com sucesso para o CRM da Vortex e <strong>serão completamente apagados deste navegador</strong> para garantir a privacidade da sua empresa e deixar o sistema pronto para um novo diagnóstico.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-2xs text-slate-400">
                    Retorno automático à tela inicial em <strong className="text-white">{countdown}s</strong>
                  </span>

                  <button
                    type="button"
                    onClick={handleFinalizeAndReset}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Apagar Dados e Voltar ao Início Agora</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Formulário de Agendamento e Seleção de Consultoria */
            <form onSubmit={handleConfirmSchedule} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Com quem você deseja realizar a consultoria devolutiva?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleEntityChange('ACI Del-Rei')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedEntity === 'ACI Del-Rei'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span>Consultoria ACI Del-Rei</span>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1">
                      Foco em associativismo, desenvolvimento gerencial, vendas e conexões regionais.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEntityChange('Vortex')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedEntity === 'Vortex'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Consultoria Vortex</span>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1">
                      Foco em maturidade digital, processos operacionais, automações e tecnologia aplicada.
                    </p>
                  </button>
                </div>
              </div>

              {/* Data e Horário */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Selecione a Data Disponível
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-200 bg-white"
                  >
                    {dateOptions.map((dateStr) => {
                      const [y, m, d] = dateStr.split('-');
                      return (
                        <option key={dateStr} value={dateStr}>
                          {d}/{m}/{y} (Dias úteis)
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Horário Disponível (45 min)
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-200 bg-white"
                  >
                    <option value="09:00">09:00 às 09:45</option>
                    <option value="10:30">10:30 às 11:15</option>
                    <option value="14:00">14:00 às 14:45</option>
                    <option value="15:30">15:30 às 16:15</option>
                    <option value="17:00">17:00 às 17:45</option>
                  </select>
                </div>
              </div>

              {/* Confirmação dos Contatos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-0.5">
                    Nome do Participante
                  </label>
                  <input
                    type="text"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-0.5">
                    E-mail para Convite
                  </label>
                  <input
                    type="email"
                    value={participantEmail}
                    onChange={(e) => setParticipantEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-0.5">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="text"
                    value={participantPhone}
                    onChange={(e) => setParticipantPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-2xs text-slate-600 leading-relaxed">
                <strong>Aviso de Fluxo Seguro:</strong> Ao confirmar, os dados do diagnóstico e agendamento serão enviados diretamente para o CRM da Vortex. Após a confirmação, o sistema apagará os dados da sessão e retornará à tela inicial para um novo diagnóstico.
              </div>

              {/* Botões do formulário */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSendingToCrm}
                  className="px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {isSendingToCrm ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Enviando para o CRM da Vortex...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                      <span>Confirmar Consultoria e Enviar ao CRM</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
