import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Gavel, TrendingUp, Scale, ShieldAlert, FileCheck } from 'lucide-react';
import { AreaChart, BadgeDelta } from '@tremor/react';
import { useAuth } from '../context/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Company } from '../types';

const chartData = [
  { date: 'JAN', 'Conformidade': 90 },
  { date: 'FEV', 'Conformidade': 92 },
  { date: 'MAR', 'Conformidade': 91 },
  { date: 'ABR', 'Conformidade': 95 },
  { date: 'MAI', 'Conformidade': 98 },
  { date: 'JUN', 'Conformidade': 100 },
  { date: 'JUL', 'Conformidade': 100 },
];

export const GovernancePage: React.FC = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

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
          }
        }
      } catch (err) {
        console.error("Error fetching governance data:", err);
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
              <div className="p-2 bg-governance text-white rounded-xl shadow-lg shadow-blue-500/20">
                <Gavel size={24} />
              </div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Governança (G)
              </h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest opacity-70">
              Ética e conformidade da <span className="text-primary font-black italic">{company?.name}</span>.
            </p>
          </div>
          <BadgeDelta deltaType="increase" className="font-black uppercase text-[10px]">Conformidade Total</BadgeDelta>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="chunky">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Score Governança</span>
              <div className="p-2 bg-governance/10 text-governance rounded-lg">
                <TrendingUp size={20} />
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-slate-100 font-mono">{company?.esgScores.governance || 0}</p>
            <p className="text-governance text-[8px] font-black uppercase tracking-widest mt-2 bg-blue-500/5 py-1 px-2 rounded-lg border border-blue-500/10 w-fit italic">
              Nível: Mestre da Ética
            </p>
          </Card>

          <Card variant="chunky">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Conformidade</span>
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                <Scale size={20} />
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-slate-100 font-mono">100%</p>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mt-2 italic">Treinamento Ativo</p>
          </Card>

          <Card variant="chunky">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Auditoria</span>
              <div className="p-2 bg-slate-500/10 text-slate-500 rounded-lg">
                <FileCheck size={20} />
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-slate-100 font-mono">A+</p>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mt-2 italic">Status Bureau Veritas</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card title="Índice de Transparência" subtitle="Evolução do compliance corporativo">
            <div className="h-72 mt-4">
              <AreaChart
                className="h-full"
                data={chartData}
                index="date"
                categories={['Conformidade']}
                colors={['blue']}
                valueFormatter={(number: number) => `${number}%`}
                showAnimation={true}
                showLegend={false}
                yAxisWidth={40}
              />
            </div>
          </Card>

          <Card title="Próximas Missões de Governança">
            <div className="space-y-4">
              {[
                { icon: ShieldAlert, title: 'Código de Conduta', points: '+400 XP', status: 'Em Curso' },
                { icon: Scale, title: 'Canal de Denúncias', points: '+600 XP', status: 'Pendente' },
              ].map((mission, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl group-hover:bg-governance/10 group-hover:text-governance transition-all">
                      <mission.icon size={24} />
                    </div>
                    <div>
                      <p className="font-black text-xs text-slate-900 dark:text-slate-100 uppercase tracking-tight">{mission.title}</p>
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 italic">{mission.points}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest border-2 ${
                    mission.status === 'Em Curso' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {mission.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
