import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
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

const carbonData = [
  { month: 'JAN', value: 0.42 },
  { month: 'FEV', value: 0.38 },
  { month: 'MAR', value: 0.31 },
  { month: 'ABR', value: 0.52 },
  { month: 'MAI', value: 0.28 },
  { month: 'JUN', value: 0.21 },
  { month: 'JUL', value: 0.35 },
  { month: 'AGO', value: 0.29 },
];

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('environmental');

  const tabs = [
    { id: 'environmental', label: 'Meio Ambiente' },
    { id: 'social', label: 'Social' },
    { id: 'governance', label: 'Governança' },
    { id: 'supply', label: 'Suprimentos' },
  ];

  return (
    <DashboardLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest mb-2">
              <Stars size={16} className="text-primary" />
              Desempenho Anual
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              Relatório de Impacto ESG 2023
            </h1>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">
              Uma jornada visual pelas nossas pegadas ambientais, iniciativas sociais e padrões de governança em todo o Brasil.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2 border-2 px-5 py-6 rounded-2xl h-auto">
              <Database size={18} />
              Dados CSV
            </Button>
            <Button className="gap-2 px-6 py-6 rounded-2xl h-auto shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <FileDown size={18} />
              Baixar Livro de Impacto
            </Button>
          </div>
        </div>

        {/* Dashboard Navigation */}
        <div className="flex items-center p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-10 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
                activeTab === tab.id
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
          <Card className="p-8 border-4 border-primary/10 hover:border-primary transition-colors relative overflow-hidden group h-full">
            <div className="absolute -top-4 -right-4 p-6 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
              <Globe size={120} className="text-primary" />
            </div>
            <p className="text-primary font-black uppercase text-[10px] tracking-[0.2em] mb-2 text-primary-soft">Missão 01</p>
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-1">Redução de Carbono</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
              1.240 <span className="text-lg font-bold text-slate-400">Toneladas</span>
            </h3>
            <div className="inline-flex items-center gap-2 text-white font-black bg-primary px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider">
              <Zap size={12} fill="currentColor" />
              +12.4% vs ano anterior
            </div>
          </Card>

          <Card className="p-8 border-4 border-primary/10 hover:border-primary transition-colors relative overflow-hidden group h-full">
            <div className="absolute -top-4 -right-4 p-6 opacity-10 group-hover:opacity-20 transition-opacity -rotate-12">
              <Zap size={120} className="text-primary" />
            </div>
            <p className="text-primary font-black uppercase text-[10px] tracking-[0.2em] mb-2 text-primary-soft">Missão 02</p>
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-1">Energia Renovável</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4">85.2%</h3>
            <div className="inline-flex items-center gap-2 text-white font-black bg-primary px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider">
              <Stars size={12} />
              Meta: 90% até 2025
            </div>
          </Card>

          <Card className="p-8 border-4 border-primary/10 hover:border-primary transition-colors relative overflow-hidden group h-full">
            <div className="absolute -top-4 -right-4 p-6 opacity-10 group-hover:opacity-20 transition-opacity rotate-45">
              <Recycle size={120} className="text-primary" />
            </div>
            <p className="text-primary font-black uppercase text-[10px] tracking-[0.2em] mb-2 text-primary-soft">Missão 03</p>
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-1">Resíduos Desviados</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4">92.0%</h3>
            <div className="inline-flex items-center gap-2 text-white font-black bg-primary px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider">
              <Trophy size={12} />
              Grau A+ de Desempenho
            </div>
          </Card>
        </div>

        {/* Visualization & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Chart Area */}
          <Card className="lg:col-span-2 p-8 border-2 border-slate-100 dark:border-slate-800 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Nossa Jornada de Carbono</h4>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">kg CO2e por receita em BRL</p>
              </div>
              <select className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-500 px-4 py-2 focus:ring-primary uppercase tracking-widest outline-none">
                <option>Últimos 12 Meses</option>
                <option>Últimos 2 Anos</option>
              </select>
            </div>
            
            <div className="h-72 w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carbonData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ 
                      borderRadius: '1rem', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      backgroundColor: '#0f172a',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#20B2AA', fontWeight: 900 }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[10, 10, 10, 10]} 
                    barSize={30}
                  >
                    {carbonData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 5 ? '#20B2AA' : '#20B2AA33'} 
                        className="hover:fill-primary transition-all duration-300 cursor-pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Escopo 1', value: '120 tCO2e', color: 'slate' },
                { label: 'Escopo 2', value: '450 tCO2e', color: 'slate' },
                { label: 'Escopo 3', value: '670 tCO2e', color: 'slate' },
                { label: 'Compensação', value: '-200 tCO2e', color: 'primary' },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                    item.color === 'primary' 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <p className={`text-[10px] uppercase font-black mb-1 ${
                    item.color === 'primary' ? 'text-primary' : 'text-slate-400'
                  }`}>
                    {item.label}
                  </p>
                  <p className={`text-sm font-black ${
                    item.color === 'primary' ? 'text-primary' : 'text-slate-700 dark:text-slate-200'
                  }`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Qualitative Statements */}
          <div className="flex flex-col gap-6">
            <Card className="p-8 border-2 border-primary/10 bg-primary/5 dark:bg-primary/10 h-full flex flex-col">
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
                <Trophy size={28} className="text-primary" />
                Resumo Estratégico
              </h4>
              
              <div className="space-y-6 flex-1">
                {[
                  { icon: Droplets, title: 'Consumo de Água', desc: '22% de redução em processos intensivos' },
                  { icon: Users, title: 'Inclusão Social', desc: '45% de mulheres em cargos de liderança' },
                  { icon: Scale, title: 'Ética e Conformidade', desc: '100% da equipe treinada contra corrupção' },
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
                Ver Nossa Metodologia
              </Button>
            </Card>
          </div>
        </div>

        {/* Regional Impact Map & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 border-2 border-slate-100 dark:border-slate-800 flex flex-col">
            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tighter">Distribuição ESG Regional</h4>
            <div className="relative flex-1 w-full bg-slate-50 dark:bg-slate-800/50 rounded-3xl overflow-hidden min-h-[300px] flex items-center justify-center shadow-inner group">
              <div 
                className="absolute inset-0 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000 bg-cover bg-center" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')" }}
              ></div>
              <div className="relative z-10 grid grid-cols-2 gap-6 p-6">
                {[
                  { region: 'Sudeste', score: 'A+', color: 'primary' },
                  { region: 'Sul', score: 'A', color: 'primary' },
                  { region: 'Centro-Oeste', score: 'B+', color: 'secondary' },
                  { region: 'Norte/NE', score: 'A-', color: 'primary' },
                ].map((reg, i) => (
                  <div key={i} className="bg-white/95 dark:bg-slate-900/95 p-6 rounded-[2rem] border-4 border-primary shadow-2xl transition-all hover:scale-110 cursor-default">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{reg.region}</p>
                    <p className={`text-3xl font-black ${reg.color === 'primary' ? 'text-primary' : 'text-secondary'}`}>{reg.score}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-6 h-full">
            {[
              { icon: Recycle, label: 'Taxa de Reciclagem', value: '78%', trend: '+5% desde o Q1' },
              { icon: Leaf, label: 'Ecoeficiência', value: '92/100', trend: 'Líder do Setor' },
              { icon: Users, label: 'Engajamento', value: '84%', trend: 'Score de Clima' },
              { icon: Scale, label: 'Compliance', value: '100%', trend: 'Zero Incidentes' },
            ].map((stat, i) => (
              <Card key={i} className="p-8 border-2 border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-primary/30 transition-all group">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                    <stat.icon size={24} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
                <div className="mt-4">
                  <h5 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h5>
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">{stat.trend}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] gap-4 mb-8">
          <p>© 2023 GUIA ESG BRASIL. Reporting verified by Bureau Veritas.</p>
          <div className="flex items-center gap-8">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Data Transparency</a>
            <a className="hover:text-primary transition-colors" href="#">Help Center</a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
