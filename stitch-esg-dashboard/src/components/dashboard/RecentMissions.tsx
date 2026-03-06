import React from 'react';
import { Card } from '../ui/Card';
import { Mission } from '../../types';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface RecentMissionsProps {
  missions: Mission[];
  loading?: boolean;
}

const statusConfig = {
  concluido: { label: 'Concluído', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle2 },
  em_curso: { label: 'Em Curso', color: 'bg-blue-100 text-blue-600', icon: Clock },
  pendente: { label: 'Pendente', color: 'bg-amber-100 text-amber-600', icon: AlertCircle },
};

const typeIconStyles = {
  E: 'bg-emerald-100 text-emerald-600',
  S: 'bg-amber-100 text-amber-600',
  G: 'bg-blue-100 text-blue-600',
};

export const RecentMissions: React.FC<RecentMissionsProps> = ({ missions, loading }) => {
  return (
    <Card title="Missões Recentes" headerAction={<button className="text-sm text-primary font-bold hover:underline">Ver Todas</button>}>
      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Missão</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Líder</th>
              <th className="px-6 py-4">Prazo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {missions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">
                  Nenhuma missão encontrada. Inicie um novo diagnóstico para gerar missões!
                </td>
              </tr>
            ) : (
              missions.map((mission) => {
                const status = statusConfig[mission.status];
                return (
                  <tr key={mission.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${typeIconStyles[mission.type]}`}>
                          {mission.type}
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{mission.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-1 w-fit ${status.color}`}>
                        <status.icon size={12} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">{mission.leader}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{mission.deadline}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
