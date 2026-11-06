import React, { useState, useMemo } from 'react';
import { DiagnosisResult, ScheduledMeeting, BusinessSegment } from '../types/diagnosis';
import { formatDateBR, formatDateTimeBR } from '../utils/validators';
import {
  ShieldCheck,
  Lock,
  Search,
  Filter,
  Download,
  Building2,
  Users2,
  TrendingUp,
  BarChart3,
  Calendar,
  AlertTriangle,
  Eye,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';

interface AdminDashboardProps {
  diagnoses: DiagnosisResult[];
  onClose: () => void;
  onSelectDiagnosisForView: (diagnosis: DiagnosisResult) => void;
}

interface AuditLog {
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  diagnoses,
  onClose,
  onSelectDiagnosisForView,
}) => {
  // Simple password check (padrão: admin123 para protótipo de diretoria)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('todos');
  const [selectedClassification, setSelectedClassification] = useState<string>('todas');
  const [includeDemo, setIncludeDemo] = useState(true);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      timestamp: new Date().toISOString(),
      user: 'diretoria@acidelrei.org.br',
      action: 'Acesso ao Painel Administrativo',
      details: 'Sessão administrativa iniciada.',
    },
  ]);

  // Selected single diagnosis for modal detail inspection
  const [inspectDiagnosis, setInspectDiagnosis] = useState<DiagnosisResult | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin123' || passwordInput === 'crescedelrei' || passwordInput === 'vortex') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // Filtered list
  const filteredList = useMemo(() => {
    return diagnoses.filter((d) => {
      if (!includeDemo && d.isDemo) return false;

      if (selectedSegment !== 'todos' && d.company.segment !== selectedSegment) {
        return false;
      }

      if (selectedClassification !== 'todas' && d.imeClassification !== selectedClassification) {
        return false;
      }

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = d.company.corporateName.toLowerCase().includes(query);
        const matchTrade = d.company.tradeName?.toLowerCase().includes(query);
        const matchCnpj = d.company.cnpj.includes(query);
        const matchResp = d.respondent.fullName.toLowerCase().includes(query);
        if (!matchName && !matchTrade && !matchCnpj && !matchResp) {
          return false;
        }
      }

      return true;
    });
  }, [diagnoses, includeDemo, selectedSegment, selectedClassification, searchTerm]);

  // Aggregate Metrics calculation
  const totalCount = filteredList.length;

  const imeScores = filteredList.map((d) => d.ime).sort((a, b) => a - b);
  const imeAverage = totalCount > 0 ? Math.round(imeScores.reduce((a, b) => a + b, 0) / totalCount) : 0;
  const imeMedian =
    totalCount > 0
      ? totalCount % 2 === 0
        ? Math.round((imeScores[totalCount / 2 - 1] + imeScores[totalCount / 2]) / 2)
        : imeScores[Math.floor(totalCount / 2)]
      : 0;

  const icdAverage =
    totalCount > 0 ? Math.round(filteredList.reduce((acc, d) => acc + d.icd, 0) / totalCount) : 0;

  const totalMeetings = filteredList.filter((d) => d.scheduledMeeting).length;
  const contactAuthorizedCount = filteredList.filter((d) => d.consents.consultantFollowup).length;

  // Distribution by classification
  const classificationCounts = {
    Crítico: filteredList.filter((d) => d.imeClassification === 'Crítico').length,
    Básico: filteredList.filter((d) => d.imeClassification === 'Básico').length,
    Estruturado: filteredList.filter((d) => d.imeClassification === 'Estruturado').length,
    Competitivo: filteredList.filter((d) => d.imeClassification === 'Competitivo').length,
    'Alta Performance': filteredList.filter((d) => d.imeClassification === 'Alta Performance').length,
  };

  // Pillar Averages
  const pillarAverages = {
    pilar1: totalCount > 0 ? (filteredList.reduce((acc, d) => acc + (d.pillarScores.pilar1?.score || 0), 0) / totalCount).toFixed(1) : 0,
    pilar2: totalCount > 0 ? (filteredList.reduce((acc, d) => acc + (d.pillarScores.pilar2?.score || 0), 0) / totalCount).toFixed(1) : 0,
    pilar3: totalCount > 0 ? (filteredList.reduce((acc, d) => acc + (d.pillarScores.pilar3?.score || 0), 0) / totalCount).toFixed(1) : 0,
    pilar4: totalCount > 0 ? (filteredList.reduce((acc, d) => acc + (d.pillarScores.pilar4?.score || 0), 0) / totalCount).toFixed(1) : 0,
    pilar5: totalCount > 0 ? (filteredList.reduce((acc, d) => acc + (d.pillarScores.pilar5?.score || 0), 0) / totalCount).toFixed(1) : 0,
  };

  // Export CSV Functions
  const handleExportCSV = (anonymous: boolean) => {
    const headers = anonymous
      ? ['ID', 'Segmento', 'Porte', 'Cidade', 'IME', 'Classificacao', 'ICD', 'P1_Vendas', 'P2_Digital', 'P3_Financas', 'P4_Processos', 'P5_Estrategia', 'Qtd_Alertas']
      : ['ID', 'Razao_Social', 'CNPJ', 'Responsavel', 'Email', 'Telefone', 'Segmento', 'Porte', 'Cidade', 'IME', 'Classificacao', 'ICD', 'Autorizou_Contato', 'Reuniao_Agendada'];

    const rows = filteredList.map((d) => {
      if (anonymous) {
        return [
          d.id,
          d.company.segment,
          d.company.revenueTier,
          d.company.city,
          d.ime,
          d.imeClassification,
          d.icd,
          d.pillarScores.pilar1?.score || 0,
          d.pillarScores.pilar2?.score || 0,
          d.pillarScores.pilar3?.score || 0,
          d.pillarScores.pilar4?.score || 0,
          d.pillarScores.pilar5?.score || 0,
          d.alerts.length,
        ].join(',');
      } else {
        return [
          d.id,
          `"${d.company.corporateName.replace(/"/g, '""')}"`,
          d.company.cnpj,
          `"${d.respondent.fullName.replace(/"/g, '""')}"`,
          d.respondent.email,
          d.respondent.phoneWhatsapp,
          d.company.segment,
          d.company.revenueTier,
          `"${d.company.city}"`,
          d.ime,
          d.imeClassification,
          d.icd,
          d.consents.consultantFollowup ? 'Sim' : 'Nao',
          d.scheduledMeeting ? 'Sim' : 'Nao',
        ].join(',');
      }
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cresce-delrei-${anonymous ? 'anonimizado' : 'nominal'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Registrar log de auditoria
    setAuditLogs((prev) => [
      {
        timestamp: new Date().toISOString(),
        user: 'diretoria@acidelrei.org.br',
        action: anonymous ? 'Exportação de CSV Anonimizado' : 'Exportação de CSV Nominal (Restrito)',
        details: `Exportados ${filteredList.length} registros.`,
      },
      ...prev,
    ]);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-slate-200 text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Acesso Administrativo Restrito
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Área exclusiva para Diretoria e Consultores da ACI Del-Rei e Vortex.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Senha de Acesso
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Digite a senha (padrão: admin123)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-200"
                autoFocus
              />
              {authError && (
                <span className="text-xs text-red-600 mt-1 block">
                  Senha incorreta. Tente <code>admin123</code> para demonstração.
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Voltar à página pública
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Entrar no Painel
              </button>
            </div>
          </form>

          <div className="p-3 bg-slate-50 rounded-lg text-2xs text-slate-400">
            Senha padrão de validação do protótipo: <strong>admin123</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 overflow-y-auto">
      {/* Top Header do Admin */}
      <div className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
            ADM
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base leading-tight">
              Painel de Gestão e Auditoria · Cresce Del-Rei
            </h2>
            <p className="text-2xs text-slate-400">
              ACI Del-Rei & Vortex Tecnologia · Dados Consolidados de São João del-Rei
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCSV(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Exportar CSV Estatístico Anonimizado sem dados pessoais"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar Anonimizado</span>
          </button>

          <button
            onClick={() => handleExportCSV(false)}
            className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Exportar CSV Nominal com Log de Auditoria"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar Nominal</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* ========================================================= */}
        {/* CARDS DE INDICADORES AGREGADOS (KPIs) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Avaliados
            </span>
            <div className="text-2xl font-extrabold text-slate-900">{totalCount}</div>
            <span className="text-2xs text-slate-500">empresas na base</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
              IME Médio
            </span>
            <div className="text-2xl font-extrabold text-blue-700">{imeAverage}</div>
            <span className="text-2xs text-slate-500">mediana: {imeMedian}/100</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
              ICD Médio
            </span>
            <div className="text-2xl font-extrabold text-emerald-700">{icdAverage}</div>
            <span className="text-2xs text-slate-500">capacidade digital</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
              Reuniões Agendadas
            </span>
            <div className="text-2xl font-extrabold text-indigo-700">{totalMeetings}</div>
            <span className="text-2xs text-slate-500">devolutivas Google Meet</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
              Autorizou Contato
            </span>
            <div className="text-2xl font-extrabold text-purple-700">{contactAuthorizedCount}</div>
            <span className="text-2xs text-slate-500">
              {totalCount > 0 ? Math.round((contactAuthorizedCount / totalCount) * 100) : 0}% opt-in
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
              Faixa Crítica
            </span>
            <div className="text-2xl font-extrabold text-red-600">{classificationCounts.Crítico}</div>
            <span className="text-2xs text-slate-500">demandam apoio urgente</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* GRÁFICOS DE MÉDIAS POR PILAR E DISTRIBUIÇÃO */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Média dos 5 Pilares */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                Média Regional por Pilar de Maturidade (0 a 20 pts)
              </h3>
              <BarChart3 className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3 pt-1">
              {[
                { name: 'P1: Vendas e Receita', val: Number(pillarAverages.pilar1), color: '#3B82F6' },
                { name: 'P2: Presença Digital', val: Number(pillarAverages.pilar2), color: '#10B981' },
                { name: 'P3: Finanças e Resiliência', val: Number(pillarAverages.pilar3), color: '#F59E0B' },
                { name: 'P4: Operações e Processos', val: Number(pillarAverages.pilar4), color: '#6366F1' },
                { name: 'P5: Estratégia e Pessoas', val: Number(pillarAverages.pilar5), color: '#8B5CF6' },
              ].map((pil) => (
                <div key={pil.name} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-medium">{pil.name}</span>
                    <strong className="text-slate-900">{pil.val} / 20</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (pil.val / 20) * 100)}%`,
                        backgroundColor: pil.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribuição por Classificação */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                Distribuição das Empresas por Classificação IME
              </h3>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2.5 pt-1 text-xs">
              {[
                { label: 'Crítico (0–39 pts)', count: classificationCounts.Crítico, bg: 'bg-red-500' },
                { label: 'Básico (40–59 pts)', count: classificationCounts.Básico, bg: 'bg-amber-500' },
                { label: 'Estruturado (60–79 pts)', count: classificationCounts.Estruturado, bg: 'bg-blue-500' },
                { label: 'Competitivo (80–94 pts)', count: classificationCounts.Competitivo, bg: 'bg-emerald-500' },
                { label: 'Alta Performance (95–100 pts)', count: classificationCounts['Alta Performance'], bg: 'bg-indigo-600' },
              ].map((item) => {
                const pct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-bold text-slate-900">
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${item.bg}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BARRA DE FILTROS E BUSCA */}
        {/* ========================================================= */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por Razão Social, CNPJ ou Responsável..."
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Segment filter */}
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="todos">Todos os Segmentos</option>
              <option value="comercio">Comércio</option>
              <option value="servicos_empresariais">Serviços</option>
              <option value="industria">Indústria</option>
              <option value="alimentacao">Alimentação</option>
              <option value="saude">Saúde</option>
            </select>

            {/* Classification filter */}
            <select
              value={selectedClassification}
              onChange={(e) => setSelectedClassification(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="todas">Todas as Classificações</option>
              <option value="Crítico">Crítico</option>
              <option value="Básico">Básico</option>
              <option value="Estruturado">Estruturado</option>
              <option value="Competitivo">Competitivo</option>
              <option value="Alta Performance">Alta Performance</option>
            </select>
          </div>

          {/* Toggle de Simulações Demo */}
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
            <input
              type="checkbox"
              checked={includeDemo}
              onChange={(e) => setIncludeDemo(e.target.checked)}
              className="w-3.5 h-3.5 text-blue-600 rounded"
            />
            <span>Incluir casos simulados de demonstração</span>
          </label>
        </div>

        {/* ========================================================= */}
        {/* TABELA DE CADASTROS INDIVIDUAIS */}
        {/* ========================================================= */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">Empresa / Razão Social</th>
                  <th className="py-3 px-4">CNPJ</th>
                  <th className="py-3 px-4">Segmento</th>
                  <th className="py-3 px-4 text-center">IME</th>
                  <th className="py-3 px-4">Classificação</th>
                  <th className="py-3 px-4 text-center">ICD</th>
                  <th className="py-3 px-4">Reunião</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Nenhum diagnóstico encontrado para os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{d.company.corporateName}</span>
                          {d.isDemo && (
                            <span className="text-3xs bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                              DEMO
                            </span>
                          )}
                        </div>
                        <span className="text-2xs text-slate-400 block font-normal">
                          Resp: {d.respondent.fullName} · {d.company.city}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600">
                        {d.company.cnpj}
                      </td>

                      <td className="py-3 px-4 capitalize">
                        {d.company.segment.replace('_', ' ')}
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-blue-700">
                        {d.ime}/100
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-2xs font-semibold ${
                            d.imeClassification === 'Crítico'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : d.imeClassification === 'Básico'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : d.imeClassification === 'Estruturado'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {d.imeClassification}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-emerald-700">
                        {d.icd}/100
                      </td>

                      <td className="py-3 px-4">
                        {d.scheduledMeeting ? (
                          <span className="text-2xs font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {d.scheduledMeeting.date}
                          </span>
                        ) : (
                          <span className="text-2xs text-slate-400">Não agendada</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setInspectDiagnosis(d)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-2xs transition-colors cursor-pointer"
                        >
                          Detalhes
                        </button>
                        <button
                          onClick={() => onSelectDiagnosisForView(d)}
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-2xs transition-colors cursor-pointer"
                        >
                          Abrir Relatório
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================= */}
        {/* LEADS ENVIADOS AO CRM DA VORTEX E LOGS DE AUDITORIA */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vortex CRM Dispatches */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Leads Transmitidos ao CRM da Vortex
              </span>
              <span className="text-2xs text-slate-400 font-normal">
                Sincronização de Consultorias
              </span>
            </div>

            {(() => {
              try {
                const raw = localStorage.getItem('vortex_crm_dispatches');
                const leads = raw ? JSON.parse(raw) : [];
                if (!leads || leads.length === 0) {
                  return (
                    <div className="text-2xs text-slate-400 py-4 text-center">
                      Nenhum lead enviado ao CRM nesta sessão até o momento.
                    </div>
                  );
                }
                return (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {leads.slice(0, 6).map((lead: any, i: number) => (
                      <div
                        key={lead.dispatchId || i}
                        className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-2xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 font-semibold truncate max-w-[200px]">
                            {lead.company?.corporateName}
                          </strong>
                          <span className="text-3xs font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {lead.consultancyEntity}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600 text-3xs">
                          <span>Resp: {lead.responsible?.fullName}</span>
                          <span>Reunião: {lead.meeting?.date} às {lead.meeting?.time}</span>
                        </div>
                        <div className="text-slate-400 font-mono text-3xs truncate">
                          ID: {lead.dispatchId} · IME: {lead.diagnosisMetrics?.ime}/100
                        </div>
                      </div>
                    ))}
                  </div>
                );
              } catch {
                return (
                  <div className="text-2xs text-slate-400 py-4 text-center">
                    Histórico do CRM indisponível.
                  </div>
                );
              }
            })()}
          </div>

          {/* Audit Logs */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
              <span className="flex items-center gap-1.5 text-slate-800">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Trilha de Auditoria e Conformidade (LGPD)
              </span>
              <span className="text-2xs text-slate-400 font-normal">
                Acesso seguro registrado
              </span>
            </div>

            <div className="space-y-1.5 text-2xs font-mono text-slate-600 max-h-56 overflow-y-auto">
              {auditLogs.slice(0, 7).map((log, i) => (
                <div key={i} className="flex flex-wrap items-center gap-1.5 border-b border-slate-50 pb-1">
                  <span className="text-slate-400">[{formatDateTimeBR(log.timestamp)}]</span>
                  <span className="font-bold text-slate-700">{log.user}</span>
                  <span className="text-blue-600">» {log.action}</span>
                  <span className="text-slate-500 font-sans">({log.details})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes da Empresa Inspecionada */}
      {inspectDiagnosis && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {inspectDiagnosis.company.corporateName}
                </h3>
                <p className="text-xs text-slate-500">
                  CNPJ: {inspectDiagnosis.company.cnpj} · Resp: {inspectDiagnosis.respondent.fullName}
                </p>
              </div>
              <button
                onClick={() => setInspectDiagnosis(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="text-slate-500 block">E-mail:</span>
                  <strong>{inspectDiagnosis.company.businessEmail}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">WhatsApp:</span>
                  <strong>{inspectDiagnosis.company.whatsapp}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Endereço:</span>
                  <span>{inspectDiagnosis.company.address}, {inspectDiagnosis.company.neighborhood}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Cidade/UF:</span>
                  <span>{inspectDiagnosis.company.city} - {inspectDiagnosis.company.state}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-800">Notas dos Pilares:</div>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {Object.values(inspectDiagnosis.pillarScores).map((p, i) => (
                    <div key={p.pillarId} className="p-2 rounded bg-blue-50 border border-blue-100">
                      <div className="text-2xs text-blue-800 font-medium">P{i + 1}</div>
                      <div className="text-sm font-bold text-blue-900">{p.score}/20</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div className="font-bold text-slate-800">Autorizações Registradas (Consentimento):</div>
                <div className="space-y-0.5 text-2xs text-slate-600">
                  <div>• Tratamento do Diagnóstico: Sim (Obrigatório)</div>
                  <div>• Receber Capacitações: {inspectDiagnosis.consents.marketingContact ? 'Sim' : 'Não'}</div>
                  <div>• Encaminhar a Consultor: {inspectDiagnosis.consents.consultantFollowup ? 'Sim' : 'Não'}</div>
                  <div>• Indicação a Parceiros: {inspectDiagnosis.consents.partnerReferral ? 'Sim' : 'Não'}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setInspectDiagnosis(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  const target = inspectDiagnosis;
                  setInspectDiagnosis(null);
                  onSelectDiagnosisForView(target);
                }}
                className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
              >
                Abrir Relatório Completo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
