import React, { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Users, TrendingUp, Heart, GraduationCap, ShieldCheck } from 'lucide-react';
import { AreaChart, BadgeDelta } from '@tremor/react';
import { useAuth } from '../context/useAuth';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import type { Company, Mission } from '../types';

const DEFAULT_CHART_DATA = [
  { date: 'JAN', 'Engajamento': 0 },
  { date: 'FEV', 'Engajamento': 0 },
  { date: 'MAR', 'Engajamento': 0 },
  { date: 'ABR', 'Engajamento': 0 },
  { date: 'MAI', 'Engajamento': 0 },
  { date: 'JUN', 'Engajamento': 0 },
  { date: 'JUL', 'Engajamento': 0 },
];

export const SocialPage: React.FC = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<Mission[]>([]);

  const [diversityScore, setDiversityScore] = useState(45);
  const trainingScore = company?.socialSubScores?.treinamento || 88;

  // Chart data dinâmico baseado em dados reais
  const chartData = useMemo(() => {
    if (!company?.evolutionData || company.evolutionData.length === 0) {
      return DEFAULT_CHART_DATA.map(item => ({
        ...item,
        'Engajamento': company?.esgScores?.social || 0,
      }));
    }
    
    return company.evolutionData.map(point => ({
      date: point.month,
      'Engajamento': point.social,
    }));
  }, [company?.evolutionData, company?.esgScores?.social]);

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
              setDiversityScore(companyData.goals.diversidade);
            }
          }

          // Buscar missões sociais reais do Firestore
          const missionsQuery = query(
            collection(db, 'missions'),
            where('companyId', '==', companyId),
            where('type', '==', 'S'),
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
        console.error("Error fetching social data:", err);
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
              <div className="p-2 bg-social text-white rounded-xl shadow-lg shadow-amber-500/20">
                <Users size={24} />
              </div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Social (S)
              </h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest opacity-70">
              Impacto humano da <span className="text-primary font-black italic">{company?.name}</span>.
            </p>
          </div>
          <BadgeDelta deltaType="moderateIncrease" className="font-black uppercase text-[10px]">Crescimento Estável</BadgeDelta>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="chunky">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Score Social</span>
              <div className="p-2 bg-social/10 text-social rounded-lg">
                <TrendingUp size={20} />
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-slate-100 font-mono">{company?.esgScores.social || 0}</p>
            <p className="text-social text-[8px] font-black uppercase tracking-widest mt-2 bg-amber-500/5 py-1 px-2 rounded-lg border border-amber-500/10 w-fit italic">
              Nível: Guardião do Bem-Estar
            </p>
          </Card>

          <Card variant="chunky">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Diversidade</span>
              <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
                <Heart size={20} />
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-slate-100 font-mono py-2">{diversityScore}%</p>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mt-2 italic">Mulheres na Liderança (%)</p>
          </Card>

          <Card variant="chunky">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Treinamento</span>
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                <GraduationCap size={20} />
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-slate-100 font-mono py-2">{trainingScore}%</p>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mt-2 italic">Colaboradores Treinados (%)</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card title="Engajamento Interno" subtitle="Score de clima e cultura">
            <div className="h-72 mt-4">
              <AreaChart
                className="h-full"
                data={chartData}
                index="date"
                categories={['Engajamento']}
                colors={['amber']}
                valueFormatter={(number: number) => `${number}%`}
                showAnimation={true}
                showLegend={false}
                yAxisWidth={40}
              />
            </div>
          </Card>

          <Card title="Próximas Missões Sociais">
            <div className="space-y-4">
              {missions.length > 0 ? (
                missions.map((mission) => (
                  <div key={mission.id} className="flex items-center justify-between p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl group-hover:bg-social/10 group-hover:text-social transition-all">
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
                    { icon: ShieldCheck, title: 'Saúde Mental', points: '+300 XP', status: 'Em Curso' },
                    { icon: Users, title: 'Censo Diversidade', points: '+450 XP', status: 'Pendente' },
                  ].map((mission, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl group-hover:bg-social/10 group-hover:text-social transition-all">
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
