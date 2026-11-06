import React, { useState } from 'react';
import { CompanyData, BusinessSegment, CompanyRevenueTier } from '../types/diagnosis';
import {
  formatCNPJ,
  validateCNPJ,
  formatCEP,
  formatPhone,
  validateEmail,
  cleanNumeric,
} from '../utils/validators';
import { Building2, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2, History } from 'lucide-react';

interface CompanyStepProps {
  initialData?: Partial<CompanyData>;
  onNext: (data: CompanyData) => void;
  onBack: () => void;
  existingCnpjs?: string[];
}

export const CompanyStep: React.FC<CompanyStepProps> = ({
  initialData,
  onNext,
  onBack,
  existingCnpjs = [],
}) => {
  const [corporateName, setCorporateName] = useState(initialData?.corporateName || '');
  const [tradeName, setTradeName] = useState(initialData?.tradeName || '');
  const [cnpj, setCnpj] = useState(initialData?.cnpj || '');
  const [segment, setSegment] = useState<BusinessSegment>(initialData?.segment || 'comercio');
  const [revenueTier, setRevenueTier] = useState<CompanyRevenueTier>(initialData?.revenueTier || 'micro');
  const [address, setAddress] = useState(initialData?.address || '');
  const [neighborhood, setNeighborhood] = useState(initialData?.neighborhood || '');
  const [city, setCity] = useState(initialData?.city || 'São João del-Rei');
  const [state, setState] = useState(initialData?.state || 'MG');
  const [zipCode, setZipCode] = useState(initialData?.zipCode || '36300-000');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp || '');
  const [businessEmail, setBusinessEmail] = useState(initialData?.businessEmail || '');
  const [website, setWebsite] = useState(initialData?.website || '');
  const [socialMedia, setSocialMedia] = useState(initialData?.socialMedia || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasPreviousDiagnosis, setHasPreviousDiagnosis] = useState(false);

  const handleCnpjChange = (value: string) => {
    const formatted = formatCNPJ(value);
    setCnpj(formatted);

    // Checar se CNPJ já existe
    const clean = cleanNumeric(formatted);
    if (clean.length === 14) {
      if (!validateCNPJ(formatted)) {
        setErrors((prev) => ({ ...prev, cnpj: 'CNPJ inválido (dígitos verificadores incorretos).' }));
      } else {
        setErrors((prev) => {
          const { cnpj: _, ...rest } = prev;
          return rest;
        });

        // Verificar se consta diagnóstico anterior de forma anônima e segura
        const found = existingCnpjs.some((c) => cleanNumeric(c) === clean);
        setHasPreviousDiagnosis(found);
      }
    } else {
      setHasPreviousDiagnosis(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!corporateName.trim()) {
      newErrors.corporateName = 'Razão Social ou Nome Empresarial é obrigatório.';
    }

    if (!cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório.';
    } else if (!validateCNPJ(cnpj)) {
      newErrors.cnpj = 'CNPJ inválido. Verifique os números digitados.';
    }

    if (!businessEmail.trim()) {
      newErrors.businessEmail = 'E-mail empresarial é obrigatório.';
    } else if (!validateEmail(businessEmail)) {
      newErrors.businessEmail = 'E-mail inválido. Exemplo: contato@empresa.com.br';
    }

    if (!whatsapp.trim() || cleanNumeric(whatsapp).length < 10) {
      newErrors.whatsapp = 'WhatsApp com DDD é obrigatório para envio do relatório.';
    }

    if (!address.trim()) {
      newErrors.address = 'Endereço completo é obrigatório.';
    }

    if (!neighborhood.trim()) {
      newErrors.neighborhood = 'Bairro é obrigatório.';
    }

    if (!city.trim()) {
      newErrors.city = 'Cidade é obrigatória.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onNext({
      corporateName: corporateName.trim(),
      tradeName: tradeName.trim() || undefined,
      cnpj,
      segment,
      revenueTier,
      address: address.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode,
      phone: phone.trim() || whatsapp.trim(),
      whatsapp: whatsapp.trim(),
      businessEmail: businessEmail.trim(),
      website: website.trim() || undefined,
      socialMedia: socialMedia.trim() || undefined,
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Cabeçalho da Etapa */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Etapa 2 de 5 · Identificação da Empresa</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Dados Cadastrais da Empresa
        </h2>
        <p className="text-sm text-slate-600">
          Informe os dados institucionais da empresa para geração formal do cabeçalho do relatório e adequação dos módulos setoriais.
        </p>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        {/* Aviso de diagnóstico anterior encontrado */}
        {hasPreviousDiagnosis && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <History className="w-4 h-4" />
              <span>Diagnóstico Anterior Localizado</span>
            </div>
            <p className="leading-relaxed">
              Identificamos com segurança que já existe um registro prévio para este CNPJ na base da ACI Del-Rei. Ao concluir este formulário, um novo diagnóstico atualizado será gerado para acompanhamento de evolução da empresa.
            </p>
          </div>
        )}

        {/* Linha 1: Razão Social e Nome Fantasia */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Razão Social (Nome Oficial) *
            </label>
            <input
              type="text"
              value={corporateName}
              onChange={(e) => setCorporateName(e.target.value)}
              placeholder="Ex.: Silva & Santos Comércio de Roupas Ltda"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                errors.corporateName ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
              }`}
            />
            {errors.corporateName && (
              <span className="text-xs text-red-600 mt-1 block">{errors.corporateName}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nome Fantasia (Como a loja é conhecida)
            </label>
            <input
              type="text"
              value={tradeName}
              onChange={(e) => setTradeName(e.target.value)}
              placeholder="Ex.: Loja Del-Rei Modas"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Linha 2: CNPJ, Segmento e Porte */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              CNPJ (Validado via algoritmo) *
            </label>
            <input
              type="text"
              value={cnpj}
              onChange={(e) => handleCnpjChange(e.target.value)}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 ${
                errors.cnpj ? 'border-red-400 focus:ring-red-200 bg-red-50/20' : 'border-slate-300 focus:ring-blue-200'
              }`}
            />
            {errors.cnpj ? (
              <span className="text-xs text-red-600 mt-1 block">{errors.cnpj}</span>
            ) : (
              <span className="text-2xs text-slate-400 mt-0.5 block">Dígitos conferidos matematicamente</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Segmento Principal *
            </label>
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value as BusinessSegment)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            >
              <option value="comercio">Comércio Varejista/Atacadista</option>
              <option value="alimentacao">Alimentação & Gastronomia</option>
              <option value="servicos_pessoais">Serviços Pessoais & Beleza</option>
              <option value="saude">Saúde & Bem-Estar</option>
              <option value="educacao">Educação & Treinamento</option>
              <option value="transporte_logistica">Transporte & Logística</option>
              <option value="construcao">Construção Civil & Reformas</option>
              <option value="industria">Indústria & Produção</option>
              <option value="servicos_empresariais">Serviços Empresariais & B2B</option>
              <option value="tecnologia">Tecnologia & Informática</option>
              <option value="outro">Outro Segmento</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Porte / Faixa de Faturamento
            </label>
            <select
              value={revenueTier}
              onChange={(e) => setRevenueTier(e.target.value as CompanyRevenueTier)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            >
              <option value="mei">MEI (Até R$ 81 mil/ano)</option>
              <option value="micro">Microempresa (Até R$ 360 mil/ano)</option>
              <option value="pequena">Empresa de Pequeno Porte (R$ 360k a R$ 4,8M)</option>
              <option value="media">Média Empresa</option>
              <option value="grande">Grande Empresa</option>
              <option value="prefiro_nao_informar">Prefiro não informar</option>
            </select>
          </div>
        </div>

        {/* Linha 3: Endereço, Bairro e CEP */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Endereço Completo (Rua, Número, Sala) *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex.: Rua Marechal Deodoro, 120"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                errors.address ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
              }`}
            />
            {errors.address && <span className="text-xs text-red-600 mt-1 block">{errors.address}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bairro *
            </label>
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Ex.: Centro"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                errors.neighborhood ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
              }`}
            />
            {errors.neighborhood && <span className="text-xs text-red-600 mt-1 block">{errors.neighborhood}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              CEP
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(formatCEP(e.target.value))}
              placeholder="36300-000"
              maxLength={9}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Linha 4: Cidade e Estado */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cidade / Município *
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="São João del-Rei"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                errors.city ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
              }`}
            />
            {errors.city && <span className="text-xs text-red-600 mt-1 block">{errors.city}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Estado (UF) *
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
              placeholder="MG"
              maxLength={2}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-center uppercase font-bold focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Linha 5: Contatos Empresariais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              WhatsApp da Empresa *
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
              placeholder="(32) 99999-0000"
              maxLength={15}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 ${
                errors.whatsapp ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
              }`}
            />
            {errors.whatsapp && <span className="text-xs text-red-600 mt-1 block">{errors.whatsapp}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Telefone Fixo / Comercial
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(32) 3371-0000"
              maxLength={15}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              E-mail Empresarial *
            </label>
            <input
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              placeholder="contato@suaempresa.com.br"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                errors.businessEmail ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
              }`}
            />
            {errors.businessEmail && <span className="text-xs text-red-600 mt-1 block">{errors.businessEmail}</span>}
          </div>
        </div>

        {/* Linha 6: Presença Digital (Site e Instagram) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Site da Empresa (se houver)
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://suaempresa.com.br"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Instagram ou Rede Social Principal
            </label>
            <input
              type="text"
              value={socialMedia}
              onChange={(e) => setSocialMedia(e.target.value)}
              placeholder="@suaempresa_sjr"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Consentimento</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Prosseguir para Responsável</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
