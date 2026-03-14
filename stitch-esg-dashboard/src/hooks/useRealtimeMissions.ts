import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, QuerySnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import type { Mission } from '../types';

type PillarFilter = 'all' | 'E' | 'S' | 'G';

interface UseRealtimeMissionsReturn {
  missions: Mission[];
  loading: boolean;
  error: Error | null;
  isOffline: boolean;
  refetch: () => void;
}

export function useRealtimeMissions(
  pillarFilter: PillarFilter = 'all',
  maxResults: number = 10
): UseRealtimeMissionsReturn {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const setupRealtimeListener = async () => {
      try {
        // Get user document to find companyId
        const userResponse = await fetch(
          `${db.app.options.databaseURL}/users/${user.uid}.json`
        );
        const userDoc = await userResponse.json();

        if (!userDoc?.companyId) {
          setLoading(false);
          return;
        }

        const companyId = userDoc.companyId;

        // Build query based on filter
        let missionsQuery;
        if (pillarFilter === 'all') {
          missionsQuery = query(
            collection(db, 'missions'),
            where('companyId', '==', companyId),
            orderBy('deadline', 'asc'),
            limit(maxResults)
          );
        } else {
          missionsQuery = query(
            collection(db, 'missions'),
            where('companyId', '==', companyId),
            where('type', '==', pillarFilter),
            orderBy('deadline', 'asc'),
            limit(maxResults)
          );
        }

        // Set up real-time listener
        unsubscribe = onSnapshot(
          missionsQuery,
          (snapshot: QuerySnapshot<DocumentData>) => {
            const missionsList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Mission[];

            setMissions(missionsList);
            setIsOffline(false);
            setLoading(false);
          },
          (err) => {
            console.error('Error in real-time missions listener:', err);

            // Check if it's an offline error
            if (err.message?.includes('offline') || err.code === 'unavailable') {
              setIsOffline(true);
            } else {
              setError(err);
            }
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Error setting up missions listener:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    };

    setupRealtimeListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, pillarFilter, maxResults, refreshTrigger]);

  // Manual refresh function
  const refetch = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return { missions, loading, error, isOffline, refetch };
}

// Hook for a single mission
export function useRealtimeMission(missionId: string | null) {
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!missionId) {
      setLoading(false);
      return;
    }

    const missionRef = doc(db, 'missions', missionId);

    const unsubscribe = onSnapshot(
      missionRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setMission({ id: snapshot.id, ...snapshot.data() } as Mission);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error in mission listener:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [missionId]);

  return { mission, loading, error };
}

// Hook for mission counts
export function useRealtimeMissionCounts() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const setupListener = async () => {
      try {
        const userResponse = await fetch(
          `${db.app.options.databaseURL}/users/${user.uid}.json`
        );
        const userDoc = await userResponse.json();

        if (!userDoc?.companyId) {
          setLoading(false);
          return;
        }

        const companyId = userDoc.companyId;
        const missionsQuery = query(
          collection(db, 'missions'),
          where('companyId', '==', companyId)
        );

        unsubscribe = onSnapshot(missionsQuery, (snapshot) => {
          const missions = snapshot.docs.map((doc) => doc.data() as Mission);

          setCounts({
            total: missions.length,
            completed: missions.filter((m) => m.status === 'concluido').length,
            inProgress: missions.filter((m) => m.status === 'em_curso').length,
            pending: missions.filter((m) => m.status === 'pendente').length,
          });
          setLoading(false);
        });
      } catch (err) {
        console.error('Error setting up mission counts listener:', err);
        setLoading(false);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  return { counts, loading };
}

import { doc } from 'firebase/firestore';

export default useRealtimeMissions;
