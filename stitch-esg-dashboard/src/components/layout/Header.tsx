import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm"
            placeholder="Buscar conquistas ou dados..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <Bell size={20} className="text-slate-600 dark:text-slate-400" />
        </button>
        <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <Settings size={20} className="text-slate-600 dark:text-slate-400" />
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
        
        <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Usuário Mestre</p>
            <p className="text-xs text-slate-500">Gerente de Impacto</p>
          </div>
          <div 
            className="w-10 h-10 rounded-full bg-slate-200 bg-cover bg-center border-2 border-primary/20"
            style={{ backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')` }}
          />
        </Link>
      </div>
    </header>
  );
};
