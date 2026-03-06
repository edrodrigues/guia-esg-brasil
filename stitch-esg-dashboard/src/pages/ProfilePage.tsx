import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import { Building2, Mail, MapPin, Tag } from 'lucide-react';
import { Company } from '../types';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
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
      } catch (err: unknown) {
        console.error("Error fetching company data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [user]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Perfil da Empresa</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie as informações básicas e identidade da sua organização.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Informações Gerais" subtitle="Dados principais da organização">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nome Fantasia</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Building2 size={18} className="text-slate-400" />
                    <span className="text-sm font-medium">{company?.name || 'Não informado'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Setor de Atuação</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Tag size={18} className="text-slate-400" />
                    <span className="text-sm font-medium">{company?.industry || 'Não informado'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Região</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
                    <MapPin size={18} className="text-slate-400" />
                    <span className="text-sm font-medium">{company?.region || 'Brasil'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">E-mail de Contato</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Mail size={18} className="text-slate-400" />
                    <span className="text-sm font-medium">{user?.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button variant="outline">Editar Informações</Button>
              </div>
            </div>
          </Card>

          <Card title="Status na Jornada" subtitle="Resumo de progresso atual">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Nível</p>
                <p className="text-2xl font-black text-primary">{company?.level || 1}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">XP Atual</p>
                <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{company?.currentXP || 0}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Missões</p>
                <p className="text-2xl font-black text-slate-900 dark:text-slate-100">0</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Selo</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Iniciante</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${company?.name || 'default'}`} 
                  alt="Company Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{company?.name || 'Sua Empresa'}</h3>
              <p className="text-sm text-slate-500 mb-6 italic">Membro desde {new Date().getFullYear()}</p>
              <Button className="w-full" variant="outline">Alterar Logo</Button>
            </div>
          </Card>
          
          <div className="p-6 bg-gradient-to-br from-primary to-emerald-500 rounded-2xl text-slate-900 shadow-lg shadow-primary/20">
            <h4 className="font-black uppercase tracking-tight mb-2">Próxima Conquista</h4>
            <p className="text-sm font-bold opacity-80 mb-4">Complete o Diagnóstico Inicial para ganhar 500 XP!</p>
            <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
              <div className="w-1/4 h-full bg-slate-900"></div>
            </div>
            <p className="text-[10px] font-black uppercase mt-2 text-right">25% Completo</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
