import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { type Mission } from '../../types';
import { CheckCircle2, Clock, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { collection, query, where, orderBy, limit, getDocs, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';

type PillarFilter = 'all' | 'E' | 'S' | 'G';
type MissionStatus = 'concluido' | 'em_curso' | 'pendente';

const PILLAR_CONFIG = {
  all: { label: 'Todas', color: 'bg-slate-900 text-white' },
  E: { label: 'Ambiental', color: 'bg-emerald-500 text-white' },
  S: { label: 'Social', color: 'bg-amber-500 text-white' },
  G: { label: 'Governança', color: 'bg-blue-500 text-white' },
};

const statusConfig: Record<MissionStatus, { label: string; color: string; icon: React.ElementType }> = {
  concluido: { label: 'Concluído', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle2 },
  em_curso: { label: 'Em Curso', color: 'bg-blue-100 text-blue-600', icon: Clock },
  pendente: { label: 'Pendente', color: 'bg-amber-100 text-amber-600', icon: AlertCircle },
};

const typeIconStyles = {
  E: 'bg-emerald-100 text-emerald-600',
  S: 'bg-amber-100 text-amber-600',
  G: 'bg-blue-100 text-blue-600',
};

const MISSIONS_PER_PAGE = 5;

export const RecentMissions: React.FC = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([]);
  const [selectedPillar, setSelectedPillar] = useState<PillarFilter>('all');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [counts, setCounts] = useState({ all: 0, E: 0, S: 0, G: 0 });

  // Fetch missions on mount
  useEffect(() => {
    const fetchMissions = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
        if (userDoc.empty) return;
        
        const companyId = userDoc.docs[0].data().companyId;
        
        const missionsQuery = query(
          collection(db, 'missions'),
          where('companyId', '==', companyId),
          orderBy('deadline', 'asc'),
          limit(MISSIONS_PER_PAGE)
        );
        
        const snapshot = await getDocs(missionsQuery);
        const missionsList = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as Mission));
        
        setMissions(missionsList);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === MISSIONS_PER_PAGE);
        
        // Count missions per pillar
        const countQuery = query(
          collection(db, 'missions'),
          where('companyId', '==', companyId)
        );
        const countSnapshot = await getDocs(countQuery);
        const allMissions = countSnapshot.docs.map(doc => doc.data() as Mission);
        
        setCounts({
          all: allMissions.length,
          E: allMissions.filter(m => m.type === 'E').length,
          S: allMissions.filter(m => m.type === 'S').length,
          G: allMissions.filter(m => m.type === 'G').length,
        });
      } catch (err) {
        console.error("Error fetching missions:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMissions();
  }, [user]);

  // Filter missions when pillar changes
  useEffect(() => {
    if (selectedPillar === 'all') {
      setFilteredMissions(missions);
    } else {
      setFilteredMissions(missions.filter(m => m.type === selectedPillar));
    }
  }, [missions, selectedPillar]);

  const loadMore = async () => {
    if (!user || !lastDoc || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
      if (userDoc.empty) return;
      
      const companyId = userDoc.docs[0].data().companyId;
      
      const missionsQuery = query(
        collection(db, 'missions'),
        where('companyId', '==', companyId),
        orderBy('deadline', 'asc'),
        startAfter(lastDoc),
        limit(MISSIONS_PER_PAGE)
      );
      
      const snapshot = await getDocs(missionsQuery);
      const newMissions = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Mission));
      
      setMissions(prev => [...prev, ...newMissions]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === MISSIONS_PER_PAGE);
    } catch (err) {
      console.error("Error loading more missions:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const getPillarButtonClass = (pillar: PillarFilter) => {
    const baseClass = "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2";
    if (selectedPillar === pillar) {
      return `${baseClass} ${PILLAR_CONFIG[pillar].color} shadow-lg`;
    }
    return `${baseClass} text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800`;
  };

  if (loading) {
    return (
      <Card title="Missões Recentes">
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title="Missões Recentes" 
      headerAction={
        <Link to="/missions">
          <button className="text-sm text-primary font-bold hover:underline">
            Ver Todas
          </button>
        </Link>
      }
    >
      {/* Pillar Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {(Object.keys(PILLAR_CONFIG) as PillarFilter[]).map((pillar) => (
          <button
            key={pillar}
            onClick={() => setSelectedPillar(pillar)}
            className={getPillarButtonClass(pillar)}
          >
            {PILLAR_CONFIG[pillar].label}
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
              {counts[pillar]}
            </span>
          </button>
        ))}
      </div>

      {/* Missions Table */}
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
            {filteredMissions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-slate-100 font-bold mb-1">
                        Nenhuma missão encontrada
                      </p>
                      <p className="text-slate-500 text-sm mb-4">
                        {selectedPillar === 'all' 
                          ? 'Inicie um novo diagnóstico para gerar missões!' 
                          : `Não há missões de ${PILLAR_CONFIG[selectedPillar].label.toLowerCase()} no momento.`}
                      </p>
                    </div>
                    <Link to="/diagnostico">
                      <Button size="sm" className="flex items-center gap-2">
                        <Plus size={16} />
                        Iniciar Diagnóstico
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              filteredMissions.map((mission) => {
                const status = statusConfig[mission.status];
                return (
                  <tr 
                    key={mission.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${typeIconStyles[mission.type]}`}>
                          {mission.type}
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {mission.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-1 w-fit ${status.color}`}>
                        <status.icon size={12} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                      {mission.leader}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {mission.deadline}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Load More Button */}
      {hasMore && selectedPillar === 'all' && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Carregando...
              </>
            ) : (
              'Carregar Mais'
            )}
          </button>
        </div>
      )}
    </Card>
  );
};

export default RecentMissions;
