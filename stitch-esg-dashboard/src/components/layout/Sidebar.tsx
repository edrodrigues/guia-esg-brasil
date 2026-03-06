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
  LogOut
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/useAuth';

export const Sidebar: React.FC = () => {
  const { signOut } = useAuth();
  const navItems = [
    { icon: LayoutDashboard, label: 'Início', path: '/dashboard' },
    { icon: ClipboardCheck, label: 'Diagnóstico', path: '/diagnostic' },
    { icon: Leaf, label: 'Ambiental', path: '/environmental' },
    { icon: Users, label: 'Social', path: '/social' },
    { icon: Gavel, label: 'Governança', path: '/governance' },
    { icon: BarChart3, label: 'Relatórios', path: '/reports' },
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
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black uppercase text-xs tracking-widest
              ${isActive 
                ? 'bg-primary text-slate-900 chunky-shadow translate-x-1' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
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
