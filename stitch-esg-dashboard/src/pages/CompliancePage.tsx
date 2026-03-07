import React from 'react';
import { Link } from 'react-router-dom';
import { LeafyGreen, ArrowLeft, ShieldCheck, Scale, FileCheck, Award } from 'lucide-react';

export const CompliancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans">
      <nav className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-slate-900 shadow-lg shadow-emerald-500/20">
                <LeafyGreen size={24} />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-slate-100 uppercase">GUIA ESG</span>
            </Link>
          </div>
          <Link to="/" className="flex items-center gap-2 text-sm font-black text-slate-500 uppercase tracking-widest hover:text-primary transition-colors">
            <ArrowLeft size={16} />
            Voltar
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter uppercase">Compliance ESG</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-primary" size={28} />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white m-0">Nosso Compromisso com a Integridade</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              A GUIA ESG está comprometida com os mais altos padrões de ética, integridade e conformidade regulatória. Acreditamos que a sustentabilidade corporativa vai além do meio ambiente, abrangendo práticas de governança sólidas e responsabilidade social genuína.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="text-primary" size={28} />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white m-0">Certificações e Verificações</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Nossa plataforma e metodologia passam por verificações independentes para garantir a precisão e confiabilidade dos dados ESG reportados.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <Award className="text-amber-500 mb-3" size={24} />
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Bureau Veritas</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Sistemas verificados e certificados por Bureau Veritas, líder mundial em testes, inspeção e certificação.
                </p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <FileCheck className="text-blue-500 mb-3" size={24} />
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">GRI Standards</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Relatórios alinhados aos Global Reporting Initiative Standards para transparência e comparabilidade.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="text-primary" size={28} />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white m-0">Conformidade Regulatória</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              A GUIA ESG opera em conformidade com as principais regulamentações e marcos regulatórios:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-slate-600 dark:text-slate-400">
              <li><strong>Lei Geral de Proteção de Dados (LGPD)</strong> - Compliance total com a legislação brasileira de proteção de dados</li>
              <li><strong>IFC Performance Standards</strong> - Padrões de desempenho ambiental e social do Banco Mundial</li>
              <li><strong>UN SDGs</strong> - Alinhamento com os Objetivos de Desenvolvimento Sustentável da ONU</li>
              <li><strong>Task Force on Climate-related Financial Disclosures (TCFD)</strong> - Transparência sobre riscos climáticos</li>
              <li><strong>ISSB Standards</strong> - Padrões internacionais de divulgação de sustentabilidade</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Código de Conduta</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Implementamos um robusto programa de compliance que inclui:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
              <li>Políticas Anticorrupção e Antissuborno</li>
              <li>Canal de Denúncias independente</li>
              <li>Due Diligence de terceiros</li>
              <li>Treinamento contínuo de colaboradores</li>
              <li>Auditorias internas e externas regulares</li>
              <li>Gestão de riscos ESG integrada</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Relatório de Transparência</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Publicamos anualmente nosso relatório de sustentabilidade e compliance, demonstrando nosso compromisso com a transparência radical e a melhoria contínua em práticas ESG.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Fale com nosso Compliance</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Para dúvidas sobre nossas práticas de compliance, reporte preocupações ou solicite informações, entre em contato: compliance@guiaesg.com.br
            </p>
          </section>

          <p className="text-sm text-slate-500 dark:text-slate-500 pt-8 border-t border-slate-200 dark:border-slate-800">
            Última atualização: {new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompliancePage;
