import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { 
  Trophy, 
  Search, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Info
} from 'lucide-react';
import { ProgressCircle } from '@tremor/react';
import { useAuth } from '../context/useAuth';
import { collection, query, orderBy, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Company } from '../types';

export const RankingPage: React.FC = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [userCompany, setUserCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const q = query(collection(db, 'companies'), orderBy('currentXP', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        const companiesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
        setCompanies(companiesList);

        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const companyId = userDoc.data().companyId;
            const companyDoc = await getDoc(doc(db, 'companies', companyId));
            if (companyDoc.exists()) {
              setUserCompany({ id: companyDoc.id, ...companyDoc.data() } as Company);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching ranking data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [user]);

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankIcon = (index: number) => {
    if (index === 0) return <span className="text-2xl">🥇</span>;
    if (index === 1) return <span className="text-2xl">🥈</span>;
    if (index === 2) return <span className="text-2xl">🥉</span>;
    return <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-500">{index + 1}</span>;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter uppercase">
            Placar de Líderes ESG
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Acompanhe os grandes jogadores da sustentabilidade e suba no ranking nacional!
          </p>
        </div>

        {/* User Performance Callout (Glassmorphic with Tremor) */}
        {userCompany && (
          <div className="bg-emerald-500/5 backdrop-blur-md border-2 border-primary/20 rounded-3xl p-8 mb-10 shadow-xl shadow-emerald-900/5 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-8">
                <ProgressCircle
                  value={Math.round((userCompany.esgScores.environmental + userCompany.esgScores.social + userCompany.esgScores.governance) / 3)}
                  size="xl"
                  color="emerald"
                  showAnimation={true}
                >
                  <span className="text-2xl font-black font-mono">
                    {Math.round((userCompany.esgScores.environmental + userCompany.esgScores.social + userCompany.esgScores.governance) / 3)}
                  </span>
                </ProgressCircle>
                
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tight">
                    {userCompany.name} <span className="text-[10px] bg-primary text-white px-3 py-1 rounded-full font-black tracking-widest">ELITE</span>
                  </h3>
                  <p className="text-slate-500 font-bold uppercase text-xs mt-1 tracking-widest">
                    Sua empresa está no <span className="text-primary font-black italic">Top 15%</span> do setor de {userCompany.industry}.
                  </p>
                  <div className="flex gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-environmental"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E: {userCompany.esgScores.environmental}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-social"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">S: {userCompany.esgScores.social}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-governance"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">G: {userCompany.esgScores.governance}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="bg-primary hover:bg-emerald-400 text-slate-900 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                Explorar Conquistas
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-4 mb-8">
          <div className="flex-1 min-w-[300px]">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Encontrar Jogador</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Nome da organização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
              />
            </div>
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Setor</label>
            <select className="w-full md:w-56 px-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary outline-none font-bold text-sm appearance-none cursor-pointer">
              <option>Todos os Setores</option>
              <option>Tecnologia</option>
              <option>Energia</option>
              <option>Varejo</option>
              <option>Finanças</option>
            </select>
          </div>
          <button className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-3.5 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all">
            <Filter size={20} />
          </button>
        </div>

        {/* Ranking Table */}
        <Card className="overflow-hidden border-b-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b-2 border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ranking</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organização</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Setor</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score Médio</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCompanies.map((comp, idx) => {
                  const isUserComp = comp.id === userCompany?.id;
                  const avgScore = Math.round((comp.esgScores.environmental + comp.esgScores.social + comp.esgScores.governance) / 3);
                  
                  return (
                    <tr key={comp.id} className={`group transition-all ${isUserComp ? 'bg-primary/5' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}>
                      <td className="px-6 py-4">
                        {getRankIcon(idx)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-primary text-lg border border-slate-200 dark:border-slate-700 group-hover:emerald-glow transition-all">
                            {comp.name.charAt(0)}
                          </div>
                          <div>
                            <span className={`font-black uppercase text-sm tracking-tight ${isUserComp ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                              {comp.name} {isUserComp && '(Você)'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{comp.industry}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-4 py-1.5 rounded-xl font-mono text-sm font-black transition-all ${
                          isUserComp ? 'bg-primary text-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {avgScore}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                          <TrendingUp size={14} /> Estável
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary font-black uppercase text-[10px] tracking-widest hover:underline">
                          Ver Perfil
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 border-t-2 border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mostrando 1 a {filteredCompanies.length} de {companies.length} empresas</p>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-white transition-all disabled:opacity-30" disabled>
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-primary text-slate-900 font-black text-xs flex items-center justify-center">1</button>
              <button className="p-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-white transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </Card>

        {/* Insights Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-8 border-b-8">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <TrendingUp size={24} />
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Meta de Categoria</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold leading-relaxed mb-6 uppercase tracking-widest">
              O setor de Tecnologia teve um crescimento médio de 8% nos indicadores sociais este ano.
            </p>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black font-mono">68.4</span>
              <span className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                <TrendingUp size={14} /> +2.4 PTS
              </span>
            </div>
          </Card>

          <Card className="p-8 border-b-8">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mb-6">
              <Trophy size={24} />
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Troféus Globais</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold leading-relaxed mb-6 uppercase tracking-widest">
              24 novas empresas conquistaram o selo Diamante em Governança este mês no Brasil.
            </p>
            <div className="flex items-center -space-x-3 mt-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-black uppercase">User</div>
                </div>
              ))}
              <div className="w-10 h-10 rounded-full bg-primary text-slate-900 border-4 border-white dark:border-slate-900 text-[10px] flex items-center justify-center font-black">+21</div>
            </div>
          </Card>

          <Card className="p-8 border-b-8">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-6">
              <Info size={24} />
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Regras do Jogo</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold leading-relaxed mb-6 uppercase tracking-widest">
              Novas diretrizes para descarbonização foram adicionadas ao cálculo do score ambiental.
            </p>
            <button className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:underline">
              Ver Metodologia <Info size={14} />
            </button>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 to-primary text-white rounded-[2.5rem] p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-4xl font-black mb-6 uppercase tracking-tighter italic">Pronto para Subir de Nível?</h3>
            <p className="text-white/70 font-bold mb-10 text-lg uppercase tracking-widest">
              Nossos consultores podem te ajudar a desbloquear novas conquistas e dominar o ranking nacional.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-white text-primary px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95 shadow-lg shadow-white/10">
                Falar com um Consultor
              </button>
              <button className="bg-transparent border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95">
                Baixar Estratégia
              </button>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-primary/20 rounded-full blur-[100px]"></div>
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full blur-[80px]"></div>
        </div>
      </div>
    </DashboardLayout>
  );
};
