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
  LeafyGreen
} from 'lucide-react';
import { Button } from '../ui/Button';

export const Sidebar: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Início', path: '/dashboard' },
    { icon: ClipboardCheck, label: 'Diagnóstico', path: '/diagnostic' },
    { icon: Leaf, label: 'Ambiental', path: '/environmental' },
    { icon: Users, label: 'Social', path: '/social' },
    { icon: Gavel, label: 'Governança', path: '/governance' },
    { icon: BarChart3, label: 'Relatórios', path: '/reports' },
  ];

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-slate-900">
          <LeafyGreen size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight uppercase tracking-wider text-slate-900 dark:text-slate-100">GUIA ESG</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Painel de Controle</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium
              ${isActive 
                ? 'bg-primary/10 text-primary font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}
            `}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <Button className="w-full gap-2">
          <Download size={18} />
          <span>Exportar Dados</span>
        </Button>
      </div>
    </aside>
  );
};
