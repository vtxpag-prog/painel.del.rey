import React from 'react';
import { HelpCircle, X, CheckCircle2, Clock, FileText, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base">
                Como Funciona o Diagnóstico Empresarial Cresce Del-Rei
              </h3>
              <p className="text-2xs text-slate-300">
                Uma experiência guiada em 4 passos simples
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs sm:text-sm text-slate-700">
          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-sm">
                1
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Identificação e Consentimento Seguro</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Você informa os dados básicos da empresa e do responsável, autorizando de forma transparente o processamento seguro das respostas sob as regras da LGPD.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-sm">
                2
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Pesquisa de Maturidade (15 a 20 minutos)</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Responda 25 perguntas objetivas divididas em 5 pilares estratégicos (Vendas, Presença Digital, Finanças, Processos e Estratégia), além de 5 questões práticas específicas do seu segmento.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-sm">
                3
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Cálculo Transparente e Relatório Imediato</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Ao concluir, o sistema calcula na hora seu Índice de Maturidade Empresarial (IME), o Índice de Capacidade Digital (ICD), pontos fortes, gargalos prioritários e um plano de ação escalonado em 30, 90 e 360 dias. Você pode baixar o relatório executivo completo em PDF.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-sm">
                4
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Devolutiva Online com Consultor (Opcional)</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Se desejar, agende gratuitamente uma conversa executiva de 45 minutos com um consultor da ACI Del-Rei ou da Vortex via Google Meet para aprofundar as recomendações.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-2xs text-slate-500 space-y-1">
            <strong>Importante:</strong> Esta é uma ferramenta de orientação gerencial para capacitar e fortalecer empresas de São João del-Rei. O diagnóstico não é uma avaliação para concessão de crédito nem uma tentativa de venda agressiva.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Fechar
          </button>

          <button
            onClick={() => {
              onClose();
              onStart();
            }}
            className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Iniciar meu diagnóstico agora</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
