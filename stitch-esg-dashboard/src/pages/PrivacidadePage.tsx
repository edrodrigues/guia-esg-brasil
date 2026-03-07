import React from 'react';
import { Link } from 'react-router-dom';
import { LeafyGreen, ArrowLeft } from 'lucide-react';

export const PrivacidadePage: React.FC = () => {
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
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter uppercase">Política de Privacidade</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">1. Introdução</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              A GUIA ESG Brasil respeita sua privacidade e está comprometida em proteger seus dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">2. Dados que Coletamos</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Podemos coletar os seguintes tipos de informações:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
              <li>Informações de identificação pessoal (nome, e-mail, empresa)</li>
              <li>Dados de uso da plataforma</li>
              <li>Informações do dispositivo e acesso</li>
              <li>Dados de análise e métricas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">3. Como Usamos Seus Dados</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Personalizar sua experiência</li>
              <li>Comunicar atualizações e suporte</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">4. Proteção de Dados</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">5. Seus Direitos</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Você tem direito a:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incorretos</li>
              <li>Solicitar exclusão de dados</li>
              <li>Optar por não receber comunicações</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">6. Contato</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Para questões sobre esta Política de Privacidade, entre em contato conosco através do e-mail: privacidade@guiaesg.com.br
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

export default PrivacidadePage;
