import React from 'react';
import { Building2, Sparkles, Shield, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenMethodology: () => void;
  onOpenProductionGuide: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenMethodology,
  onOpenProductionGuide,
  onOpenAdmin,
}) => {
  return (
    <footer className="no-print bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Coluna 1: Sobre o Programa */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                CD
              </div>
              <span className="font-bold text-white text-base">Cresce Del-Rei</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Iniciativa voltada ao desenvolvimento sustentável das empresas de São João del-Rei e do Campo das Vertentes, aliando tradição associativista à inovação e boas práticas de gestão.
            </p>
            <div className="pt-2 text-2xs text-slate-500">
              Versão 1.0 · Metodologia Aberta e Auditável
            </div>
          </div>

          {/* Coluna 2: Realização e Parceria */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Instituições Parceiras
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">ACI Del-Rei</strong>
                  Associação Comercial e Industrial de São João del-Rei · Fundada em 1904
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Vortex Tecnologia</strong>
                  Parceira tecnológica e metodológica oficial para transformação digital
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 3: Contatos e Localização */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Canais Oficiais
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>São João del-Rei · MG · Brasil</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>(32) 3371-2000 (ACI Del-Rei)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>diagnostico@acidelrei.org.br</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Conformidade e Transparência */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Conformidade & Governança
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Política de Privacidade & LGPD
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMethodology}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Fórmulas e Critérios de Avaliação
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenProductionGuide}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Guia Técnico de Implantação
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Acesso Administrativo Restrito
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Legal Obrigatório */}
        <div className="pt-6 text-2xs text-slate-500 leading-relaxed space-y-1.5">
          <p>
            <strong>Aviso Legal Institucional:</strong> O Diagnóstico Empresarial Cresce Del-Rei é uma ferramenta orientativa e metodológica de autoavaliação inicial de maturidade de gestão. O relatório executivo é gerado estritamente a partir das respostas autodeclaradas pelo responsável indicado pela empresa. O diagnóstico não constitui auditoria contábil, certificação de qualidade, consultoria jurídica vinculante nem análise ou garantia de concessão de crédito financeiro.
          </p>
          <p>
            Eventual encaminhamento a parceiros ou indicação de soluções é estritamente facultativo e depende de autorização prévia e expressa do empresário. Os dados fornecidos são tratados com segurança em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).
          </p>
          <p className="pt-2 text-slate-600">
            © {new Date().getFullYear()} ACI Del-Rei & Vortex. Todos os direitos reservados. Fuso horário oficial: America/Sao_Paulo (Horário de Brasília).
          </p>
        </div>
      </div>
    </footer>
  );
};
