import React, { useState } from 'react';
import { Consents } from '../types/diagnosis';
import { ShieldCheck, Lock, AlertCircle, ArrowRight, ArrowLeft, ExternalLink, Info } from 'lucide-react';

interface ConsentStepProps {
  initialConsents?: Consents;
  onNext: (consents: Consents) => void;
  onBack: () => void;
  onOpenPrivacy: () => void;
}

export const ConsentStep: React.FC<ConsentStepProps> = ({
  initialConsents,
  onNext,
  onBack,
  onOpenPrivacy,
}) => {
  const [dataProcessing, setDataProcessing] = useState<boolean>(initialConsents?.dataProcessing || false);
  const [marketingContact, setMarketingContact] = useState<boolean>(initialConsents?.marketingContact || false);
  const [consultantFollowup, setConsultantFollowup] = useState<boolean>(initialConsents?.consultantFollowup || false);
  const [partnerReferral, setPartnerReferral] = useState<boolean>(initialConsents?.partnerReferral || false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleContinue = () => {
    if (!dataProcessing) {
      setErrorMessage('É necessário concordar com o tratamento dos dados para realização do diagnóstico e geração do relatório.');
      return;
    }
    setErrorMessage(null);

    onNext({
      dataProcessing,
      marketingContact,
      consultantFollowup,
      partnerReferral,
      consentedAt: new Date().toISOString(),
      policyVersion: '1.0',
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Cabeçalho da Etapa */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Etapa 1 de 5 · Privacidade e Consentimento</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Transparência e Proteção dos Seus Dados
        </h2>
        <p className="text-sm text-slate-600">
          A ACI Del-Rei e a Vortex tratam as informações empresariais com total confidencialidade, respeito à Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) e ética associativista.
        </p>
      </div>

      {/* Resumo Institucional do Uso dos Dados */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3.5 text-xs text-slate-700">
        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Resumo do Tratamento de Informações</span>
        </div>
        <ul className="space-y-2 list-disc list-inside text-slate-600 leading-relaxed">
          <li>
            <strong>Finalidade:</strong> Coleta de informações para cálculo de maturidade empresarial, identificação de gargalos operacionais e geração de relatório personalizado gratuito.
          </li>
          <li>
            <strong>Dados Coletados:</strong> Razão social, nome fantasia, CNPJ, contato empresarial, porte, segmento e respostas às questões de gestão.
          </li>
          <li>
            <strong>Confidencialidade:</strong> Suas respostas e notas individuais não são disponibilizadas publicamente na internet nem comercializadas para terceiros.
          </li>
          <li>
            <strong>Estatísticas Agregadas:</strong> Resultados consolidados e anonimizados poderão ser utilizados em estudos econômicos da ACI Del-Rei para defender o setor produtivo regional.
          </li>
          <li>
            <strong>Direitos do Titular:</strong> Você pode a qualquer momento solicitar a confirmação, correção ou exclusão dos dados através do canal <code>privacidade@acidelrei.org.br</code>.
          </li>
        </ul>
        <div className="pt-1">
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Ler a Política de Privacidade e Termos de Uso completos</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Caixas de Consentimento */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-slate-900">
          Autorizações e Preferências de Contato:
        </h3>

        {/* 1. Obrigatória */}
        <div className={`p-4 rounded-xl border transition-colors ${
          dataProcessing ? 'border-blue-500 bg-blue-50/40' : 'border-slate-300 bg-white'
        }`}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={dataProcessing}
              onChange={(e) => {
                setDataProcessing(e.target.checked);
                if (e.target.checked) setErrorMessage(null);
              }}
              className="mt-1 w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <div className="space-y-1">
              <span className="font-semibold text-sm text-slate-900 block">
                [Obrigatório] Tratamento de dados para realização do diagnóstico
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Li e concordo com o tratamento dos dados da empresa e do responsável para fins exclusivos de processamento do algoritmo do diagnóstico, cálculo dos pilares e geração do relatório executivo em tela e em PDF.
              </p>
            </div>
          </label>
        </div>

        {/* 2. Opcional - Comunicações e capacitações */}
        <div className={`p-4 rounded-xl border transition-colors ${
          marketingContact ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 bg-white'
        }`}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={marketingContact}
              onChange={(e) => setMarketingContact(e.target.checked)}
              className="mt-1 w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
            <div className="space-y-1">
              <span className="font-semibold text-sm text-slate-900 block">
                [Opcional] Recebimento de comunicados e capacitações
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Autorizo receber informativos, convites para palestras, cursos e programas de desenvolvimento empresarial promovidos pela ACI Del-Rei e pela Vortex.
              </p>
            </div>
          </label>
        </div>

        {/* 3. Opcional - Devolutiva com Consultor */}
        <div className={`p-4 rounded-xl border transition-colors ${
          consultantFollowup ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 bg-white'
        }`}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consultantFollowup}
              onChange={(e) => setConsultantFollowup(e.target.checked)}
              className="mt-1 w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
            <div className="space-y-1">
              <span className="font-semibold text-sm text-slate-900 block">
                [Opcional] Contato de consultor para conversa de devolutiva
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Autorizo que meus dados sejam encaminhados a um consultor técnico da ACI Del-Rei ou da Vortex para agendamento de uma conversa orientativa online sobre o resultado do meu diagnóstico.
              </p>
            </div>
          </label>
        </div>

        {/* 4. Opcional e Específica - Encaminhamento a Parceiros */}
        <div className={`p-4 rounded-xl border transition-colors ${
          partnerReferral ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 bg-white'
        }`}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={partnerReferral}
              onChange={(e) => setPartnerReferral(e.target.checked)}
              className="mt-1 w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
            <div className="space-y-1">
              <span className="font-semibold text-sm text-slate-900 block">
                [Opcional e Específico] Encaminhamento a parceiros institucionais
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Autorizo o encaminhamento do contato a parceiros conveniados específicos, quando estritamente necessário para avaliação de soluções complementares sugeridas nas prioridades do meu relatório.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Erro de validação se tentar prosseguir sem consentimento obrigatório */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao início</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Prosseguir para Dados da Empresa</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
