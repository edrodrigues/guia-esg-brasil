import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  BarChart,
  BadgeDelta,
  DonutChart,
  List,
  ListItem
} from '@tremor/react';
import {
  FileDown,
  Database,
  Stars,
  Leaf,
  Zap,
  Recycle,
  Trophy,
  ArrowRight,
  Droplets,
  Users,
  Scale,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Company } from '../types';
import { getDeltaType } from '../utils/scoreCalculator';

const dataFormatter = (number: number) => `${Intl.NumberFormat('pt-BR').format(number).toString()} t`;

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('environmental');
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
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
        console.error("Error fetching company for reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [user]);

  const formData = useMemo(() => 
    (company as unknown as { formData?: Record<string, string | number | (string | number)[]> })?.formData || {}, 
    [company]
  );

  // Mapeamento Dinâmico
  const reportsData = useMemo(() => {
    // Carbono
    // Tenta pegar os campos individuais (0, 1, 2) ou o campo total se for um só
    const escopo1 = Number(formData['environmental_6.2_0']) || 0;
    const escopo2 = Number(formData['environmental_6.2_1']) || 0;
    const escopo3 = Number(formData['environmental_6.2_2']) || 0;
    
    let totalCarbon = escopo1 + escopo2 + escopo3;
    if (totalCarbon === 0 && formData['environmental_6.2']) {
      totalCarbon = Number(formData['environmental_6.2']) || 0;
    }

    // Energia Renovável
    const energyValue = String(formData['environmental_3.4'] || '');
    const energyMap: Record<string, string> = {
      '1': '8%',
      '2': '10%',
      '3': '15%',
      '4': '20%',
      '5': '55%'
    };
    const renewableEnergy = energyMap[energyValue] || '0%';

    // Resíduos
    const wasteValue = String(formData['environmental_5.3'] || '');
    const wasteMap: Record<string, string> = {
      '1': '15%',
      '2': '30%',
      '3': '55%',
      '4': '80%',
      '5': '95%'
    };
    const wasteDiverted = wasteMap[wasteValue] || '0%';

    // Regional
    const state = String(formData['form_1.9'] || '');
    const sudeste = ['SP', 'RJ', 'MG', 'ES'];
    const sul = ['PR', 'SC', 'RS'];
    const centroOeste = ['MS', 'MT', 'GO', 'DF'];
    
    let region = 'Outros';
    if (sudeste.includes(state)) region = 'Sudeste';
    else if (sul.includes(state)) region = 'Sul';
    else if (centroOeste.includes(state)) region = 'Centro-Oeste';
    else if (state) region = 'Norte/NE';

    const regionalData = [
      { name: 'Sudeste', value: region === 'Sudeste' ? 100 : 0 },
      { name: 'Sul', value: region === 'Sul' ? 100 : 0 },
      { name: 'Centro-Oeste', value: region === 'Centro-Oeste' ? 100 : 0 },
      { name: 'Norte/NE', value: region === 'Norte/NE' ? 100 : 0 },
    ].filter(d => d.value > 0);

    if (regionalData.length === 0) {
      regionalData.push({ name: 'Não informado', value: 100 });
    }

    // Carbon Chart Simulation
    const monthsList = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO'];
    const carbonHistory = monthsList.map((m) => ({
      month: m,
      'Toneladas': totalCarbon > 0 
        ? Math.max(0.1, (totalCarbon / 8) * (1 + (Math.random() * 0.4 - 0.2)))
        : 0
    }));

    return {
      totalCarbon,
      renewableEnergy,
      wasteDiverted,
      regionalData,
      carbonHistory,
      escopo1,
      escopo2,
      escopo3
    };
  }, [formData]);

  const tabs = [
    { id: 'environmental', label: 'Meio Ambiente' },
    { id: 'social', label: 'Social' },
    { id: 'governance', label: 'Governança' },
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
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest mb-2">
              <Stars size={16} className="text-primary" />
              Relatório Personalizado
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              Impacto ESG: {company?.name || 'Sua Empresa'}
            </h1>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">
              Análise dinâmica baseada no seu diagnóstico mais recente. Esta página reflete seus dados reais de sustentabilidade.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2 border-2 px-5 py-6 rounded-2xl h-auto" onClick={() => window.print()}>
              <Database size={18} />
              Imprimir PDF
            </Button>
            <Button className="gap-2 px-6 py-6 rounded-2xl h-auto shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <FileDown size={18} />
              Exportar Livro
            </Button>
          </div>
        </div>

        {/* Dashboard Navigation */}
        <div className="flex items-center p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-10 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-primary'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-2 border-primary/10 hover:border-primary transition-colors relative overflow-hidden group h-full">
            <div className="absolute -top-4 -right-4 p-6 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
              <Globe size={120} className="text-primary" />
            </div>
            <p className="text-primary font-black uppercase text-[10px] tracking-[0.2em] mb-2">Emissões</p>
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-1">CO2e Total</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
              {reportsData.totalCarbon.toLocaleString('pt-BR')} <span className="text-lg font-bold text-slate-400 font-mono text-xs uppercase">t</span>
            </h3>
            <BadgeDelta deltaType={getDeltaType(company?.esgDelta?.environmental || 0)} className="font-black uppercase text-[10px]">
              {company?.esgDelta?.environmental ? `${company.esgDelta.environmental}% vs anterior` : 'Dados Iniciais'}
            </BadgeDelta>
          </Card>

          <Card className="p-2 border-primary/10 hover:border-primary transition-colors relative overflow-hidden group h-full">
            <div className="absolute -top-4 -right-4 p-6 opacity-10 group-hover:opacity-20 transition-opacity -rotate-12">
              <Zap size={120} className="text-primary" />
            </div>
            <p className="text-primary font-black uppercase text-[10px] tracking-[0.2em] mb-2">Energia</p>
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-1">Fontes Sustentáveis</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{reportsData.renewableEnergy}</h3>
            <BadgeDelta deltaType="increase" className="font-black uppercase text-[10px]">
              E-Score: {company?.esgScores.environmental || 0}
            </BadgeDelta>
          </Card>

          <Card className="p-2 border-primary/10 hover:border-primary transition-colors relative overflow-hidden group h-full">
            <div className="absolute -top-4 -right-4 p-6 opacity-10 group-hover:opacity-20 transition-opacity rotate-45">
              <Recycle size={120} className="text-primary" />
            </div>
            <p className="text-primary font-black uppercase text-[10px] tracking-[0.2em] mb-2">Resíduos</p>
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-1">Taxa de Desvio</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{reportsData.wasteDiverted}</h3>
            <div className="inline-flex items-center gap-2 text-emerald-600 font-black px-3 py-1 bg-emerald-50 rounded-lg text-[10px] uppercase tracking-wider border border-emerald-100">
              <Trophy size={12} />
              Status Ambiental
            </div>
          </Card>
        </div>

        {/* Visualization & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Chart Area */}
          <Card className="lg:col-span-2 p-2 border-slate-100 dark:border-slate-800 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Histórico de Carbono (Simulado)</h4>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Estimativa mensal baseada no reporte anual</p>
              </div>
            </div>

            <div className="h-80 w-full">
              <BarChart
                className="h-full"
                data={reportsData.carbonHistory}
                index="month"
                categories={['Toneladas']}
                colors={['emerald']}
                valueFormatter={dataFormatter}
                yAxisWidth={48}
                showAnimation={true}
              />
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Escopo 1', value: `${reportsData.escopo1} t`, color: 'slate' },
                { label: 'Escopo 2', value: `${reportsData.escopo2} t`, color: 'slate' },
                { label: 'Escopo 3', value: `${reportsData.escopo3} t`, color: 'slate' },
                { label: 'Total', value: `${reportsData.totalCarbon} t`, color: 'primary' },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${item.color === 'primary'
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'
                    }`}
                >
                  <p className={`text-[10px] uppercase font-black mb-1 ${item.color === 'primary' ? 'text-primary' : 'text-slate-400'
                    }`}>
                    {item.label}
                  </p>
                  <p className={`text-sm font-black font-mono ${item.color === 'primary' ? 'text-primary' : 'text-slate-700 dark:text-slate-200'
                    }`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Qualitative Statements */}
          <div className="flex flex-col gap-6">
            <Card className="p-2 border-primary/10 bg-primary/5 dark:bg-primary/10 h-full flex flex-col" title="Indicadores de Impacto">
              <div className="space-y-6 flex-1">
                {[
                  { 
                    icon: Droplets, 
                    title: 'Monitoramento de Água', 
                    desc: formData['environmental_4.1'] === '1' ? 'Ainda não monitorado' : 'Processos monitorados' 
                  },
                  { 
                    icon: Users, 
                    title: 'Diversidade de Gênero', 
                    desc: `${formData['social_12.1'] === '5' ? 'Mais de 50%' : 'Em evolução'} mulheres` 
                  },
                  { 
                    icon: Scale, 
                    title: 'Ética e Compliance', 
                    desc: formData['governance_15.1'] === '5' ? 'Código de Ética Robusto' : 'Políticas em desenvolvimento' 
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 rounded-3xl border-4 border-primary/5 p-6 flex items-center justify-between group cursor-pointer hover:border-primary transition-all hover:translate-x-2 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <item.icon size={24} />
                      </div>
                      <div>
                        <h5 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{item.title}</h5>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-8 py-4 border-2 border-primary/20 bg-white dark:bg-slate-900 text-primary font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-primary hover:text-white transition-all">
                Ver Detalhes do Diagnóstico
              </Button>
            </Card>
          </div>
        </div>

        {/* Regional Impact Map & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-2 border-slate-100 dark:border-slate-800 flex flex-col" title="Presença Regional">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-4">
              <DonutChart
                className="h-40"
                data={reportsData.regionalData}
                category="value"
                index="name"
                colors={['emerald', 'teal', 'amber', 'rose']}
                showAnimation={true}
              />
              <List className="flex-1">
                {reportsData.regionalData.map((item) => (
                  <ListItem key={item.name} className="uppercase font-black text-[10px] tracking-widest">
                    <span>{item.name}</span>
                    <span className="font-mono text-sm">{item.value}%</span>
                  </ListItem>
                ))}
              </List>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-6 h-full">
            {[
              { 
                icon: Recycle, 
                label: 'Gestão de Resíduos', 
                value: reportsData.wasteDiverted, 
                trend: formData['environmental_5.1'] === '5' ? 'Plano Ativo' : 'Em Planejamento' 
              },
              { 
                icon: Leaf, 
                label: 'Maturidade Ambiental', 
                value: `${company?.esgScores.environmental || 0}/100`, 
                trend: 'Score E' 
              },
              { 
                icon: Users, 
                label: 'Impacto Social', 
                value: `${company?.esgScores.social || 0}/100`, 
                trend: 'Score S' 
              },
              { 
                icon: Scale, 
                label: 'Governança', 
                value: `${company?.esgScores.governance || 0}/100`, 
                trend: 'Score G' 
              },
            ].map((stat, i) => (
              <Card key={i} className="p-2 border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-primary/30 transition-all group">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                    <stat.icon size={24} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
                <div className="mt-4">
                  <h5 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter font-mono">{stat.value}</h5>
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">{stat.trend}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] gap-4 mb-8">
          <p>© Stitch ESG Dashboard, 2026. Dados baseados no seu diagnóstico corporativo.</p>
          <div className="flex items-center gap-8">
            <a className="hover:text-primary transition-colors" href="#">Política de Dados</a>
            <a className="hover:text-primary transition-colors" href="#">Transparência</a>
            <a className="hover:text-primary transition-colors" href="#">Suporte</a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
