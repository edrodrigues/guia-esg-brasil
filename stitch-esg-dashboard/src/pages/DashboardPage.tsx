import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { EvolutionChart } from '../components/dashboard/EvolutionChart';
import { RecentMissions } from '../components/dashboard/RecentMissions';
import { Leaf, Users, Gavel, TrendingUp, TrendingDown, PlusCircle, Mail, CloudSync } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Company, Mission } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Fetch User and Company
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const companyId = userDoc.data().companyId;
          const companyDoc = await getDoc(doc(db, 'companies', companyId));
          
          if (companyDoc.exists()) {
            setCompany({ id: companyDoc.id, ...companyDoc.data() } as Company);
            
            // Fetch Recent Missions
            const missionsQuery = query(
              collection(db, 'missions'),
              where('companyId', '==', companyId),
              limit(5)
            );
            const missionsSnap = await getDocs(missionsQuery);
            const missionsList = missionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mission));
            setMissions(missionsList);
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Mock data for chart if company has no evolutionData yet
  const chartData = company?.evolutionData || [
    { month: 'JAN', score: 45 },
    { month: 'FEV', score: 52 },
    { month: 'MAR', score: 48 },
    { month: 'ABR', score: 61 },
    { month: 'MAI', score: 55 },
    { month: 'JUN', score: 67 },
  ];

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
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Olá, {user?.displayName || 'Mestre ESG'}! 👋
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Aqui está o panorama atual de impacto da <span className="text-primary font-bold">{company?.name}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Meio Ambiente</span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Leaf size={20} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{company?.esgScores.environmental || 0}/100</p>
              <p className="text-emerald-600 text-sm font-bold flex items-center gap-1 mt-1">
                <TrendingUp size={16} /> +5.2%
              </p>
            </div>
            <div className="text-xs text-slate-400 italic">Carbono & Energia</div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Impacto Social</span>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{company?.esgScores.social || 0}/100</p>
              <p className="text-rose-600 text-sm font-bold flex items-center gap-1 mt-1">
                <TrendingDown size={16} /> -1.5%
              </p>
            </div>
            <div className="text-xs text-slate-400 italic">Pessoas & Cultura</div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Governança</span>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Gavel size={20} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{company?.esgScores.governance || 0}/100</p>
              <p className="text-emerald-600 text-sm font-bold flex items-center gap-1 mt-1">
                <TrendingUp size={16} /> +2.1%
              </p>
            </div>
            <div className="text-xs text-slate-400 italic">Ética & Transparência</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <EvolutionChart data={chartData} />
        
        <Card title="Recursos do Nível" subtitle="Metas batidas por categoria">
          <div className="h-64 flex items-end justify-between px-4 gap-4">
            {[
              { label: 'Energia', val: 85, color: 'bg-primary' },
              { label: 'Resíduos', val: 65, color: 'bg-primary' },
              { label: 'Diversid.', val: 45, color: 'bg-rose-500' },
              { label: 'Ética', val: 95, color: 'bg-primary' },
            ].map((stat, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl relative h-48 overflow-hidden">
                  <div 
                    className={`absolute bottom-0 w-full ${stat.color} opacity-20 rounded-t-xl transition-all duration-1000`} 
                    style={{ height: `${stat.val}%` }}
                  />
                  <div 
                    className={`absolute bottom-[${stat.val}%] w-full border-t-2 ${stat.color.replace('bg-', 'border-')}`}
                    style={{ bottom: `${stat.val}%` }}
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentMissions missions={missions} />
        </div>
        
        <Card title="Ações Rápidas">
          <div className="space-y-4">
            <button className="w-full p-4 flex items-center gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <PlusCircle size={24} />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Novo Lançamento</p>
                <p className="text-xs text-slate-500">Métricas de emissão ou sociais</p>
              </div>
            </button>
            <button className="w-full p-4 flex items-center gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                <Mail size={24} />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Enviar Relatório</p>
                <p className="text-xs text-slate-500">Sumário trimestral automático</p>
              </div>
            </button>
            <button className="w-full p-4 flex items-center gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group">
              <div className="w-12 h-12 rounded-xl bg-slate-500/10 text-slate-500 flex items-center justify-center group-hover:bg-slate-500 group-hover:text-white transition-all">
                <CloudSync size={24} />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Sincronizar APIs</p>
                <p className="text-xs text-slate-500">GRI, SASB e TCFD</p>
              </div>
            </button>
            
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status do Sistema</p>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 
                  Conectado ao Firebase
                </span>
                <span className="font-mono text-slate-400">V2.4.0</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
