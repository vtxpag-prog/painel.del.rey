import React from 'react';
import { BookOpen, X, Calculator, Target, CheckCircle2, ShieldAlert } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base">
                Metodologia, Fórmulas de Cálculo e Transparência Algorítmica
              </h3>
              <p className="text-2xs text-slate-300">
                Programa Cresce Del-Rei · ACI Del-Rei & Vortex Tecnologia
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
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs text-slate-800">
            <strong>Transparência Metodológica:</strong> Não utilizamos fórmulas ocultas ou pontuações misteriosas. O Diagnóstico Cresce Del-Rei é auditável, aberto e foi desenvolvido para oferecer clareza e previsibilidade ao empresário.
          </div>

          {/* 1. Cálculo do IME */}
          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span>1. Índice de Maturidade Empresarial (IME)</span>
            </h4>
            <p>
              O IME varia de <strong>0 a 100 pontos</strong> e é calculado pela soma direta dos cinco pilares de maturidade:
            </p>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg font-mono text-xs text-blue-900">
              IME = Pilar 1 (Vendas) + Pilar 2 (Digital) + Pilar 3 (Finanças) + Pilar 4 (Processos) + Pilar 5 (Estratégia)
            </div>
            <p className="text-xs text-slate-600">
              Cada pilar possui cinco perguntas pontuadas de 0 a 4 (máximo de 20 pontos por pilar), totalizando 25 perguntas nucleares com pesos iguais (20% por pilar).
            </p>
          </section>

          {/* 2. Faixas de Classificação do IME */}
          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              2. Classificação Oficial das Faixas do IME
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="p-2.5 border-b">Faixa (Pontos)</th>
                    <th className="p-2.5 border-b">Classificação</th>
                    <th className="p-2.5 border-b">Significado Operacional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2 font-mono font-bold text-red-600">0 a 39</td>
                    <td className="p-2 font-semibold">Crítico</td>
                    <td className="p-2 text-slate-600">A empresa precisa priorizar organização e estabilização de rotinas vitais.</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold text-amber-600">40 a 59</td>
                    <td className="p-2 font-semibold">Básico</td>
                    <td className="p-2 text-slate-600">Existem práticas iniciais, mas ainda pouco consistentes no dia a dia.</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold text-blue-600">60 a 79</td>
                    <td className="p-2 font-semibold">Estruturado</td>
                    <td className="p-2 text-slate-600">A empresa possui fundamentos consolidados e oportunidades claras de evolução.</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold text-emerald-600">80 a 94</td>
                    <td className="p-2 font-semibold">Competitivo</td>
                    <td className="p-2 text-slate-600">Demonstra boa capacidade de gestão, processos organizados e execução consistente.</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold text-indigo-600">95 a 100</td>
                    <td className="p-2 font-semibold">Alta Performance</td>
                    <td className="p-2 text-slate-600">Gestão integrada, disciplina contínua de indicadores e cultura de melhoria.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. Índice de Capacidade Digital */}
          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              3. Índice de Capacidade Digital (ICD)
            </h4>
            <p>
              O ICD varia de <strong>0 a 100 pontos</strong> e avalia especificamente a prontidão digital da empresa através de quatro dimensões ponderadas (25% cada):
            </p>
            <ul className="list-disc list-inside text-xs space-y-1 text-slate-600 pl-2">
              <li><strong>Descoberta e presença digital (25%):</strong> Google Perfil da Empresa e consistência dos canais.</li>
              <li><strong>Atendimento e relacionamento (25%):</strong> WhatsApp Business e rotina rápida de resposta.</li>
              <li><strong>Dados e integração (25%):</strong> Indicadores comerciais e ferramentas/ERP adequados.</li>
              <li><strong>Automação e segurança (25%):</strong> Redução de redundâncias, backup na nuvem e uso responsável de IA.</li>
            </ul>
            <p className="text-2xs text-slate-500 italic">
              Nota metodológica: O ICD é um índice derivado com sobreposição parcial às dimensões do IME, desenhado para orientar projetos de modernização digital da Vortex.
            </p>
          </section>

          {/* 4. Alertas de Gargalo Crítico */}
          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>4. Disparadores de Alertas Críticos</span>
            </h4>
            <p>
              Independentemente da pontuação geral do IME, o sistema gera alerta imediato nos seguintes casos:
            </p>
            <ul className="list-disc list-inside text-xs space-y-1 text-slate-600 pl-2">
              <li>Qualquer pilar com nota igual ou inferior a 5/20 pontos;</li>
              <li>Fluxo de caixa projetado (P3.2) com nota 0 ou 1;</li>
              <li>Margem e formação de preço (P3.3) com nota 0 ou 1;</li>
              <li>Processos críticos mapeados (P4.1) com nota 0 ou 1;</li>
              <li>Segurança e continuidade / backup (P4.5) com nota 0 ou 1;</li>
              <li>Acompanhamento de clientes no funil (P1.3) com nota 0 ou 1;</li>
              <li>Execução de metas com prazos (P5.2) com nota 0 ou 1.</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
