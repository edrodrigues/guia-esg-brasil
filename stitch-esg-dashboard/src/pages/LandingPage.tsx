import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LeafyGreen, 
  ArrowRight, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Globe, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Navigation */}
      <nav className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-slate-900 shadow-lg shadow-primary/20">
              <LeafyGreen size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-slate-100 uppercase">GUIA ESG</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
            <a href="#features" className="hover:text-primary transition-colors">Funcionalidades</a>
            <a href="#impact" className="hover:text-primary transition-colors">Impacto</a>
            <a href="#about" className="hover:text-primary transition-colors">Sobre</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:flex">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button>Começar Agora</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-6">
              <Zap size={14} />
              <span>A Nova Era da Sustentabilidade Corporativa</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-slate-100 leading-[1.1] mb-8 tracking-tighter">
              Transforme dados ESG em <span className="text-primary italic">impacto real.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
              Democratizando a jornada da sustentabilidade. Uma plataforma gamificada para medir, gerir e evoluir os indicadores ambientais, sociais e de governança da sua empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button className="w-full sm:w-auto px-8 py-5 text-lg gap-2 shadow-xl shadow-primary/20">
                  Iniciar Minha Jornada <ArrowRight size={20} />
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto px-8 py-5 text-lg border-2">
                Ver Demonstração
              </Button>
            </div>
          </div>
        </div>

        {/* Abstract shapes for background */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight uppercase">Os 3 Pilares da Evolução</h2>
            <p className="text-slate-500 font-medium">Nossa plataforma aborda o ESG de forma integrada e estratégica para o crescimento do seu negócio.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 group hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <LeafyGreen size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Ambiental (E)</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Gestão de carbono, eficiência energética e consumo consciente de recursos. Transforme sua operação em um ecossistema sustentável.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 group hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Social (S)</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Foco no capital humano, diversidade, inclusão e impacto na comunidade. Construa uma cultura organizacional forte e empática.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Governança (G)</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Transparência radical, ética e conformidade. Estruturas de decisão que garantem a longevidade e confiança do seu negócio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Proof Section */}
      <section id="impact" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">Por que gerir com o GUIA ESG?</h2>
                <div className="space-y-6">
                  {[
                    "Diagnóstico rápido em menos de 15 minutos",
                    "Acompanhamento em tempo real de métricas críticas",
                    "Gamificação que engaja todo o time no propósito",
                    "Relatórios prontos para investidores e conselho"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4 text-white/80 font-bold">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-slate-900">
                        <CheckCircle2 size={16} />
                      </div>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl text-center">
                  <p className="text-4xl font-black text-primary mb-2">+45%</p>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Engajamento</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl text-center">
                  <p className="text-4xl font-black text-primary mb-2">-30%</p>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Custos Op.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl text-center">
                  <p className="text-4xl font-black text-primary mb-2">100%</p>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Conformidade</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl text-center">
                  <p className="text-4xl font-black text-primary mb-2">24/7</p>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Monitoramento</p>
                </div>
              </div>
            </div>
            {/* Background elements for dark box */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-slate-900">
              <LeafyGreen size={18} />
            </div>
            <span className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">GUIA ESG</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">© {new Date().getFullYear()} Stitch ESG Dashboard. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Globe size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Users size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><ShieldCheck size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};
