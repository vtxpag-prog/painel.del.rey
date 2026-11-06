import React, { useState } from 'react';
import { DiagnosisResult, BusinessSegment } from '../types/diagnosis';
import {
  SEGMENT_BENCHMARKS,
  SegmentBenchmark,
  getSegmentBenchmark,
  calculateEstimatedPercentile,
} from '../data/segmentBenchmarks';
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Building2,
  Users2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';

interface SegmentComparisonCardProps {
  diagnosis: DiagnosisResult;
}

export const SegmentComparisonCard: React.FC<SegmentComparisonCardProps> = ({ diagnosis }) => {
  const [selectedSegmentKey, setSelectedSegmentKey] = useState<string>(
    diagnosis.company.segment || 'comercio'
  );
  const [chartType, setChartType] = useState<'radar' | 'bar'>('radar');

  const benchmark: SegmentBenchmark =
    SEGMENT_BENCHMARKS[selectedSegmentKey] || getSegmentBenchmark(diagnosis.company.segment);

  const userIme = diagnosis.ime;
  const userIcd = diagnosis.icd;
  const avgIme = benchmark.averageIme;
  const avgIcd = benchmark.averageIcd;

  const imeDiff = Number((userIme - avgIme).toFixed(1));
  const icdDiff = Number((userIcd - avgIcd).toFixed(1));

  const percentile = calculateEstimatedPercentile(userIme, avgIme);

  // Pillars comparison
  const pillarKeys = [
    { key: 'pilar1', label: 'Vendas & Receita', short: 'Vendas' },
    { key: 'pilar2', label: 'Presença Digital', short: 'Digital' },
    { key: 'pilar3', label: 'Finanças & Caixa', short: 'Finanças' },
    { key: 'pilar4', label: 'Processos & TI', short: 'Processos' },
    { key: 'pilar5', label: 'Estratégia & Pessoas', short: 'Estratégia' },
  ] as const;

  const pillarData = pillarKeys.map((p) => {
    const userScore = diagnosis.pillarScores[p.key]?.score || 0;
    const avgScore = benchmark.pillarAverages[p.key] || 10;
    const diff = Number((userScore - avgScore).toFixed(1));
    return {
      id: p.key,
      name: p.label,
      short: p.short,
      userScore,
      avgScore,
      diff,
      userPercentage: Math.round((userScore / 20) * 100),
      avgPercentage: Math.round((avgScore / 20) * 100),
    };
  });

  // Calculate best advantage and biggest gap
  const sortedByAdvantage = [...pillarData].sort((a, b) => b.diff - a.diff);
  const bestPillar = sortedByAdvantage[0];
  const weakestPillar = sortedByAdvantage[sortedByAdvantage.length - 1];

  // SVG Radar Chart Coordinates (Center 160, 160 with Radius 110)
  const cx = 160;
  const cy = 160;
  const radius = 100;
  const numAxes = 5;

  const getCoordinates = (index: number, value: number, maxVal = 20) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const clampedVal = Math.max(0, Math.min(maxVal, value));
    const r = (clampedVal / maxVal) * radius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y };
  };

  const getGridPolygon = (levelFraction: number) => {
    const points = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
      const r = levelFraction * radius;
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return points.join(' ');
  };

  const userPolygonPoints = pillarData
    .map((p, idx) => {
      const coords = getCoordinates(idx, p.userScore, 20);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  const benchmarkPolygonPoints = pillarData
    .map((p, idx) => {
      const coords = getCoordinates(idx, p.avgScore, 20);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header with Segment Selector and Chart Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Benchmark Competitivo Regional · São João del-Rei</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Comparativo com a Média do Segmento
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
            Compare o nível de maturidade da <strong>{diagnosis.company.corporateName}</strong> com o desempenho médio de outras empresas do mesmo setor na região.
          </p>
        </div>

        {/* Controls: Segment picker and chart toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segment Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedSegmentKey}
              onChange={(e) => setSelectedSegmentKey(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold text-xs focus:outline-hidden cursor-pointer"
            >
              <optgroup label="Seu Segmento Principal">
                <option value={diagnosis.company.segment}>
                  {diagnosis.company.segment in SEGMENT_BENCHMARKS
                    ? `${SEGMENT_BENCHMARKS[diagnosis.company.segment].name} (Seu Setor)`
                    : 'Seu Setor Atual'}
                </option>
              </optgroup>
              <optgroup label="Média Geral Regional">
                <option value="geral">Média Geral de Todos os Setores</option>
              </optgroup>
              <optgroup label="Outros Setores em São João del-Rei">
                {Object.entries(SEGMENT_BENCHMARKS)
                  .filter(([k]) => k !== diagnosis.company.segment && k !== 'geral')
                  .map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.name}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Toggle Radar / Bar (Apenas tela) */}
          <div className="no-print inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
            <button
              onClick={() => setChartType('radar')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartType === 'radar'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Gráfico Radar (Teia)</span>
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartType === 'bar'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Gráfico de Barras</span>
            </button>
          </div>

          {/* Indicador formatado para Impressão */}
          <div className="hidden print-block text-2xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
            {chartType === 'radar' ? 'Visualização: Gráfico Radar (Teia)' : 'Visualização: Gráfico Comparativo de Barras'}
          </div>
        </div>
      </div>

      {/* Big Numbers Comparison Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* IME comparison */}
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-1.5">
          <div className="flex items-center justify-between text-2xs font-bold text-slate-500 uppercase tracking-wider">
            <span>IME (Maturidade Geral)</span>
            <span className="text-blue-700 font-bold">Escala 0–100</span>
          </div>
          <div className="flex items-baseline gap-3">
            <div className="text-3xl font-extrabold text-blue-900">{userIme}</div>
            <span className="text-slate-400 font-normal text-xs">vs</span>
            <div className="text-xl font-bold text-amber-700">{avgIme}</div>
            <span className="text-2xs text-slate-500 font-medium">(Média {benchmark.name})</span>
          </div>
          <div className="pt-1 flex items-center gap-1.5 text-xs">
            {imeDiff > 0 ? (
              <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{imeDiff} pts acima da média
              </span>
            ) : imeDiff < 0 ? (
              <span className="inline-flex items-center gap-0.5 text-amber-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded-md">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {imeDiff} pts abaixo da média
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-slate-700 font-bold bg-slate-200 px-2 py-0.5 rounded-md">
                <Minus className="w-3.5 h-3.5" />
                Igual à média do setor
              </span>
            )}
          </div>
        </div>

        {/* ICD comparison */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-1.5">
          <div className="flex items-center justify-between text-2xs font-bold text-slate-500 uppercase tracking-wider">
            <span>ICD (Capacidade Digital)</span>
            <span className="text-emerald-700 font-bold">Escala 0–100</span>
          </div>
          <div className="flex items-baseline gap-3">
            <div className="text-3xl font-extrabold text-emerald-900">{userIcd}</div>
            <span className="text-slate-400 font-normal text-xs">vs</span>
            <div className="text-xl font-bold text-amber-700">{avgIcd}</div>
            <span className="text-2xs text-slate-500 font-medium">(Média)</span>
          </div>
          <div className="pt-1 flex items-center gap-1.5 text-xs">
            {icdDiff > 0 ? (
              <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{icdDiff} pts mais digital
              </span>
            ) : icdDiff < 0 ? (
              <span className="inline-flex items-center gap-0.5 text-amber-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded-md">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {icdDiff} pts menos digital
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-slate-700 font-bold bg-slate-200 px-2 py-0.5 rounded-md">
                <Minus className="w-3.5 h-3.5" />
                Na média digital
              </span>
            )}
          </div>
        </div>

        {/* Percentile and sample info */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between text-2xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Posição no Setor</span>
            <span className="text-slate-500 font-normal">Amostra {benchmark.sampleSize} empresas</span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-extrabold text-slate-900">Top {100 - percentile}%</div>
            <span className="text-2xs font-semibold text-slate-600">(Percentil ~{percentile}%)</span>
          </div>
          <p className="text-2xs text-slate-600 leading-tight pt-1">
            {userIme >= avgIme
              ? `Sua empresa supera cerca de ${percentile}% dos concorrentes de ${benchmark.name} da região.`
              : `Há margem de avanço para alcançar os líderes locais de ${benchmark.name}.`}
          </p>
        </div>
      </div>

      {/* Main Visuals Area: Radar Overlay OR Bar Chart */}
      {chartType === 'radar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Radar Chart SVG */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-50/70 rounded-xl p-4 sm:p-6 border border-slate-100">
            <div className="w-full max-w-[340px] aspect-square relative">
              <svg viewBox="0 0 320 320" className="w-full h-full overflow-visible">
                {/* Background circles/polygons */}
                {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
                  <polygon
                    key={i}
                    points={getGridPolygon(level)}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth={level === 1.0 ? '1.5' : '1'}
                    strokeDasharray={level === 1.0 ? 'none' : '3 3'}
                  />
                ))}

                {/* Concentric grid labels */}
                <text x={cx + 4} y={cy - radius * 0.25 - 2} className="text-[9px] fill-slate-400 font-mono">
                  5 pts
                </text>
                <text x={cx + 4} y={cy - radius * 0.5 - 2} className="text-[9px] fill-slate-400 font-mono">
                  10 pts
                </text>
                <text x={cx + 4} y={cy - radius * 0.75 - 2} className="text-[9px] fill-slate-400 font-mono">
                  15 pts
                </text>
                <text x={cx + 4} y={cy - radius - 2} className="text-[9px] fill-slate-400 font-mono">
                  20 pts
                </text>

                {/* Axis lines */}
                {pillarData.map((_, idx) => {
                  const coords = getCoordinates(idx, 20, 20);
                  return (
                    <line
                      key={idx}
                      x1={cx}
                      y1={cy}
                      x2={coords.x}
                      y2={coords.y}
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Benchmark Polygon (Dashed Amber) */}
                <polygon
                  points={benchmarkPolygonPoints}
                  fill="#f59e0b"
                  fillOpacity="0.18"
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* User Polygon (Vibrant Blue) */}
                <polygon
                  points={userPolygonPoints}
                  fill="#2563eb"
                  fillOpacity="0.28"
                  stroke="#1d4ed8"
                  strokeWidth="2.5"
                />

                {/* Benchmark apex points (Diamonds / Squares) */}
                {pillarData.map((p, idx) => {
                  const coords = getCoordinates(idx, p.avgScore, 20);
                  return (
                    <rect
                      key={`bm-${idx}`}
                      x={coords.x - 3.5}
                      y={coords.y - 3.5}
                      width="7"
                      height="7"
                      fill="#d97706"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      transform={`rotate(45 ${coords.x} ${coords.y})`}
                    />
                  );
                })}

                {/* User apex points (Circles) */}
                {pillarData.map((p, idx) => {
                  const coords = getCoordinates(idx, p.userScore, 20);
                  return (
                    <circle
                      key={`u-${idx}`}
                      cx={coords.x}
                      cy={coords.y}
                      r="4.5"
                      fill="#1d4ed8"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  );
                })}

                {/* Pillar labels positioned outside apexes */}
                {pillarData.map((p, idx) => {
                  const labelCoords = getCoordinates(idx, 24, 20);
                  const isTop = idx === 0;
                  const isRight = idx === 1;
                  const isBottomRight = idx === 2;
                  const isBottomLeft = idx === 3;
                  const isLeft = idx === 4;

                  let anchor: 'middle' | 'start' | 'end' = 'middle';
                  if (isRight || isBottomRight) anchor = 'start';
                  if (isLeft || isBottomLeft) anchor = 'end';

                  return (
                    <g key={`lbl-${idx}`}>
                      <text
                        x={labelCoords.x}
                        y={labelCoords.y}
                        textAnchor={anchor}
                        className="text-[10px] font-bold fill-slate-800"
                      >
                        {p.short}
                      </text>
                      <text
                        x={labelCoords.x}
                        y={labelCoords.y + 11}
                        textAnchor={anchor}
                        className="text-[9px] font-medium fill-slate-500"
                      >
                        {p.userScore} vs {p.avgScore}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend for Radar */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-200/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-700 border-2 border-white shadow-2xs" />
                <span className="font-bold text-slate-900">
                  Sua Empresa ({diagnosis.company.tradeName || diagnosis.company.corporateName.slice(0, 20)})
                </span>
                <span className="text-2xs text-blue-800 font-bold bg-blue-100 px-1.5 py-0.2 rounded">
                  IME {userIme}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-xs bg-amber-500 border border-amber-600 rotate-45 shadow-2xs" />
                <span className="font-semibold text-slate-700">
                  Média do Setor ({benchmark.name})
                </span>
                <span className="text-2xs text-amber-800 font-bold bg-amber-100 px-1.5 py-0.2 rounded">
                  IME {avgIme}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Comparative Pillars Cards */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-xs font-bold text-slate-800 pb-1 flex items-center justify-between">
              <span>Desempenho por Pilar vs Média Regional</span>
              <span className="text-2xs text-slate-400">Escala de 0 a 20 pts</span>
            </div>

            {pillarData.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-slate-900 truncate">{p.name}</div>
                  <div className="flex items-center gap-2 text-2xs text-slate-500">
                    <span>Você: <strong>{p.userScore}/20</strong></span>
                    <span>·</span>
                    <span>Setor: <strong>{p.avgScore}/20</strong></span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {p.diff > 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-2xs">
                      +{p.diff} pts
                    </span>
                  ) : p.diff < 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-2xs">
                      {p.diff} pts
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium text-2xs">
                      Média
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Bar Chart Comparative View */
        <div className="space-y-4 bg-slate-50/70 p-4 sm:p-6 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-2 border-b border-slate-200">
            <span>Dimensões de Avaliação</span>
            <div className="flex items-center gap-4 text-2xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-900">
                <span className="w-3 h-3 bg-blue-700 rounded-xs" />
                Sua Empresa
              </span>
              <span className="flex items-center gap-1.5 text-amber-800">
                <span className="w-3 h-3 bg-amber-500 rounded-xs" />
                Média do Segmento
              </span>
            </div>
          </div>

          {/* Bar Items */}
          <div className="space-y-4">
            {/* IME Global Bar */}
            <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">Índice Geral de Maturidade (IME)</span>
                <span className="text-2xs font-bold text-blue-900">
                  {userIme} vs {avgIme} pts ({imeDiff > 0 ? `+${imeDiff}` : imeDiff} pts)
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {/* User bar */}
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-medium text-slate-500 w-16 shrink-0">Sua Empresa</span>
                  <div className="flex-1 bg-slate-100 h-3.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-700 h-full rounded-full transition-all duration-500 text-3xs text-white font-bold flex items-center justify-end pr-1.5"
                      style={{ width: `${userIme}%` }}
                    >
                      {userIme}
                    </div>
                  </div>
                </div>
                {/* Benchmark bar */}
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-medium text-slate-500 w-16 shrink-0">Média Setor</span>
                  <div className="flex-1 bg-slate-100 h-3.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500 text-3xs text-white font-bold flex items-center justify-end pr-1.5"
                      style={{ width: `${avgIme}%` }}
                    >
                      {avgIme}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Pillars Bars */}
            {pillarData.map((p) => (
              <div
                key={p.id}
                className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-900">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xs font-semibold text-slate-700">
                      {p.userScore}/20 vs {p.avgScore}/20
                    </span>
                    <span
                      className={`text-2xs font-bold px-1.5 py-0.2 rounded ${
                        p.diff > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.diff < 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {p.diff > 0 ? `+${p.diff}` : p.diff} pts
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-1">
                  {/* User bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xs text-slate-400 w-16 shrink-0">Você</span>
                    <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${p.userPercentage}%` }}
                      />
                    </div>
                    <span className="text-2xs font-bold text-blue-900 w-8 text-right">
                      {p.userScore}
                    </span>
                  </div>
                  {/* Benchmark bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xs text-slate-400 w-16 shrink-0">Setor</span>
                    <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all"
                        style={{ width: `${p.avgPercentage}%` }}
                      />
                    </div>
                    <span className="text-2xs font-bold text-amber-800 w-8 text-right">
                      {p.avgScore}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights Competitivos do Benchmark */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Maior Vantagem Competitiva */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Sua Maior Vantagem Competitiva no Setor</span>
          </div>
          <p className="text-xs text-slate-800 font-semibold">
            {bestPillar.name} ({bestPillar.diff > 0 ? `+${bestPillar.diff} pts acima da média` : 'Em nível competitivo'})
          </p>
          <p className="text-2xs text-slate-600 leading-relaxed">
            Sua empresa demonstra práticas operacionais mais consolidadas neste pilar do que a média dos concorrentes avaliados de {benchmark.name} em São João del-Rei. Use este diferencial na sua comunicação comercial.
          </p>
        </div>

        {/* Maior Oportunidade de Diferenciação */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Maior Oportunidade de Diferenciação / Gap</span>
          </div>
          <p className="text-xs text-slate-800 font-semibold">
            {weakestPillar.name} ({weakestPillar.diff < 0 ? `${weakestPillar.diff} pts abaixo da média` : 'Espaço para liderança'})
          </p>
          <p className="text-2xs text-slate-600 leading-relaxed">
            Nesta área, outros negócios do mesmo segmento já aplicam práticas mais avançadas. Priorizar o plano de ação deste pilar fechará rapidamente a distância competitiva e aumentará a margem do seu negócio.
          </p>
        </div>
      </div>

      {/* Contextual Institutional Source Note */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-2xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Users2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>
            Amostra regional calibrada com <strong>{benchmark.sampleSize} empresas</strong> do segmento <strong>{benchmark.name}</strong> em São João del-Rei e microrregião.
          </span>
        </div>
        <span className="text-slate-400">
          Metodologia ACI Del-Rei & Vortex Tecnologia
        </span>
      </div>
    </div>
  );
};
