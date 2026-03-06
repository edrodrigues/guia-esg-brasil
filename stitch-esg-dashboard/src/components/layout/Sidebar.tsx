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
  Lock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/useAuth';

export const Sidebar: React.FC = () => {
  const { signOut, isDiagnosticCompleted } = useAuth();
  const navItems = [
    { icon: LayoutDashboard, label: 'Início', path: '/dashboard', protected: false },
    { icon: ClipboardCheck, label: 'Diagnóstico', path: '/diagnostic', protected: false },
    { icon: Leaf, label: 'Ambiental', path: '/environmental', protected: true },
    { icon: Users, label: 'Social', path: '/social', protected: true },
    { icon: Gavel, label: 'Governança', path: '/governance', protected: true },
    { icon: BarChart3, label: 'Relatórios', path: '/reports', protected: false },
  ];

  return (
    <aside className="w-72 bg-slate-900 dark:bg-nav-dark border-r-4 border-primary/20 flex flex-col fixed h-full z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-slate-900 chunky-shadow">
          <LeafyGreen size={24} />
        </div>
        <div>
          <h1 className="text-lg font-black leading-tight uppercase tracking-tighter text-white">GUIA ESG</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Painel de Herói</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
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
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black uppercase text-xs tracking-widest
                ${isActive && !isLocked
                  ? 'bg-primary text-slate-900 chunky-shadow translate-x-1' 
                  : isLocked 
                    ? 'text-slate-600 cursor-not-allowed opacity-50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              {isLocked ? <Lock size={18} /> : <item.icon size={18} />}
              <span>{item.label}</span>
              {isLocked && (
                <span className="ml-auto text-[8px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-700">
                  Bloqueado
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Button variant="chunky" className="w-full gap-2">
          <Download size={18} />
          <span>Exportar Dados</span>
        </Button>
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black uppercase text-xs tracking-widest text-slate-400 hover:bg-rose-500/10 hover:text-rose-500"
        >
          <LogOut size={18} />
          <span>Sair da Conta</span>
        </button>
      </div>
    </aside>
  );
};
