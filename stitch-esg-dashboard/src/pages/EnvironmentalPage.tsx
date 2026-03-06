import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Leaf, TrendingUp, Zap, Recycle, Droplets } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Company } from '../types';

export const EnvironmentalPage: React.FC = () => {
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
            setCompany({ id: companyDoc.id, ...companyDoc.data() } as Company);
          }
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-environmental text-white rounded-lg chunky-shadow">
            <Leaf size={24} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 uppercase">
            Pilar Ambiental (E)
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400">
          Gerencie e monitore o impacto ecológico da <span className="text-primary font-bold">{company?.name}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card variant="chunky">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score Ambiental</span>
            <div className="p-2 bg-environmental/10 text-environmental rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{company?.esgScores.environmental || 0}</p>
          <p className="text-environmental text-[10px] font-black uppercase tracking-wider mt-1">Nível: Guardião das Águas</p>
        </Card>

        <Card variant="chunky">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Energia</span>
            <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
              <Zap size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-100">85%</p>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mt-1">Fontes Renováveis</p>
        </Card>

        <Card variant="chunky">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resíduos</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <Recycle size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-100">92%</p>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mt-1">Taxa de Reciclagem</p>
        </div>
      </div>

      <Card title="Próximas Missões Ambientais">
        <div className="space-y-4">
          {[
            { icon: Droplets, title: 'Redução de Consumo de Água', points: '+250 XP', status: 'Em Curso' },
            { icon: Leaf, title: 'Plantio de Mudas Nativas', points: '+500 XP', status: 'Pendente' },
          ].map((mission, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
                  <mission.icon size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{mission.title}</p>
                  <p className="text-xs text-primary font-black">{mission.points}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                mission.status === 'Em Curso' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {mission.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
};
