import React, { useEffect, useState } from 'react';
import { Trophy, Star } from 'lucide-react';
import { Button } from '../ui/Button';

export interface Particle {
  id: number;
  left: string;
  top: string;
  delay: string;
}

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  levelName: string;
  particles?: Particle[];
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, onClose, level, levelName, particles = [] }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Async update to avoid lint warning
      const t = setTimeout(() => setActive(false), 0);
      return () => clearTimeout(t);
    }

    const startTimer = setTimeout(() => {
      setActive(true);
    }, 50);

    const endTimer = setTimeout(() => {
      setActive(false);
    }, 3050);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden chunky-card animate-in zoom-in-95 duration-300">
        
        {/* Background Rays */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
           <div className="w-[500px] h-[500px] bg-primary rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Confetti Particles (Simplified CSS representation) */}
        {active && (
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
             {particles.map((p) => (
               <div 
                 key={p.id}
                 className="absolute w-2 h-2 bg-primary rounded-full animate-ping"
                 style={{
                   left: p.left,
                   top: p.top,
                   animationDelay: p.delay,
                   animationDuration: '1s'
                 }}
               />
             ))}
           </div>
        )}
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-primary rounded-2xl rotate-3 flex items-center justify-center chunky-shadow z-10 relative">
              <Trophy size={48} className="text-slate-900" strokeWidth={3} />
            </div>
            <div className="absolute top-0 left-0 w-24 h-24 bg-secondary rounded-2xl -rotate-6 opacity-50 z-0"></div>
          </div>
          
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter italic">Level Up!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-bold text-sm">A empresa evoluiu para o nível</p>
          
          <div className="bg-slate-50 dark:bg-slate-800 py-4 px-8 rounded-2xl mb-8 border-2 border-slate-200 dark:border-slate-700 w-full transform hover:scale-105 transition-transform">
            <p className="text-2xl font-black text-primary uppercase tracking-widest">{levelName}</p>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(level)].map((_, i) => (
                <Star key={i} size={16} className="fill-secondary text-secondary" />
              ))}
            </div>
          </div>
          
          <Button onClick={onClose} variant="chunky" className="w-full h-12 text-lg">
            RESGATAR RECOMPENSAS
          </Button>
        </div>
      </div>
    </div>
  );
};
