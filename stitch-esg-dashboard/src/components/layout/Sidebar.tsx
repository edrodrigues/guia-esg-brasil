import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Leaf, 
  Users, 
  Gavel, 
  BarChart3, 
  ClipboardCheck, 
  Download,
  LeafyGreen,
  LogOut,
  Lock,
  Trophy
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/useAuth';

export const Sidebar: React.FC = () => {
  const { signOut, isDiagnosticCompleted } = useAuth();
  const navItems = [
    { icon: LayoutDashboard, label: 'Início', path: '/dashboard', protected: false },
    { icon: ClipboardCheck, label: 'Questionário', path: '/diagnostic', protected: false },
    { icon: Leaf, label: 'Ambiental', path: '/environmental', protected: true },
    { icon: Users, label: 'Social', path: '/social', protected: true },
    { icon: Gavel, label: 'Governança', path: '/governance', protected: true },
    { icon: BarChart3, label: 'Relatórios', path: '/reports', protected: false },
    { icon: Trophy, label: 'Ranking', path: '/ranking', protected: false },
  ];

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-72 glass-surface rounded-3xl flex flex-col z-50 shadow-2xl shadow-emerald-900/10">
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary text-slate-900 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <LeafyGreen size={28} />
        </div>
        <div>
          <h1 className="text-xl font-black leading-tight uppercase tracking-tighter text-slate-900 dark:text-white">GUIA ESG</h1>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary italic">Enterprise Hub</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isLocked = item.protected && !isDiagnosticCompleted;
          
          return (
            <NavLink
              key={item.path}
              to={isLocked ? '#' : item.path}
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault();
                }
              }}
              className={({ isActive }) => `
                flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-black uppercase text-[10px] tracking-[0.2em]
                ${isActive && !isLocked
                  ? 'bg-primary text-slate-900 shadow-xl shadow-emerald-500/20 translate-x-1' 
                  : isLocked 
                    ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-40'
                    : 'text-slate-500 hover:bg-emerald-500/10 hover:text-primary'}
              `}
            >
              {isLocked ? <Lock size={18} /> : <item.icon size={18} />}
              <span>{item.label}</span>
              {isLocked && (
                <span className="ml-auto text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-bold uppercase tracking-widest">
                  Lock
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <Button variant="outline" className="w-full gap-3 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] border-2 border-slate-100 dark:border-slate-800">
          <Download size={18} />
          <span>Exportar</span>
        </Button>
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 hover:bg-rose-500/10 hover:text-rose-500"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};
