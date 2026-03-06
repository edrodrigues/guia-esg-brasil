import React from 'react';
import { Trophy, Star, Shield, Zap, Crown, Lock } from 'lucide-react';
import { Card } from '../ui/Card';

interface HeroJourneyProps {
  currentXP: number;
}

const LEVELS = [
  { level: 1, name: 'Elementar', minXP: 0, icon: Shield, color: 'text-slate-500', bg: 'bg-slate-100' },
  { level: 2, name: 'Consciente', minXP: 1000, icon: Star, color: 'text-cyan-500', bg: 'bg-cyan-100' },
  { level: 3, name: 'Engajado', minXP: 2000, icon: Zap, color: 'text-blue-500', bg: 'bg-blue-100' },
  { level: 4, name: 'Proativo', minXP: 3000, icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-100' },
  { level: 5, name: 'Transformador', minXP: 4000, icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-100' },
];

export const HeroJourney: React.FC<HeroJourneyProps> = ({ currentXP }) => {
  const currentLevelIndex = LEVELS.findIndex((l, i) => 
    currentXP >= l.minXP && (i === LEVELS.length - 1 || currentXP < LEVELS[i + 1].minXP)
  );
  
  const currentLevel = LEVELS[currentLevelIndex];
  const nextLevel = LEVELS[currentLevelIndex + 1];

  return (
    <Card variant="chunky" className="mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Current Status */}
        <div className="flex items-center gap-4 min-w-[200px]">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center chunky-shadow ${currentLevel.bg} ${currentLevel.color}`}>
            <currentLevel.icon size={32} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Nível Atual</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{currentLevel.name}</h3>
            <p className="text-sm font-bold text-primary">{currentXP} XP</p>
          </div>
        </div>

        {/* Journey Progress */}
        <div className="flex-1 w-full relative pt-6 pb-2">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full -translate-y-1/2 overflow-hidden border border-slate-200 dark:border-slate-700">
             {/* Active Progress */}
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-out relative"
              style={{ width: `${(currentXP / 4000) * 100}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 animate-pulse"></div>
            </div>
          </div>

          {/* Steps */}
          <div className="relative flex justify-between w-full">
            {LEVELS.map((level, index) => {
              const isUnlocked = currentXP >= level.minXP;
              const isCurrent = index === currentLevelIndex;
              
              return (
                <div key={level.level} className="flex flex-col items-center gap-2 group cursor-help relative">
                  <div className={`
                    w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all z-10
                    ${isUnlocked 
                      ? `bg-white dark:bg-slate-900 border-primary text-primary chunky-shadow shadow-primary/20` 
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'}
                    ${isCurrent ? 'scale-125 -translate-y-2' : ''}
                  `}
                  >
                    {isUnlocked ? (
                      <level.icon size={isCurrent ? 20 : 16} strokeWidth={3} />
                    ) : (
                      <Lock size={14} />
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className={`
                    absolute top-12 text-[10px] font-black uppercase tracking-tighter text-center w-24 transition-all
                    ${isCurrent ? 'text-slate-900 dark:text-slate-100 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'}
                  `}>
                    {level.name}
                    <span className="block text-[9px] opacity-60">{level.minXP} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Goal */}
        <div className="min-w-[120px] text-right hidden md:block">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Próximo Nível</p>
           {nextLevel ? (
             <>
               <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{nextLevel.name}</p>
               <p className="text-xs text-slate-500">Faltam {nextLevel.minXP - currentXP} XP</p>
             </>
           ) : (
             <p className="text-sm font-bold text-primary">Nível Máximo!</p>
           )}
        </div>

      </div>
    </Card>
  );
};
