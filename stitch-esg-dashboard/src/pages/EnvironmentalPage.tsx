import React, { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Leaf, Zap, Recycle, Droplets,
  ClipboardCheck, Cloud, Box, RefreshCw, TreeDeciduous,
  ArrowRight, Target, Star, Award, ShieldCheck
} from 'lucide-react';
import { AreaChart, BadgeDelta } from '@tremor/react';
import { useAuth } from '../context/useAuth';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { Company } from '../types';
import { calculateESGDelta } from '../utils/scoreCalculator';

// Dados estáticos para o gráfico de evolução
const chartData = [
  { date: 'JAN', 'Eficiência': 45, 'Média Setor': 48 },
  { date: 'FEV', 'Eficiência': 52, 'Média Setor': 50 },
  { date: 'MAR', 'Eficiência': 48, 'Média Setor': 52 },
  { date: 'ABR', 'Eficiência': 61, 'Média Setor': 55 },
  { date: 'MAI', 'Eficiência': 55, 'Média Setor': 58 },
  { date: 'JUN', 'Eficiência': 67, 'Média Setor': 60 },
  { date: 'JUL', 'Eficiência': 72, 'Média Setor': 62 },
];

const PILLARS = [
  { id: 'sga', label: 'Gestão Ambiental (SGA)', icon: ClipboardCheck, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'energia', label: 'Energia Limpa', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { id: 'agua', label: 'Água e Efluentes', icon: Droplets, color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  { id: 'residuos', label: 'Gestão de Resíduos', icon: Recycle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'arClima', label: 'Ar e Clima (GEE)', icon: Cloud, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { id: 'materiaPrima', label: 'Matéria-Prima', icon: Box, color: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/20' },
  { id: 'cicloVida', label: 'Ciclo de Vida', icon: RefreshCw, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'biodiversidade', label: 'Biodiversidade', icon: TreeDeciduous, color: 'text-green-600', bg: 'bg-green-600/10', border: 'border-green-600/20' },
];

export const EnvironmentalPage: React.FC = () => {
  const { user, refreshAuth } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showXPToast, setShowXPToast] = useState(false);

  const [scores, setScores] = useState<Record<string, number>>({
    sga: 0,
    energia: 0,
    agua: 0,
    residuos: 0,
    arClima: 0,
    materiaPrima: 0,
    cicloVida: 0,
    biodiversidade: 0,
  });

  // Carregar dados iniciais
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

            if (companyData.environmentalSubScores) {
              setScores(companyData.environmentalSubScores);
            } else if (companyData.esgScores) {
              // Fallback para esgScores se subScores não existirem
              setScores(prev => ({
                ...prev,
                energia: companyData.goals?.energia || 0,
                residuos: companyData.goals?.residuos || 0,
              }));
            }
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

  // Lógica de Missões Dinâmicas baseada nos scores baixos
  const quests = useMemo(() => {
    const lowScores = Object.entries(scores)
      .filter(([_, score]) => score < 70)
      .sort((a, b) => a[1] - b[1]);

    const questData = [
      { id: 'sga', title: 'Estruturar SGA', xp: 500, icon: ClipboardCheck, desc: 'Implementar monitoramento ISO 14001' },
      { id: 'energia', title: 'Energia Renovável', xp: 800, icon: Zap, desc: 'Aumentar matriz solar/eólica' },
      { id: 'agua', title: 'Reuso Hídrico', xp: 600, icon: Droplets, desc: 'Instalar sistema de captação de chuva' },
      { id: 'residuos', title: 'Lixo Zero', xp: 700, icon: Recycle, desc: 'Zerar envio para aterros' },
      { id: 'arClima', title: 'Inventário GEE', xp: 1000, icon: Cloud, desc: 'Mapear escopos 1, 2 e 3' },
      { id: 'materiaPrima', title: 'Rastreabilidade FSC', xp: 600, icon: Box, desc: 'Certificar 100% da madeira' },
      { id: 'cicloVida', title: 'Logística Reversa', xp: 900, icon: RefreshCw, desc: 'Criar programa de devolução' },
      { id: 'biodiversidade', title: 'Reflorestamento', xp: 1200, icon: TreeDeciduous, desc: 'Plantar 100 árvores nativas' },
    ];

    return lowScores.slice(0, 3).map(([id, _]) => {
      return questData.find(q => q.id === id) || questData[0];
    });
  }, [scores]);

  const handleSaveScores = async () => {
    if (!company) return;

    setSaving(true);
    try {
      const averageScore = Math.round(
        Object.values(scores).reduce((a, b) => a + b, 0) / PILLARS.length
      );

      const previousScores = company.esgScores;
      const newScores = {
        ...previousScores,
        environmental: averageScore,
      };

      const newDelta = calculateESGDelta(newScores, previousScores);
      const xpGain = 150;

      await updateDoc(doc(db, 'companies', company.id), {
        'esgScores.environmental': averageScore,
        'environmentalSubScores': scores,
        currentXP: (company.currentXP || 0) + xpGain,
        esgDelta: newDelta,
        lastEnvironmentalUpdate: Timestamp.now(),
      });

      if (refreshAuth) await refreshAuth();

      setCompany(prev => prev ? {
        ...prev,
        esgScores: newScores,
        environmentalSubScores: scores,
        esgDelta: newDelta,
        currentXP: (prev.currentXP || 0) + xpGain,
        lastEnvironmentalUpdate: Timestamp.now() as any,
      } : null);

      setShowXPToast(true);
      setTimeout(() => setShowXPToast(false), 4000);
    } catch (err) {
      console.error("Error saving environmental scores:", err);
    } finally {
      setSaving(false);
    }
  };

  const getRanking = (score: number) => {
    if (score >= 90) return { label: 'Mestre', color: 'bg-primary text-white border-primary-teal', progress: 100 };
    if (score >= 70) return { label: 'Guardião', color: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/20', progress: 75 };
    if (score >= 30) return { label: 'Praticante', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', progress: 45 };
    return { label: 'Noviço', color: 'bg-slate-100 text-slate-500 border-slate-200', progress: 15 };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-emerald-500/20"></div>
          <p className="text-slate-400 font-black uppercase text-xs tracking-widest animate-pulse">Sincronizando Biosfera...</p>
        </div>
      </DashboardLayout>
    );
  }

  const globalEnvScore = company?.esgScores?.environmental || 0;
  const levelProgress = (company?.currentXP || 0) % 1000 / 10; // Exemplo de nível a cada 1000 XP

  return (
    <DashboardLayout>
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">

        {/* Premium XP Toast */}
        {showXPToast && (
          <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="bg-slate-900 border-2 border-emerald-500 p-6 rounded-2xl shadow-2xl flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-50" />
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white relative z-10 animate-bounce">
                <Star size={24} fill="currentColor" />
              </div>
              <div className="relative z-10">
                <h4 className="text-white font-black uppercase tracking-tighter text-xl">+150 XP</h4>
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Biosfera Sincronizada!</p>
              </div>
              <div className="ml-4 w-12 h-12 rounded-full border-4 border-emerald-500/30 flex items-center justify-center text-emerald-500 font-black text-xs relative z-10">
                Lvl {company?.level || 1}
              </div>
            </div>
          </div>
        )}

        {/* Hero Section - Redesenhada para Premium UX */}
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 rounded-[2.5rem] shadow-2xl transition-all duration-700 group-hover:scale-[1.01]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />

          <div className="relative p-10 flex flex-col lg:flex-row justify-between gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-5 mb-6">
                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-inner">
                  <Leaf size={40} className="text-emerald-300 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Pilar Ambiental</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-emerald-200/70 font-bold text-sm uppercase tracking-widest">Simb 2024 / Eixo E</span>
                    <div className="h-1 w-12 bg-emerald-400/30 rounded-full" />
                    <span className="text-emerald-400 font-black italic text-xs uppercase">{company?.name}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Target size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-200/50 uppercase tracking-widest">Status da Jornada</p>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Guardião Nível {company?.level || 1}</h3>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Award size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-widest">Próximo Nível</p>
                      <span className="text-[10px] font-black text-white">{levelProgress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)] transition-all duration-1000" style={{ width: `${levelProgress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:items-end justify-center gap-4">
              <Card variant="glass" className="p-6 border-white/10 bg-white/5 min-w-[280px]">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Performance Global E</p>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-6xl font-black text-white font-mono tracking-tighter">{globalEnvScore}</h2>
                  <BadgeDelta deltaType={company?.esgDelta?.environmental ? (company.esgDelta.environmental > 0 ? 'increase' : 'decrease') : 'unchanged'} className="font-black bg-white/10 text-white border-0">
                    {company?.esgDelta?.environmental || 0}%
                  </BadgeDelta>
                </div>
                <p className="text-[9px] text-emerald-400/70 font-bold uppercase mt-2 tracking-widest underline decoration-dotted">vs Média do Setor</p>
              </Card>

              <Button
                onClick={handleSaveScores}
                isLoading={saving}
                className="w-full lg:w-auto h-16 px-10 bg-white text-slate-900 border-0 rounded-[2rem] font-black uppercase tracking-[0.15em] text-xs shadow-2xl shadow-emerald-900/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                <ShieldCheck size={20} className="text-emerald-600" />
                Sincronizar Impacto
              </Button>
            </div>
          </div>
        </div>

        {/* 8 Guardiões - Grid Premium */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Os 8 Pilares da Regeneração</h2>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-slate-200 dark:from-slate-800 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar) => {
              const rank = getRanking(scores[pillar.id] || 0);
              return (
                <Card
                  key={pillar.id}
                  variant="chunky"
                  className={`relative overflow-hidden group border-2 ${pillar.border} transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-black/40`}
                >
                  <div className={`p-6 ${pillar.bg.replace('/10', '/5')} h-full flex flex-col`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl ${pillar.bg} ${pillar.color} transition-all group-hover:rotate-[10deg] duration-500 shadow-lg shadow-black/5 dark:shadow-black/20`}>
                        <pillar.icon size={26} />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 shadow-sm ${rank.color}`}>
                        {rank.label}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase mb-6 leading-tight flex-1">
                      {pillar.label}
                    </h3>

                    <div className="space-y-4 bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-white/50 dark:border-white/5 shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nível de Impacto</span>
                        <span className={`font-mono text-xl font-black ${pillar.color}`}>{scores[pillar.id] || 0}%</span>
                      </div>
                      <div className="relative pt-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={scores[pillar.id] || 0}
                          onChange={(e) => setScores(prev => ({ ...prev, [pillar.id]: Number(e.target.value) }))}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
                        />
                        <div
                          className="absolute bottom-[-14px] h-1 bg-emerald-500 opacity-20 rounded-full transition-all duration-500"
                          style={{ width: `${scores[pillar.id]}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Analytics & Quests Log Dinâmico */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
          <div className="lg:col-span-8">
            <Card className="h-full border-b-8 border-emerald-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Stream de Eficiência</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Comparativo de performance histórica</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <span className="text-[9px] font-black text-slate-500">SUA EMPRESA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-slate-300 rounded-full" />
                    <span className="text-[9px] font-black text-slate-500">MÉDIA SETOR</span>
                  </div>
                </div>
              </div>
              <div className="h-[340px]">
                <AreaChart
                  className="h-full"
                  data={chartData}
                  index="date"
                  categories={['Eficiência', 'Média Setor']}
                  colors={['emerald', 'slate']}
                  valueFormatter={(number: number) => `${number}%`}
                  showAnimation={true}
                  showXAxis={true}
                  showYAxis={true}
                  showGridLines={false}
                  curveType="monotone"
                  startEndOnly={false}
                />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card title="The Quest Log" subtitle="Missões sugeridas pela IA" className="h-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800">
              <div className="space-y-6 mt-6">
                {quests.map((quest, i) => (
                  <div key={i} className="group cursor-pointer relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity blur-sm" />
                    <div className="relative flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent hover:border-emerald-500/30 transition-all shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl shadow-lg border border-slate-100 dark:border-slate-600 transition-all group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110">
                            <quest.icon size={22} />
                          </div>
                          <div>
                            <p className="font-black text-xs text-slate-900 dark:text-slate-100 uppercase tracking-tight leading-tight">{quest.title}</p>
                            <p className="text-[10px] text-emerald-500 font-black italic">{quest.xp} XP</p>
                          </div>
                        </div>
                        <ArrowRight size={18} className="text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4 leading-relaxed line-clamp-2">
                        {quest.desc}
                      </p>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full group-hover:animate-pulse" style={{ width: '40%' }} />
                      </div>
                    </div>
                  </div>
                ))}

                <button className="w-full h-14 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-900/40 mt-4 outline-none border-b-4 border-slate-800 dark:border-slate-700 hover:border-emerald-700 active:translate-y-1 active:border-b-0">
                  Explorar Todas as Missões
                </button>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

