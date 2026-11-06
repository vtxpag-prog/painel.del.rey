import React, { useState } from 'react';
import {
  BusinessProfile,
  BusinessSegment,
  CompanyAge,
  TeamSize,
  MainGoal,
  MainBottleneck,
} from '../types/diagnosis';
import { Compass, ArrowRight, ArrowLeft } from 'lucide-react';

interface ProfileStepProps {
  initialProfile?: Partial<BusinessProfile>;
  defaultSegment?: BusinessSegment;
  onNext: (profile: BusinessProfile) => void;
  onBack: () => void;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
  initialProfile,
  defaultSegment = 'comercio',
  onNext,
  onBack,
}) => {
  const [segment, setSegment] = useState<BusinessSegment>(initialProfile?.segment || defaultSegment);
  const [age, setAge] = useState<CompanyAge>(initialProfile?.age || '4_a_10_anos');
  const [teamSize, setTeamSize] = useState<TeamSize>(initialProfile?.teamSize || '2_a_5');
  const [mainGoal, setMainGoal] = useState<MainGoal>(initialProfile?.mainGoal || 'aumentar_vendas');
  const [mainBottleneck, setMainBottleneck] = useState<MainBottleneck>(
    initialProfile?.mainBottleneck || 'fluxo_caixa'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      segment,
      age,
      teamSize,
      mainGoal,
      mainBottleneck,
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Cabeçalho da Etapa */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Etapa 4 de 5 · Perfil Operacional e Metas</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Contexto e Desafios Atuais
        </h2>
        <p className="text-sm text-slate-600">
          Estas respostas personalizam a interpretação das notas e ativam o módulo complementar setorial mais adequado.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pergunta 1: Segmento Principal */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">
            1. Qual é o principal segmento da empresa?
          </label>
          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value as BusinessSegment)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          >
            <option value="comercio">Comércio Varejista e Atacadista</option>
            <option value="alimentacao">Alimentação & Gastronomia (Restaurantes, Bares, Cafeterias)</option>
            <option value="servicos_pessoais">Serviços Pessoais, Estética e Bem-Estar</option>
            <option value="saude">Saúde & Cuidados (Clínicas, Consultórios, Laboratórios)</option>
            <option value="educacao">Educação, Treinamentos & Cursos</option>
            <option value="transporte_logistica">Transporte, Logística e Entregas</option>
            <option value="construcao">Construção Civil, Reformas e Arquitetura</option>
            <option value="industria">Indústria, Marcenaria e Confecção</option>
            <option value="servicos_empresariais">Serviços Empresariais (B2B, Advocacia, Contabilidade)</option>
            <option value="tecnologia">Tecnologia, Agências Digitais & Software</option>
            <option value="outro">Outro Segmento Operacional</option>
          </select>
        </div>

        {/* Pergunta 2: Tempo de Existência */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">
            2. Há quanto tempo a empresa existe?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'menos_1_ano', label: 'Menos de 1 ano' },
              { id: '1_a_3_anos', label: '1 a 3 anos' },
              { id: '4_a_10_anos', label: '4 a 10 anos' },
              { id: 'mais_10_anos', label: 'Mais de 10 anos' },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setAge(item.id as CompanyAge)}
                className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-colors text-center cursor-pointer ${
                  age === item.id
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pergunta 3: Tamanho da Equipe */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">
            3. Quantas pessoas trabalham na empresa atualmente (sócios + equipe)?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'somente_socios', label: 'Apenas os sócios' },
              { id: '2_a_5', label: '2 a 5 pessoas' },
              { id: '6_a_10', label: '6 a 10 pessoas' },
              { id: '11_a_30', label: '11 a 30 pessoas' },
              { id: 'mais_30', label: 'Mais de 30' },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setTeamSize(item.id as TeamSize)}
                className={`py-2.5 px-2 rounded-lg border text-xs font-medium transition-colors text-center cursor-pointer ${
                  teamSize === item.id
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pergunta 4: Principal Objetivo para os Próximos 12 Meses */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">
            4. Qual é o principal objetivo prioritário para os próximos 12 meses?
          </label>
          <select
            value={mainGoal}
            onChange={(e) => setMainGoal(e.target.value as MainGoal)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          >
            <option value="mais_clientes">Conseguir mais clientes e expandir presença na região</option>
            <option value="aumentar_vendas">Aumentar o volume de vendas e ticket médio</option>
            <option value="organizar_financas">Organizar as finanças, caixa e formação de preços</option>
            <option value="melhorar_processos">Padronizar processos operacionais e reduzir erros</option>
            <option value="digitalizar">Digitalizar canais de atendimento, vendas e gestão</option>
            <option value="equipe">Contratar, capacitar e reter equipe qualificada</option>
            <option value="expandir">Abrir nova filial, unidade física ou linha de produtos</option>
            <option value="reduzir_custos">Reduzir custos operacionais e desperdícios</option>
            <option value="outro">Outro objetivo estratégico</option>
          </select>
        </div>

        {/* Pergunta 5: Maior Dificuldade da Empresa Hoje */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">
            5. Qual é hoje o principal gargalo ou maior dificuldade sentida?
          </label>
          <select
            value={mainBottleneck}
            onChange={(e) => setMainBottleneck(e.target.value as MainBottleneck)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          >
            <option value="falta_clientes">Falta de clientes suficientes ou fluxo irregular</option>
            <option value="pouca_divulgacao">Pouca divulgação e baixa visibilidade digital/local</option>
            <option value="baixa_conversao">Clientes pedem preço/orçamento mas fecham pouco</option>
            <option value="fluxo_caixa">Instabilidade no fluxo de caixa e capital de giro curto</option>
            <option value="margem_preco">Margem de lucro apertada e dificuldade na formação de preços</option>
            <option value="processos_manuais">Excesso de processos manuais, papéis e retrabalho</option>
            <option value="falta_equipe">Dificuldade para contratar ou treinar colaboradores</option>
            <option value="tecnologia">Sistemas defasados ou ferramentas inadequadas</option>
            <option value="planejamento">Falta de tempo para planejar e excesso de apagar incêndios</option>
            <option value="outra">Outro desafio operacional</option>
          </select>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Responsável</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Iniciar as 25 Perguntas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
