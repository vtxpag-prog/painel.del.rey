import React from 'react';
import { Settings, X, CheckSquare, Calendar, Mail, Globe, Database, Shield } from 'lucide-react';

interface ProductionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductionGuideModal: React.FC<ProductionGuideModalProps> = ({
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
            <Settings className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base">
                Guia Técnico de Implantação e Transição para Produção
              </h3>
              <p className="text-2xs text-slate-300">
                Checklist para Equipe de Tecnologia ACI Del-Rei & Vortex
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
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900">
            <strong>Transparência Operacional:</strong> Conforme as diretrizes institucionais, esta aplicação opera em ambiente de protótipo de alta fidelidade com persistência local e dados de simulação auditáveis. Para lançamento oficial em larga escala no município de São João del-Rei, siga o checklist técnico abaixo.
          </div>

          {/* 1. Domínio e Certificado */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>1. Configuração de Domínio e DNS Oficial</span>
            </h4>
            <p className="text-xs text-slate-600">
              Apontar o subdomínio institucional (ex.: <code>cresce.acidelrei.org.br</code>) via registro CNAME ou A para os servidores em nuvem, garantindo certificado SSL/TLS (HTTPS) ativado e HSTS configurado.
            </p>
          </div>

          {/* 2. Integração Google Calendar & Google Meet */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>2. Google Calendar API & Google Meet Oficial</span>
            </h4>
            <p className="text-xs text-slate-600">
              Configurar no Google Cloud Console o projeto institucional da ACI Del-Rei:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-2">
              <li>Ativar a <strong>Google Calendar API</strong>;</li>
              <li>Configurar credenciais OAuth 2.0 ou Service Account com escopo <code>https://www.googleapis.com/auth/calendar.events</code>;</li>
              <li>Definir a agenda dos consultores autorizados e sincronizar o envio automático de convites com link Google Meet corporativo.</li>
            </ul>
          </div>

          {/* 3. Serviço de Envio de E-mails Transacionais */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>3. Servidor de Envio de E-mails (SMTP / Resend / SendGrid)</span>
            </h4>
            <p className="text-xs text-slate-600">
              Integrar provedor de e-mail transacional (ex.: Resend, AWS SES ou SMTP institucional) para disparo automático do relatório executivo em anexo (.PDF) e do convite da reunião (.ICS) para o e-mail do responsável assim que o formulário for concluído.
            </p>
          </div>

          {/* 4. Banco de Dados e Criptografia */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-600" />
              <span>4. Persistência de Dados e Banco Corporativo</span>
            </h4>
            <p className="text-xs text-slate-600">
              Conectar a base de dados a PostgreSQL / Cloud SQL ou Firestore corporativo com criptografia em repouso (AES-256), backups diários automatizados e retenção em conformidade com as diretrizes do Encarregado de Dados (DPO) da entidade.
            </p>
          </div>

          {/* 5. Governança e LGPD */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-700" />
              <span>5. Gestão de Contas Administrativas com MFA</span>
            </h4>
            <p className="text-xs text-slate-600">
              Substituir a senha padrão do protótipo por autenticação individualizada com duplo fator (MFA) para os diretores e consultores credenciados pela ACI Del-Rei e Vortex.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
