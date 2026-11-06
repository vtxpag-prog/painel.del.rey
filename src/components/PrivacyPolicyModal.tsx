import React from 'react';
import { ShieldCheck, X, FileText, Lock, Building2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
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
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base">
                Política de Privacidade e Proteção de Dados (LGPD)
              </h3>
              <p className="text-2xs text-slate-300">
                Programa Cresce Del-Rei · ACI Del-Rei & Vortex Tecnologia · Versão 1.0 (2026)
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
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-xs text-blue-900">
            <strong>Compromisso Institucional:</strong> A Associação Comercial e Industrial de São João del-Rei (ACI Del-Rei) e a parceira tecnológica Vortex tratam a privacidade e a segurança das empresas participantes com a mais estrita conformidade à Lei Geral de Proteção de Dados (Lei Federal nº 13.709/2018).
          </div>

          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              1. Controladores e Operadores de Dados
            </h4>
            <p>
              A <strong>ACI Del-Rei</strong> atua como Controladora dos dados coletados para fins de relacionamento associativo e desenvolvimento regional. A <strong>Vortex</strong> atua como Operadora e parceira metodológica e tecnológica responsável pela arquitetura do software, processamento algorítmico do diagnóstico e segurança da informação.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              2. Dados Coletados e Finalidades do Tratamento
            </h4>
            <p>
              Coletamos exclusivamente os dados necessários para gerar o diagnóstico e personalizar o plano de ação:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
              <li><strong>Dados da Empresa:</strong> Razão social, nome fantasia, CNPJ, segmento, faixa de faturamento, endereço, telefone, e-mail comercial e canais digitais.</li>
              <li><strong>Dados do Responsável:</strong> Nome completo, cargo/função, e-mail e telefone direto para entrega do relatório.</li>
              <li><strong>Respostas do Diagnóstico:</strong> Autoavaliação nos cinco pilares de maturidade empresarial.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              3. Não Comercialização e Não Exposição Pública
            </h4>
            <p>
              Os dados e relatórios individuais são <strong>estritamente confidenciais</strong>. Em nenhuma hipótese a ACI Del-Rei ou a Vortex venderão, alugarão ou repassarão bases de contatos a terceiros para marketing predatório ou birôs de crédito. Dados estatísticos só poderão ser divulgados de maneira agregada e anônima (ex.: "40% das empresas de São João del-Rei possuem presença digital básica").
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              4. Gestão de Consentimento e Revogação
            </h4>
            <p>
              O consentimento para recebimento de informativos ou encaminhamento a consultores é coletado de forma separada e opcional. O participante pode revogar qualquer consentimento a qualquer momento.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              5. Direitos do Titular de Dados
            </h4>
            <p>
              Em cumprimento ao Art. 18 da LGPD, o titular poderá requerer: confirmação de tratamento, acesso aos dados, correção de dados incompletos ou inexatos, anonimização ou eliminação definitiva dos dados.
            </p>
            <p>
              Canal oficial para atendimento de direitos do titular: <code>privacidade@acidelrei.org.br</code>.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              6. Segurança e Armazenamento
            </h4>
            <p>
              Utilizamos criptografia padrão HTTPS/TLS em trânsito, controle estrito de credenciais administrativas e trilha de auditoria para exportação de dados nominais.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
          >
            Fechar e Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
