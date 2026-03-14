import React, { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Leaf, TrendingUp, Zap, Recycle, ShieldCheck } from 'lucide-react';
import { AreaChart, BadgeDelta } from '@tremor/react';
import { useAuth } from '../context/useAuth';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import type { Company, Mission } from '../types';

const DEFAULT_CHART_DATA = [
  { date: 'JAN', 'Eficiência': 0 },
  { date: 'FEV', 'Eficiência': 0 },
  { date: 'MAR', 'Eficiência': 0 },
  { date: 'ABR', 'Eficiência': 0 },
  { date: 'MAI', 'Eficiência': 0 },
  { date: 'JUN', 'Eficiência': 0 },
  { date: 'JUL', 'Eficiência': 0 },
];

export const EnvironmentalPage: React.FC = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<Mission[]>([]);

  const [energyScore, setEnergyScore] = useState(85);
  const wasteScore = company?.goals?.residuos || 92;

  // Chart data dinâmico baseado em dados reais
  const chartData = useMemo(() => {
    if (!company?.evolutionData || company.evolutionData.length === 0) {
      return DEFAULT_CHART_DATA.map(item => ({
        ...item,
        'Eficiência': company?.esgScores?.environmental || 0,
      }));
    }
    
    return company.evolutionData.map(point => ({
      date: point.month,
      'Eficiência': point.environmental,
    }));
  }, [company?.evolutionData, company?.esgScores?.environmental]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const companyId = userDoc.data().companyId;
          const companyDoc = await getDoc(doc(db, 'companies', companyId));
          if (companyDoc.exists()) {
            const companyData = { id: companyDoc.id, ...companyDoc.data() } as Company;
            setCompany(companyData);

            if (companyData.goals) {
              setEnergyScore(companyData.goals.energia);
            }
          }

          // Buscar missões ambientais reais do Firestore
          const missionsQuery = query(
            collection(db, 'missions'),
            where('companyId', '==', companyId),
            where('type', '==', 'E'),
            orderBy('deadline', 'asc'),
            limit(5)
          );
          const missionsSnap = await getDocs(missionsQuery);
          const missionsList = missionsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Mission));
          setMissions(missionsList);
        }
      } catch (err) {
        console.error("Error fetching environmental data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);



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
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-environmental text-white rounded-xl shadow-lg shadow-emerald-500/20">
                <Leaf size={24} />
              </div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Ambiental (E)
              </h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest opacity-70">
              Impacto ecológico da <span className="text-primary font-black italic">{company?.name}</span>.
            </p>
          </div>
          <BadgeDelta deltaType="increase" className="font-black uppercase text-[10px]">Líder do Setor</BadgeDelta>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="chunky">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Score Ambiental</span>
              <div className="p-2 bg-environmental/10 text-environmental rounded-lg">
                <TrendingUp size={20} />
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-slate-100 font-mono">{company?.esgScores.environmental || 0}</p>
            <p className="text-environmental text-[8px] font-black uppercase tracking-widest mt-2 bg-emerald-500/5 py-1 px-2 rounded-lg border border-emerald-500/10 w-fit italic">
              Nível: Guardião das Águas
            </p>
          </Card>

          <Card variant="chunky">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Energia</span>
              <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                <Zap size={20} />
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-slate-100 font-mono py-2">{energyScore}%</p>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mt-2 italic">Fontes Renováveis (%)</p>
          </Card>

          <Card variant="chunky">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resíduos</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <Recycle size={20} />
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-slate-100 font-mono py-2">{wasteScore}%</p>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mt-2 italic">Taxa de Reciclagem (%)</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card title="Evolução da Pegada" subtitle="Indicadores de performance mensal">
            <div className="h-72 mt-4">
              <AreaChart
                className="h-full"
                data={chartData}
                index="date"
                categories={['Eficiência']}
                colors={['emerald']}
                valueFormatter={(number: number) => `${number}%`}
                showAnimation={true}
                showLegend={false}
                yAxisWidth={40}
              />
            </div>
          </Card>

          <Card title="Próximas Missões Ambientais">
            <div className="space-y-4">
              {missions.length > 0 ? (
                missions.map((mission) => (
                  <div key={mission.id} className="flex items-center justify-between p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl group-hover:bg-environmental/10 group-hover:text-environmental transition-all">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <p className="font-black text-xs text-slate-900 dark:text-slate-100 uppercase tracking-tight">{mission.title}</p>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 italic">+500 XP</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest border-2 ${mission.status === 'em_curso' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                      {mission.status === 'em_curso' ? 'Em Curso' : mission.status === 'concluido' ? 'Concluído' : 'Pendente'}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  {[
                    { icon: Zap, title: 'Energia Renovável', points: '+800 XP', status: 'Em Curso' },
                    { icon: Recycle, title: 'Lixo Zero', points: '+700 XP', status: 'Pendente' },
                  ].map((mission, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl group-hover:bg-environmental/10 group-hover:text-environmental transition-all">
                          <mission.icon size={24} />
                        </div>
                        <div>
                          <p className="font-black text-xs text-slate-900 dark:text-slate-100 uppercase tracking-tight">{mission.title}</p>
                          <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 italic">{mission.points}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest border-2 ${mission.status === 'Em Curso' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                        {mission.status}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
