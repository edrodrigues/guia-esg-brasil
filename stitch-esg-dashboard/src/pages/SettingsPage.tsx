import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bell, Sun, Lock, Shield, Eye, Smartphone, Check, AlertCircle } from 'lucide-react';

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  weeklyReport: boolean;
  missionUpdates: boolean;
  scoreChanges: boolean;
  profileVisibility: 'public' | 'private';
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  weeklyReport: true,
  missionUpdates: true,
  scoreChanges: false,
  profileVisibility: 'public',
};

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (err) {
        console.error('Error parsing settings:', err);
      }
    }
  }, []);

  // Aplicar tema
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.theme);
    }
  }, [settings.theme]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simular salvamento (aqui seria uma chamada ao Firestore)
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.setItem('userSettings', JSON.stringify(settings));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleTheme = (theme: 'light' | 'dark' | 'system') => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const toggleNotification = (key: 'weeklyReport' | 'missionUpdates' | 'scoreChanges') => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Configurações</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Personalize sua experiência e gerencie as preferências da sua conta.</p>
        </div>
        <Button onClick={handleSave} isLoading={saving} className="flex items-center gap-2">
          {showSuccess ? <Check size={18} /> : null}
          {showSuccess ? 'Salvo!' : 'Salvar Alterações'}
        </Button>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3">
          <Check size={20} className="text-emerald-500" />
          <span className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Configurações salvas com sucesso!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Preferências de Interface" subtitle="Ajuste como a plataforma aparece para você">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                    <Sun size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Modo de Exibição</p>
                    <p className="text-xs text-slate-500">Alternar entre tema claro e escuro</p>
                  </div>
                </div>
                <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-xl">
                  <button 
                    onClick={() => toggleTheme('light')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${settings.theme === 'light' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    Claro
                  </button>
                  <button 
                    onClick={() => toggleTheme('dark')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${settings.theme === 'dark' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    Escuro
                  </button>
                  <button 
                    onClick={() => toggleTheme('system')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${settings.theme === 'system' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    Sistema
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Resumo Semanal</p>
                    <p className="text-xs text-slate-500">Receber notificações sobre seu progresso</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleNotification('weeklyReport')}
                  className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${settings.weeklyReport ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${settings.weeklyReport ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </Card>

          <Card title="Segurança e Privacidade" subtitle="Proteja sua conta e seus dados corporativos">
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors group">
                <div className="flex items-center gap-3">
                  <Lock size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Alterar Senha de Acesso</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atualizado há 3 meses</span>
              </button>
              
              <div className="h-[1px] bg-slate-100 dark:bg-slate-800"></div>
              
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors group">
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Autenticação em Duas Etapas</span>
                </div>
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Desativado</span>
              </button>

              <div className="h-[1px] bg-slate-100 dark:bg-slate-800"></div>

              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors group">
                <div className="flex items-center gap-3">
                  <Eye size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Visibilidade do Perfil Corporativo</span>
                </div>
                <span 
                  onClick={() => setSettings(prev => ({ ...prev, profileVisibility: prev.profileVisibility === 'public' ? 'private' : 'public' }))}
                  className={`text-[10px] font-black uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity ${settings.profileVisibility === 'public' ? 'text-emerald-500' : 'text-slate-400'}`}
                >
                  {settings.profileVisibility === 'public' ? 'Público' : 'Privado'}
                </span>
              </button>
            </div>
          </Card>

          <Card title="Notificações" subtitle="Gerencie quais notificações você recebe">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-slate-400" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Alertas de Missão</p>
                    <p className="text-xs text-slate-500">Notificar quando uma nova missão estiver disponível</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleNotification('missionUpdates')}
                  className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${settings.missionUpdates ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${settings.missionUpdates ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="text-slate-400" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Mudanças de Score</p>
                    <p className="text-xs text-slate-500">Notificar quando seus scores ESG mudarem</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleNotification('scoreChanges')}
                  className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${settings.scoreChanges ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${settings.scoreChanges ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-black uppercase tracking-tight mb-4 text-slate-900 dark:text-slate-100">Resumo</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Tema:</span>
                <span className="font-medium capitalize">{settings.theme}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Perfil:</span>
                <span className="font-medium capitalize">{settings.profileVisibility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Notificações:</span>
                <span className="font-medium">{[(settings.weeklyReport, settings.missionUpdates, settings.scoreChanges)].filter(Boolean).length} ativas</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center">
            <p className="text-xs font-bold text-slate-400 uppercase mb-4">Suporte Técnico</p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-6">Precisa de ajuda com as configurações avançadas?</p>
            <Button className="w-full" variant="outline">Falar com Mentor Stitch</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
