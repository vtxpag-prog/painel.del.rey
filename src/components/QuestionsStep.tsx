import React, { useState, useEffect } from 'react';
import {
  MaturityScore,
  QuestionDefinition,
  BusinessSegment,
} from '../types/diagnosis';
import {
  CORE_QUESTIONS,
  PILLARS_META,
  getComplementaryModuleForSegment,
} from '../data/questions';
import {
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Save,
  Check,
} from 'lucide-react';

interface QuestionsStepProps {
  segment: BusinessSegment;
  teamSize?: string;
  initialAnswers?: Record<string, MaturityScore>;
  initialComplementaryAnswers?: Record<string, MaturityScore | 'na'>;
  onFinish: (
    answers: Record<string, MaturityScore>,
    complementaryAnswers: Record<string, MaturityScore | 'na'>
  ) => void;
  onBack: () => void;
}

export const QuestionsStep: React.FC<QuestionsStepProps> = ({
  segment,
  teamSize,
  initialAnswers = {},
  initialComplementaryAnswers = {},
  onFinish,
  onBack,
}) => {
  const [answers, setAnswers] = useState<Record<string, MaturityScore>>(initialAnswers);
  const [complementaryAnswers, setComplementaryAnswers] = useState<
    Record<string, MaturityScore | 'na'>
  >(initialComplementaryAnswers);

  // We organize questions into 6 blocks:
  // Block 0: Pilar 1 (P1.1 to P1.5)
  // Block 1: Pilar 2 (P2.1 to P2.5)
  // Block 2: Pilar 3 (P3.1 to P3.5)
  // Block 3: Pilar 4 (P4.1 to P4.5)
  // Block 4: Pilar 5 (P5.1 to P5.5)
  // Block 5: Módulo Complementar Setorial (5 questions)
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [savedNotification, setSavedNotification] = useState(false);

  const complementaryModule = getComplementaryModuleForSegment(segment, teamSize);

  const blocks = [
    {
      id: 'pilar1',
      title: 'Pilar 1 — Receita, Clientes e Vendas',
      description: PILLARS_META.pilar1.description,
      questions: CORE_QUESTIONS.filter((q) => q.pillarId === 'pilar1'),
      color: 'blue',
    },
    {
      id: 'pilar2',
      title: 'Pilar 2 — Presença Digital e Mercado',
      description: PILLARS_META.pilar2.description,
      questions: CORE_QUESTIONS.filter((q) => q.pillarId === 'pilar2'),
      color: 'emerald',
    },
    {
      id: 'pilar3',
      title: 'Pilar 3 — Finanças e Resiliência',
      description: PILLARS_META.pilar3.description,
      questions: CORE_QUESTIONS.filter((q) => q.pillarId === 'pilar3'),
      color: 'amber',
    },
    {
      id: 'pilar4',
      title: 'Pilar 4 — Operações, Processos e Tecnologia',
      description: PILLARS_META.pilar4.description,
      questions: CORE_QUESTIONS.filter((q) => q.pillarId === 'pilar4'),
      color: 'indigo',
    },
    {
      id: 'pilar5',
      title: 'Pilar 5 — Estratégia, Pessoas e Crescimento',
      description: PILLARS_META.pilar5.description,
      questions: CORE_QUESTIONS.filter((q) => q.pillarId === 'pilar5'),
      color: 'purple',
    },
    {
      id: 'complementar',
      title: complementaryModule.title,
      description: 'Perguntas específicas adicionais de boas práticas alinhadas ao seu segmento econômico.',
      questions: complementaryModule.questions,
      color: 'cyan',
    },
  ];

  const currentBlock = blocks[currentBlockIndex];

  // Total answers progress calculation
  const totalCoreQuestions = 25;
  const answeredCoreCount = CORE_QUESTIONS.filter((q) => answers[q.id] !== undefined).length;
  const totalQuestions = 30;
  const answeredTotalCount =
    answeredCoreCount +
    complementaryModule.questions.filter((q) => complementaryAnswers[q.id] !== undefined).length;

  const progressPercentage = Math.round((answeredTotalCount / totalQuestions) * 100);

  // Autosave to localStorage on answer changes
  useEffect(() => {
    try {
      localStorage.setItem('cresce_delrei_answers', JSON.stringify(answers));
      localStorage.setItem('cresce_delrei_comp_answers', JSON.stringify(complementaryAnswers));
    } catch {
      // ignore
    }
  }, [answers, complementaryAnswers]);

  const handleSelectAnswer = (qId: string, score: MaturityScore, isComplementary: boolean) => {
    if (isComplementary) {
      setComplementaryAnswers((prev) => ({ ...prev, [qId]: score }));
    } else {
      setAnswers((prev) => ({ ...prev, [qId]: score }));
    }

    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 1500);
  };

  const handleSelectNA = (qId: string) => {
    setComplementaryAnswers((prev) => ({ ...prev, [qId]: 'na' }));
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 1500);
  };

  // Check if current block has missing answers
  const isBlockComplete = currentBlock.questions.every((q) => {
    if (currentBlock.id === 'complementar') {
      return complementaryAnswers[q.id] !== undefined;
    }
    return answers[q.id] !== undefined;
  });

  const handleNextBlock = () => {
    if (currentBlockIndex < blocks.length - 1) {
      setCurrentBlockIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onFinish(answers, complementaryAnswers);
    }
  };

  const handlePrevBlock = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBack();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Barra de Progresso Superior */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 sticky top-16 z-30">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">
              Bloco {currentBlockIndex + 1} de {blocks.length}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600 font-medium">{currentBlock.title.split('—')[0]}</span>
          </div>

          <div className="flex items-center gap-3">
            {savedNotification && (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-2xs flex items-center gap-1 transition-all">
                <Check className="w-3 h-3" /> Resposta salva
              </span>
            )}
            <span className="text-slate-600 font-medium">
              {answeredTotalCount} de {totalQuestions} perguntas respondidas ({progressPercentage}%)
            </span>
          </div>
        </div>

        {/* Linha da barra de progresso */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Atalhos rápidos para blocos */}
        <div className="flex items-center justify-between gap-1 pt-1 overflow-x-auto text-2xs">
          {blocks.map((b, idx) => {
            const isCompleted = b.questions.every((q) =>
              b.id === 'complementar'
                ? complementaryAnswers[q.id] !== undefined
                : answers[q.id] !== undefined
            );
            const isCurrent = idx === currentBlockIndex;
            return (
              <button
                key={b.id}
                onClick={() => {
                  setCurrentBlockIndex(idx);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`py-1 px-2.5 rounded-sm transition-colors cursor-pointer shrink-0 ${
                  isCurrent
                    ? 'bg-blue-700 text-white font-bold'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b.id === 'complementar' ? 'Módulo Setor' : `Pilar ${idx + 1}`}
                {isCompleted && !isCurrent && ' ✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cabeçalho do Bloco Atual */}
      <div className="space-y-2 border-b border-slate-200 pb-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          {currentBlock.title}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {currentBlock.description}
        </p>
      </div>

      {/* Lista de Perguntas do Bloco */}
      <div className="space-y-8">
        {currentBlock.questions.map((question, qIndex) => {
          const isComp = currentBlock.id === 'complementar';
          const currentAnswer = isComp ? complementaryAnswers[question.id] : answers[question.id];
          const isAnswered = currentAnswer !== undefined;

          return (
            <div
              key={question.id}
              className={`bg-white rounded-xl border p-5 sm:p-6 transition-all shadow-2xs ${
                isAnswered ? 'border-slate-300 ring-1 ring-slate-200/50' : 'border-slate-200'
              }`}
            >
              {/* Enunciado da questão */}
              <div className="space-y-1.5 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-blue-700 px-2 py-0.5 bg-blue-50 rounded border border-blue-200">
                    {question.id}
                  </span>
                  {isAnswered && (
                    <span className="text-2xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Respondida
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {question.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {question.description}
                </p>
              </div>

              {/* Opções de Escala de Maturidade (0 a 4) */}
              <div className="pt-4 space-y-2.5">
                <div className="text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Selecione o nível que melhor reflete a realidade atual da sua empresa:
                </div>

                <div className="space-y-2">
                  {question.options.map((opt) => {
                    const isSelected = currentAnswer === opt.score;
                    return (
                      <div
                        key={opt.score}
                        onClick={() => handleSelectAnswer(question.id, opt.score, isComp)}
                        className={`p-3.5 rounded-lg border transition-all cursor-pointer select-none text-left ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/30'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'border border-slate-300 text-slate-500 bg-white'
                            }`}
                          >
                            {opt.score}
                          </div>

                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs sm:text-sm font-bold ${
                                  isSelected ? 'text-blue-900' : 'text-slate-800'
                                }`}
                              >
                                {opt.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {opt.detail}
                            </p>
                            <p className="text-2xs text-slate-500 italic pt-0.5">
                              {opt.example}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Opção "Não se aplica" exclusiva para o módulo complementar */}
                  {isComp && (
                    <div
                      onClick={() => handleSelectNA(question.id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer select-none text-left ${
                        currentAnswer === 'na'
                          ? 'border-slate-500 bg-slate-100 text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center text-xs font-bold shrink-0">
                          -
                        </div>
                        <div className="text-xs">
                          <strong className="block font-semibold">Não aplicável à nossa operação</strong>
                          <span className="text-2xs text-slate-500">
                            Esta prática não se aplica ao modelo específico da nossa empresa. (Não penaliza o IME).
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navegação entre blocos */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={handlePrevBlock}
          className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentBlockIndex === 0 ? 'Voltar ao Perfil' : 'Bloco Anterior'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleNextBlock}
          disabled={!isBlockComplete}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer ${
            isBlockComplete
              ? 'bg-blue-700 hover:bg-blue-800 text-white'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>
            {currentBlockIndex === blocks.length - 1
              ? 'Finalizar e Ver Diagnóstico'
              : 'Próximo Bloco'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {!isBlockComplete && (
        <p className="text-center text-xs text-amber-700 bg-amber-50 py-2 rounded border border-amber-200">
          Por favor, responda todas as 5 questões deste bloco para avançar.
        </p>
      )}
    </div>
  );
};
