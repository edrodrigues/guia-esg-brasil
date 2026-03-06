import React from 'react';
import { Search, Bell, Settings, User, Building2, LogOut, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  
  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm font-medium outline-none transition-all"
            placeholder="Buscar conquistas ou dados..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative group">
          <Bell size={20} className="text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
        
        {/* Profile Dropdown Container */}
        <div className="relative group py-2">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">{user?.displayName || 'Mestre ESG'}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-70">Gerente de Impacto</p>
            </div>
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full bg-slate-200 bg-cover bg-center border-2 border-primary/20 shadow-lg shadow-emerald-500/10 group-hover:border-primary transition-all duration-300"
                style={{ backgroundImage: `url('${user?.photoURL ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'Felix'}`}')` }}
              />
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 border border-slate-200 dark:border-slate-800">
                <ChevronDown size={10} className="text-slate-400 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>

          {/* Dropdown Menu (Emerald Glass) */}
          <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl shadow-emerald-900/10 overflow-hidden p-2">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sua Conta</p>
              </div>
              
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-500/10 text-slate-600 dark:text-slate-400 hover:text-primary transition-all group/item">
                <User size={18} className="group-hover/item:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">Meu Perfil</span>
              </Link>
              
              <Link to="/organization" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-500/10 text-slate-600 dark:text-slate-400 hover:text-primary transition-all group/item">
                <Building2 size={18} className="group-hover/item:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">Minha Organização</span>
              </Link>
              
              <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-500/10 text-slate-600 dark:text-slate-400 hover:text-primary transition-all group/item">
                <Settings size={18} className="group-hover/item:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">Configurações</span>
              </Link>
              
              <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1 mx-2"></div>
              
              <button 
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all group/item"
              >
                <LogOut size={18} className="group-hover/item:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">Sair da Conta</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
