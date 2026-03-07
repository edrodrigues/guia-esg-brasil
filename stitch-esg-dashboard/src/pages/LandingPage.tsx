import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LeafyGreen, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Zap,
  Mail,
  Linkedin,
  Instagram,
  Twitter
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans">
      {/* Navigation */}
      <nav className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-slate-900 shadow-lg shadow-emerald-500/20">
              <LeafyGreen size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-slate-100 uppercase">GUIA ESG</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
            <a href="#features" className="hover:text-primary transition-colors">Funcionalidades</a>
            <a href="#impact" className="hover:text-primary transition-colors">Impacto</a>
            <a href="#about" className="hover:text-primary transition-colors">Sobre</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:flex font-black uppercase text-[10px] tracking-widest">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button className="font-black uppercase text-[10px] tracking-widest px-6 shadow-lg shadow-emerald-500/20">Começar Agora</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Zap size={14} className="fill-current" />
              <span>A Nova Era da Sustentabilidade Corporativa</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] mb-8 tracking-tighter uppercase">
              Dados ESG em <span className="text-primary italic">impacto real.</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 leading-relaxed font-medium max-w-2xl">
              Uma plataforma analítica e gamificada para medir, gerir e evoluir os indicadores ambientais, sociais e de governança da sua empresa com transparência radical.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/register">
                <Button className="w-full sm:w-auto px-10 py-6 text-xs uppercase font-black tracking-[0.2em] gap-3 shadow-2xl shadow-emerald-500/30 rounded-2xl">
                  Iniciar Jornada <ArrowRight size={18} />
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto px-10 py-6 text-xs uppercase font-black tracking-[0.2em] border-2 rounded-2xl">
                Ver Demonstração
              </Button>
            </div>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-24">
            <p className="text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-4">Metodologia</p>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter uppercase leading-tight">Os 3 Pilares da Evolução</h2>
            <p className="text-slate-500 font-medium text-lg italic">Abordagem integrada para o crescimento sustentável do seu negócio.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                icon: LeafyGreen, 
                title: 'Ambiental (E)', 
                color: 'emerald',
                desc: 'Gestão de carbono, eficiência energética e consumo consciente de recursos naturais.' 
              },
              { 
                icon: Users, 
                title: 'Social (S)', 
                color: 'amber',
                desc: 'Capital humano, diversidade, inclusão e impacto positivo nas comunidades locais.' 
              },
              { 
                icon: ShieldCheck, 
                title: 'Governança (G)', 
                color: 'blue',
                desc: 'Transparência, ética e estruturas de decisão que garantem a longevidade do negócio.' 
              },
            ].map((pilar, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 group hover:border-primary/30 transition-all duration-500 shadow-xl shadow-slate-200/20">
                <div className={`w-16 h-16 rounded-2xl bg-${pilar.color}-500/10 text-${pilar.color}-500 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform`}>
                  <pilar.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">{pilar.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">
                  {pilar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer (Enterprise Refined) */}
      <footer className="pt-24 pb-12 bg-white dark:bg-slate-950 border-t-2 border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-slate-900 shadow-lg shadow-emerald-500/20">
                  <LeafyGreen size={24} />
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">GUIA ESG</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed mb-8 max-w-sm">
                A arena definitiva para monitoramento, análise e brilho nos dados ESG para empresas brasileiras que jogam limpo com o futuro.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Twitter size={18} />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-8">Soluções</h4>
              <ul className="space-y-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <li><a href="#" className="hover:text-primary transition-colors">Ambiental (E)</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Social (S)</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Governança (G)</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Questionário</a></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-8">Recursos</h4>
              <ul className="space-y-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <li><a href="#" className="hover:text-primary transition-colors">Metodologia</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Relatórios</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog ESG</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentação</a></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="lg:col-span-4">
              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-8">Newsletter Corporativa</h4>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-6">
                Receba insights trimestrais sobre o mercado ESG no Brasil.
              </p>
              <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="seu@email.com.br"
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-mono text-xs"
                />
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-slate-900 p-2 rounded-xl hover:bg-emerald-400 transition-all shadow-lg">
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <p>© {new Date().getFullYear()} GUIA ESG BRASIL. Todos os direitos reservados.</p>
              <div className="hidden sm:flex items-center gap-6">
                <a href="/privacidade" className="hover:text-primary transition-colors">Privacidade</a>
                <a href="/termos" className="hover:text-primary transition-colors">Termos</a>
                <a href="/compliance" className="hover:text-primary transition-colors">Compliance</a>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sistemas Verificados por Bureau Veritas</span>
            </div>

            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              Desenvolvido por <a href="https://futurereadylabs.com.br/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Future Ready Labs</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
