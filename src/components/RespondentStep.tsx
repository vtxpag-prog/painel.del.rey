import React, { useState } from 'react';
import { RespondentData } from '../types/diagnosis';
import { formatPhone, validateEmail, cleanNumeric } from '../utils/validators';
import { UserCheck, ArrowRight, ArrowLeft, AlertCircle, Shield } from 'lucide-react';

interface RespondentStepProps {
  initialData?: Partial<RespondentData>;
  defaultPhone?: string;
  defaultEmail?: string;
  onNext: (data: RespondentData) => void;
  onBack: () => void;
}

export const RespondentStep: React.FC<RespondentStepProps> = ({
  initialData,
  defaultPhone = '',
  defaultEmail = '',
  onNext,
  onBack,
}) => {
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [role, setRole] = useState(initialData?.role || '');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState(initialData?.phoneWhatsapp || defaultPhone);
  const [email, setEmail] = useState(initialData?.email || defaultEmail);
  const [relationship, setRelationship] = useState<RespondentData['relationship']>(
    initialData?.relationship || 'socio_proprietario'
  );
  const [isAuthorized, setIsAuthorized] = useState<boolean>(initialData?.isAuthorized || false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      errs.fullName = 'Informe o nome completo do responsável.';
    }

    if (!role.trim()) {
      errs.role = 'Informe o cargo ou função na empresa.';
    }

    if (!phoneWhatsapp.trim() || cleanNumeric(phoneWhatsapp).length < 10) {
      errs.phoneWhatsapp = 'Telefone/WhatsApp com DDD é obrigatório.';
    }

    if (!email.trim() || !validateEmail(email)) {
      errs.email = 'E-mail válido é obrigatório para recebimento do relatório.';
    }

    if (!isAuthorized) {
      errs.isAuthorized = 'É obrigatório confirmar que está autorizado(a) a responder em nome da empresa.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onNext({
      fullName: fullName.trim(),
      role: role.trim(),
      phoneWhatsapp: phoneWhatsapp.trim(),
      email: email.trim(),
      relationship,
      isAuthorized,
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Cabeçalho da Etapa */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
          <UserCheck className="w-4 h-4" />
          <span>Etapa 3 de 5 · Responsável pelo Preenchimento</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Dados do Representante
        </h2>
        <p className="text-sm text-slate-600">
          Identifique o profissional responsável pelo preenchimento das informações para envio nominal do relatório e agendamento de devolutiva.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome Completo e Cargo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nome Completo do Responsável *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex.: Mariana Silveira Guimarães"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                errors.fullName ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
              }`}
            />
            {errors.fullName && <span className="text-xs text-red-600 mt-1 block">{errors.fullName}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cargo ou Função na Empresa *
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Ex.: Sócio-Administrador, Gerente Geral"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                errors.role ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
              }`}
            />
            {errors.role && <span className="text-xs text-red-600 mt-1 block">{errors.role}</span>}
          </div>
        </div>

        {/* Telefone/WhatsApp e E-mail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Telefone / WhatsApp Direto *
            </label>
            <input
              type="text"
              value={phoneWhatsapp}
              onChange={(e) => setPhoneWhatsapp(formatPhone(e.target.value))}
              placeholder="(32) 99123-4567"
              maxLength={15}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 ${
                errors.phoneWhatsapp ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
              }`}
            />
            {errors.phoneWhatsapp && (
              <span className="text-xs text-red-600 mt-1 block">{errors.phoneWhatsapp}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              E-mail para Recebimento do Relatório *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mariana@empresa.com.br"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
              }`}
            />
            {errors.email && <span className="text-xs text-red-600 mt-1 block">{errors.email}</span>}
          </div>
        </div>

        {/* Relação com a Empresa */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Vínculo / Relação com o Negócio *
          </label>
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value as RespondentData['relationship'])}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          >
            <option value="socio_proprietario">Sócio(a) / Proprietário(a) / Fundador(a)</option>
            <option value="diretor">Diretor(a) Executivo(a)</option>
            <option value="gerente">Gerente Geral / Coordenador(a)</option>
            <option value="financeiro_comercial">Gestor(a) Financeiro ou Comercial</option>
            <option value="outro">Outro Profissional Autorizado</option>
          </select>
        </div>

        {/* Confirmação de Autorização Formal */}
        <div className={`p-4 rounded-xl border transition-colors ${
          isAuthorized ? 'border-blue-500 bg-blue-50/40' : 'border-slate-300 bg-white'
        }`}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAuthorized}
              onChange={(e) => setIsAuthorized(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <div className="space-y-1">
              <span className="font-semibold text-sm text-slate-900 block">
                Declaração de Autorização Institucional *
              </span>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                “Confirmo que estou autorizado(a) a fornecer estas informações em nome da empresa para fins de diagnóstico de maturidade e desenvolvimento gerencial.”
              </p>
            </div>
          </label>
        </div>
        {errors.isAuthorized && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.isAuthorized}</span>
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
            <span>Voltar aos Dados da Empresa</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Prosseguir para Perfil do Negócio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
