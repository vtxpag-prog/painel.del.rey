import React from 'react';
import { Building2, Sparkles, ShieldCheck, BarChart3, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  currentStep: string;
  onNavigateHome: () => void;
  onOpenAdmin: () => void;
  onOpenMethodology: () => void;
  onOpenPrivacy: () => void;
  onLoadDemo: (demoId: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onNavigateHome,
  onOpenAdmin,
  onOpenMethodology,
  onOpenPrivacy,
  onLoadDemo,
}) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top micro-bar institucional */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            ACI Del-Rei
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Vortex Tecnologia
          </span>
          <span className="hidden md:inline text-slate-500">·</span>
          <span className="hidden md:inline text-slate-400">São João del-Rei e Região · Minas Gerais</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="relative group">
            <button className="text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer py-0.5">
              <Layers className="w-3 h-3 text-blue-400" />
              <span>Casos de Demonstração</span>
            </button>
            <div className="hidden group-hover:block absolute right-0 top-full pt-1 w-72 bg-white text-slate-800 shadow-xl rounded-lg border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-1 text-2xs font-bold text-slate-400 uppercase tracking-wider">
                Ambiente de Demonstração
              </div>
              <button
                onClick={() => onLoadDemo(1)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-700 transition-colors flex flex-col"
              >
                <span className="font-medium text-slate-900">Caso 1: Microempresa (Oficina)</span>
                <span className="text-slate-500 text-2xs">Baixa presença digital, finanças organizadas</span>
              </button>
              <button
                onClick={() => onLoadDemo(2)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-700 transition-colors flex flex-col border-t border-slate-100"
              >
                <span className="font-medium text-slate-900">Caso 2: Serviços (Arquitetura)</span>
                <span className="text-slate-500 text-2xs">Boa presença digital, baixa gestão comercial</span>
              </button>
              <button
                onClick={() => onLoadDemo(3)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-700 transition-colors flex flex-col border-t border-slate-100"
              >
                <span className="font-medium text-slate-900">Caso 3: Indústria (Laticínios)</span>
                <span className="text-slate-500 text-2xs">Empresa estruturada, foco em automação</span>
              </button>
            </div>
          </div>

          <span className="text-slate-600">|</span>
          <button
            onClick={onOpenAdmin}
            className="text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium">Área Administrativa</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
        <div
          onClick={onNavigateHome}
          className="cursor-pointer flex items-center gap-3.5 group select-none"
        >
          {/* Brand Mark */}
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-700 via-blue-800 to-indigo-900 flex items-center justify-center text-white shadow-xs group-hover:shadow-md transition-shadow">
            <span className="font-extrabold text-lg tracking-tight">CD</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg leading-tight tracking-tight">
                Cresce Del-Rei
              </span>
              <span className="text-xs px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                Diagnóstico 2026
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Programa de Desenvolvimento Empresarial · ACI Del-Rei & Vortex
            </p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex items-center gap-3 sm:gap-6 text-sm">
          <button
            onClick={onOpenMethodology}
            className="text-slate-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Metodologia & Fórmulas</span>
            <span className="sm:hidden">Metodologia</span>
          </button>

          <button
            onClick={onOpenPrivacy}
            className="text-slate-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm"
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Privacidade & LGPD</span>
            <span className="sm:hidden">Privacidade</span>
          </button>

          {currentStep !== 'landing' && currentStep !== 'report' && (
            <button
              onClick={onNavigateHome}
              className="text-xs px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Início
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
