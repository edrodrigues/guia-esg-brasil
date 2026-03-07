import React from 'react';
import { Link } from 'react-router-dom';
import { LeafyGreen, ArrowLeft } from 'lucide-react';

export const TermosPage: React.FC = () => {
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
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter uppercase">Termos de Uso</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">1. Aceitação dos Termos</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Ao acessar e utilizar a plataforma GUIA ESG, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">2. Descrição do Serviço</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              A GUIA ESG é uma plataforma analítica e gamificada para medição, gestão e evolução dos indicadores ambientais, sociais e de governança (ESG) de empresas brasileiras.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">3. Cadastro e Conta</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Para utilizar nossos serviços, você deve:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
              <li>Fornecer informações verdadeiras e completas</li>
              <li>Manter a segurança de sua conta e senha</li>
              <li>Ser responsável por todas as atividades em sua conta</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">4. Uso da Plataforma</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Você concorda em NÃO:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
              <li>Violar quaisquer leis ou regulamentos aplicáveis</li>
              <li>Infringir direitos de terceiros</li>
              <li>Transmitir vírus ou malware</li>
              <li>Tentar acessar áreas restritas da plataforma</li>
              <li>Usar a plataforma para fins ilegais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">5. Propriedade Intelectual</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Todo o conteúdo, design, gráficos e código da plataforma GUIA ESG são de nossa propriedade ou licenciados e são protegidos por direitos autorais e outras leis de propriedade intelectual.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">6. Limitação de Responsabilidade</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              A GUIA ESG não será responsável por quaisquer danos indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou incapacidade de usar a plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">7. Modificações dos Termos</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer tempo. O uso continuado da plataforma após modificações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">8. Contato</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Para questões sobre estes Termos de Uso, entre em contato conosco através do e-mail: termos@guiaesg.com.br
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

export default TermosPage;
