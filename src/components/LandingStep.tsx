import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  BarChart,
  Target,
  Users2,
  Layers,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Lock,
  Download,
  Calendar,
  MessageSquare,
  FileText,
  ExternalLink,
} from 'lucide-react';

interface LandingStepProps {
  onStart: () => void;
  onOpenHowItWorks: () => void;
  onLoadDemo: (demoId: number) => void;
  onOpenPrivacy: () => void;
}

interface FaqItem {
  id: string;
  category: 'process' | 'security' | 'contact';
  question: string;
  answer: React.ReactNode;
}

export const LandingStep: React.FC<LandingStepProps> = ({
  onStart,
  onOpenHowItWorks,
  onLoadDemo,
  onOpenPrivacy,
}) => {
  const [selectedDemo, setSelectedDemo] = useState<number>(1);
  const [activeFaqCategory, setActiveFaqCategory] = useState<'all' | 'process' | 'security' | 'contact'>('all');
  const [openFaqItems, setOpenFaqItems] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-5': true,
  });

  const toggleFaq = (id: string) => {
    setOpenFaqItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqList: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'process',
      question: 'O que é o Diagnóstico Empresarial Cresce Del-Rei e qual é o seu objetivo?',
      answer: (
        <div className="space-y-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
          <p>
            O <strong>Diagnóstico Empresarial Cresce Del-Rei</strong> é uma iniciativa conjunta desenvolvida pela <strong>ACI Del-Rei</strong> (Associação Comercial e Industrial de São João del-Rei) em parceria técnica com a <strong>Vortex Tecnologia (VTXMais)</strong>.
          </p>
          <p>
            O objetivo é mapear a maturidade das micro, pequenas e médias empresas do município e região através de <strong>5 pilares estratégicos de gestão</strong> (Vendas, Presença Digital, Finanças, Processos & TI e Estratégia & Pessoas), revelando fortalezas, gargalos e um plano de evolução claro e executável.
          </p>
        </div>
      ),
    },
    {
      id: 'faq-2',
      category: 'process',
      question: 'Quanto tempo dura o preenchimento e como funciona a pontuação (IME e ICD)?',
      answer: (
        <div className="space-y-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
          <p>
            O preenchimento leva entre <strong>15 a 20 minutos</strong>. Você responderá 25 perguntas estratégicas universais (5 para cada pilar) e 5 perguntas complementares específicas do segmento da sua empresa.
          </p>
          <p>
            Ao finalizar, o sistema calcula na hora:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li><strong>IME (Índice de Maturidade Empresarial)</strong>: escala de 0 a 100 com 4 níveis (Inicial 0–39, Básico 40–59, Intermediário 60–79 e Avançado 80–100).</li>
            <li><strong>ICD (Índice de Capacidade Digital)</strong>: mede prontidão tecnológica, ferramentas digitais, presença online e segurança.</li>
            <li><strong>Gráfico Radar e Matriz de Priorização</strong>: visualização dos maiores pontos fortes e das 3 maiores prioridades de correção.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'faq-3',
      category: 'process',
      question: 'O diagnóstico é gratuito? Há custos ou obrigações contratuais posteriores?',
      answer: (
        <div className="space-y-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
          <p>
            <strong>Sim, é 100% gratuito e sem compromisso comercial.</strong>
          </p>
          <p>
            O programa foi estruturado para fortalecer o ecossistema empresarial local de São João del-Rei e do Campo das Vertentes. Ao emitir o relatório, você tem autonomia total para executar as recomendações com sua própria equipe, procurar a ACI Del-Rei ou buscar parceiros de sua preferência.
          </p>
        </div>
      ),
    },
    {
      id: 'faq-4',
      category: 'process',
      question: 'O que a minha empresa recebe imediatamente ao concluir o diagnóstico?',
      answer: (
        <div className="space-y-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
          <p>Você terá acesso imediato a:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block text-xs">1. Relatório Executivo Completo</strong>
              <span className="text-2xs text-slate-600">Com pontuações por dimensão, análise de riscos e síntese situacional.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block text-xs">2. Plano de Ação em 3 Horizontes</strong>
              <span className="text-2xs text-slate-600">Ações imediatas (30 dias), táticas (90 dias) e estruturais (12 meses).</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block text-xs">3. Download em PDF Profissional</strong>
              <span className="text-2xs text-slate-600">Documento pronto para impressão, reuniões de sócios e diretoria.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block text-xs">4. Opção de Consultoria Especializada</strong>
              <span className="text-2xs text-slate-600">Agendamento ou contato com especialistas da ACI Del-Rei ou Vortex.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'faq-5',
      category: 'security',
      question: 'Como os dados da minha empresa são protegidos conforme a LGPD?',
      answer: (
        <div className="space-y-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
          <p>
            A privacidade e a confidencialidade das empresas são garantidas rigorosamente em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li><strong>Criptografia em trânsito</strong>: Toda comunicação utiliza protocolo seguro HTTPS/TLS.</li>
            <li><strong>Finalidade Estrita</strong>: Os dados fornecidos (CNPJ, razão social, faturamento estimado e respostas) são utilizados exclusivamente para o cálculo do relatório gerencial.</li>
            <li><strong>Higienização Automática de Dados</strong>: Sempre que você seleciona a consultoria da Vortex ou ACI Del-Rei, após o envio seguro ao CRM, o sistema <strong>apaga os dados e rascunhos temporários do navegador</strong> para garantir que nenhum dado confidencial fique exposto.</li>
            <li><strong>Zero Venda de Dados</strong>: Jamais vendemos, repassamos ou compartilhamos dados com birôs de crédito ou marketing de terceiros.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'faq-6',
      category: 'security',
      question: 'Minhas respostas ou dados de faturamento podem ser vistos por concorrentes?',
      answer: (
        <div className="space-y-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
          <p>
            <strong>Absolutamente não.</strong> O sigilo empresarial é cláusula pétrea do projeto.
          </p>
          <p>
            Nenhum concorrente ou outra empresa tem acesso às informações individuais do seu negócio. Relatórios públicos ou estudos regionais divulgados pela ACI Del-Rei são <strong>estritamente agregados e anônimos</strong> (como percentuais de maturidade por setor em São João del-Rei), sem qualquer identificação de marcas ou CNPJs.
          </p>
        </div>
      ),
    },
    {
      id: 'faq-7',
      category: 'contact',
      question: 'Como posso entrar em contato com a equipe da ACI Del-Rei ou da Vortex / VTXMais?',
      answer: (
        <div className="space-y-3 text-slate-600 text-xs sm:text-sm leading-relaxed">
          <p>
            Você pode contatar diretamente os times responsáveis pelo projeto através dos canais oficiais listados abaixo:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
              <div className="font-bold text-blue-900 flex items-center gap-1.5 text-sm">
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>ACI Del-Rei</span>
              </div>
              <p className="text-slate-600 text-2xs">
                Associação Comercial e Industrial de São João del-Rei
              </p>
              <div className="space-y-1 text-slate-700 pt-1 font-medium">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <a href="tel:3233712000" className="hover:underline text-blue-800">
                    (32) 3371-2000
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <a href="mailto:contato@acidelrei.org.br" className="hover:underline text-blue-800">
                    contato@acidelrei.org.br
                  </a>
                </div>
                <div className="flex items-center gap-2 text-2xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>São João del-Rei, MG</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Vortex Tecnologia (VTXMais)</span>
              </div>
              <p className="text-slate-600 text-2xs">
                Consultoria de Inovação, CRM e Transformação Digital
              </p>
              <div className="space-y-1 text-slate-700 pt-1 font-medium">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <a href="mailto:vtxmais@gmail.com" className="hover:underline text-emerald-800">
                    vtxmais@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <a href="mailto:contato@vortextecnologia.com.br" className="hover:underline text-emerald-800">
                    contato@vortextecnologia.com.br
                  </a>
                </div>
                <div className="flex items-center gap-2 text-2xs text-slate-600">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Suporte a projetos & CRM integrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'faq-8',
      category: 'contact',
      question: 'Como funciona a reunião devolutiva com um consultor?',
      answer: (
        <div className="space-y-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
          <p>
            Ao concluir o diagnóstico, na <strong>Seção 10 do relatório final</strong>, você tem a opção de solicitar o acompanhamento de um consultor:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li><strong>Consultoria com a ACI Del-Rei</strong>: especializada em finanças, gestão geral, formação de preço e relacionamento comercial na região.</li>
            <li><strong>Consultoria com a Vortex Tecnologia</strong>: especializada em processos digitais, CRM, automação e inteligência artificial aplicada.</li>
          </ul>
          <p className="pt-1">
            Você pode agendar um horário direto no calendário via Google Meet ou solicitar que a equipe entre em contato. Assim que confirmada a sua opção, o sistema despacha o resumo para o CRM da Vortex e limpa automaticamente os dados da sessão local por segurança.
          </p>
        </div>
      ),
    },
  ];

  const filteredFaqs = activeFaqCategory === 'all'
    ? faqList
    : faqList.filter((item) => item.category === activeFaqCategory);


  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Institutional partner badge without pills */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-md px-3 py-1">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Realização: ACI Del-Rei</span>
          <span className="text-slate-400">·</span>
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Parceria: Vortex Tecnologia</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
          Descubra o próximo passo para sua empresa crescer
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          O <strong className="text-slate-800">Diagnóstico Empresarial Cresce Del-Rei</strong> ajuda sua empresa a identificar pontos fortes, gargalos e prioridades práticas de evolução em vendas, presença digital, finanças, processos, tecnologia, pessoas e crescimento.
        </p>

        {/* Informational Key Attributes */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-600 pt-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Tempo estimado: <strong>15 a 20 minutos</strong></span>
          </div>
          <span className="hidden sm:inline text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>Resultado preliminar: <strong>Imediato na tela e em PDF</strong></span>
          </div>
          <span className="hidden sm:inline text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>Dados protegidos: <strong>Conforme a LGPD</strong></span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-semibold text-base rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Começar diagnóstico gratuito</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHowItWorks}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-base rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Como funciona?</span>
          </button>
        </div>

        <p className="text-2xs sm:text-xs text-slate-500 pt-1">
          Sem compromisso comercial · Diagnóstico baseado em metodologia estruturada para São João del-Rei e região
        </p>
      </div>

      {/* 3 Core Benefits Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Identificar Prioridades Claras</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Entenda exatamente quais áreas da sua empresa necessitam de atenção imediata e quais já operam como alavancas seguras de sustentação.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sem jargões ou complexidade desnecessária</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <BarChart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Organizar Ações Práticas</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receba um plano de ação escalonado em 3 horizontes — 30 dias, 90 dias e 12 meses — pensado para a realidade operacional do seu segmento.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Matriz com impacto, esforço e responsáveis</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Conhecer Trilhas de Apoio</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Acesse programas de capacitação da ACI Del-Rei e orientação metodológica da Vortex, além da opção de agendar reunião devolutiva online.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Apoio institucional e diálogo próximo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Caixa de Demonstração Rápida para Avaliação e Diretoria */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Espaço de Avaliação Rápida da Diretoria</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                Deseja testar um caso simulado pronto?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Carregue um dos três perfis oficiais de demonstração para visualizar imediatamente o cálculo do IME, o relatório completo e o fluxo de agenda.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6">
            <button
              onClick={() => { setSelectedDemo(1); onLoadDemo(1); }}
              className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                selectedDemo === 1
                  ? 'border-blue-500 bg-blue-950/60 text-white ring-1 ring-blue-500'
                  : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="font-bold text-xs text-blue-300">Caso 1: Microempresa</div>
              <div className="text-xs text-white font-medium mt-0.5">Oficina Dom Bosco</div>
              <div className="text-2xs text-slate-400 mt-1">
                Boas finanças, baixa presença digital. IME 46/100 (Básico).
              </div>
            </button>

            <button
              onClick={() => { setSelectedDemo(2); onLoadDemo(2); }}
              className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                selectedDemo === 2
                  ? 'border-blue-500 bg-blue-950/60 text-white ring-1 ring-blue-500'
                  : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="font-bold text-xs text-blue-300">Caso 2: Serviços</div>
              <div className="text-xs text-white font-medium mt-0.5">Vertente Arquitetura</div>
              <div className="text-2xs text-slate-400 mt-1">
                Bom digital, funil de vendas crítico. IME 44/100 (Básico).
              </div>
            </button>

            <button
              onClick={() => { setSelectedDemo(3); onLoadDemo(3); }}
              className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                selectedDemo === 3
                  ? 'border-blue-500 bg-blue-950/60 text-white ring-1 ring-blue-500'
                  : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="font-bold text-xs text-blue-300">Caso 3: Indústria</div>
              <div className="text-xs text-white font-medium mt-0.5">Laticínios Del-Rei</div>
              <div className="text-2xs text-slate-400 mt-1">
                Estruturada, alta maturidade, foco em escala. IME 78/100.
              </div>
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-2xs text-slate-500">
            <span>Ambiente de demonstração. Os dados exibidos são fictícios para fins de validação da metodologia.</span>
          </div>
        </div>
      </div>

      {/* Cinco Pilares Explicados */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Os 5 Pilares de Avaliação da Metodologia
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            A pesquisa contempla 25 questões calibradas, distribuídas igualmente em cinco dimensões estratégicas essenciais para o dia a dia empresarial.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-1.5">
            <div className="text-xs font-bold text-blue-700">Pilar 1 (20%)</div>
            <div className="font-semibold text-slate-900 text-sm">Receita & Vendas</div>
            <p className="text-2xs text-slate-500">
              Público, funil, rotina de follow-up e indicadores de conversão.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-1.5">
            <div className="text-xs font-bold text-emerald-700">Pilar 2 (20%)</div>
            <div className="font-semibold text-slate-900 text-sm">Presença Digital</div>
            <p className="text-2xs text-slate-500">
              Google Perfil, WhatsApp Business, consistência e atração local.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-1.5">
            <div className="text-xs font-bold text-amber-700">Pilar 3 (20%)</div>
            <div className="font-semibold text-slate-900 text-sm">Finanças & Caixa</div>
            <p className="text-2xs text-slate-500">
              Separação de contas, fluxo de caixa, margem e capital de giro.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-1.5">
            <div className="text-xs font-bold text-indigo-700">Pilar 4 (20%)</div>
            <div className="font-semibold text-slate-900 text-sm">Processos & TI</div>
            <p className="text-2xs text-slate-500">
              Processos críticos, sistemas de gestão, automações e segurança.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-1.5">
            <div className="text-xs font-bold text-purple-700">Pilar 5 (20%)</div>
            <div className="font-semibold text-slate-900 text-sm">Estratégia & Pessoas</div>
            <p className="text-2xs text-slate-500">
              Metas claras, treinamento da equipe e uso consciente de IA.
            </p>
          </div>
        </div>
      </div>

      {/* Seção de Perguntas Frequentes (FAQ) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tire suas Dúvidas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Perguntas Frequentes (FAQ)
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Entenda como funciona o cálculo do diagnóstico, como seus dados empresariais são protegidos pela LGPD e os canais de contato da ACI Del-Rei e da Vortex / VTXMais.
          </p>

          {/* Filtros de Categoria */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveFaqCategory('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeFaqCategory === 'all'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todas ({faqList.length})
            </button>
            <button
              onClick={() => setActiveFaqCategory('process')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeFaqCategory === 'process'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Diagnóstico & Relatório
            </button>
            <button
              onClick={() => setActiveFaqCategory('security')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeFaqCategory === 'security'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Segurança & LGPD
            </button>
            <button
              onClick={() => setActiveFaqCategory('contact')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeFaqCategory === 'contact'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Contato & Equipe (ACI / VTXMais)
            </button>
          </div>
        </div>

        {/* Lista Accordion */}
        <div className="space-y-3">
          {filteredFaqs.map((item) => {
            const isOpen = !!openFaqItems[item.id];
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all hover:border-slate-300"
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0">
                      {item.category === 'security' ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      ) : item.category === 'contact' ? (
                        <Phone className="w-4 h-4 text-purple-600" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {item.question}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xs font-medium text-slate-500 uppercase tracking-wider">
                          {item.category === 'process'
                            ? 'Processo do Diagnóstico'
                            : item.category === 'security'
                            ? 'Privacidade & LGPD'
                            : 'Canais de Atendimento'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="p-1 rounded-md bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 pt-2 border-t border-slate-100 bg-white">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Card institucional de contato rápido e ação */}
        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="text-xs font-semibold text-blue-300 flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Precisa de suporte ou tem outra dúvida?</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Fale com as equipes da ACI Del-Rei e Vortex (VTXMais)
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Nossos especialistas estão à disposição para orientar sua empresa antes, durante ou após a realização do diagnóstico empresarial.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-2xs text-slate-200">
              <a
                href="mailto:contato@acidelrei.org.br"
                className="inline-flex items-center gap-1 hover:text-white underline"
              >
                <Mail className="w-3 h-3 text-blue-400" />
                contato@acidelrei.org.br
              </a>
              <span>·</span>
              <a
                href="mailto:vtxmais@gmail.com"
                className="inline-flex items-center gap-1 hover:text-white underline"
              >
                <Mail className="w-3 h-3 text-emerald-400" />
                vtxmais@gmail.com
              </a>
              <span>·</span>
              <a
                href="tel:3233712000"
                className="inline-flex items-center gap-1 hover:text-white underline"
              >
                <Phone className="w-3 h-3 text-purple-400" />
                (32) 3371-2000
              </a>
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Iniciar diagnóstico</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Aviso Curto de Privacidade e Segurança */}
      <div className="max-w-3xl mx-auto px-4 text-center space-y-2">
        <p className="text-xs text-slate-500 leading-relaxed">
          Seus dados empresariais e de contato serão armazenados com estrita segurança e tratados exclusivamente para a geração do relatório do diagnóstico, conforme a Lei Geral de Proteção de Dados (LGPD).
        </p>
        <button
          onClick={onOpenPrivacy}
          className="text-xs text-blue-700 hover:underline font-medium cursor-pointer"
        >
          Consultar a Política de Privacidade e Tratamento de Dados completa
        </button>
      </div>
    </div>
  );
};
