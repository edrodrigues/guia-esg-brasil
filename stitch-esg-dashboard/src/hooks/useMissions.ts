import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit as firestoreLimit, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import type { Mission } from '../types';

export function useMissions(pillar?: 'E' | 'S' | 'G', maxResults = 5, subscribe = false) {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return () => {};
    }

    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const fetchMissions = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          setLoading(false);
          return;
        }

        const companyId = userDoc.data().companyId;

        const constraints = [
          where('companyId', '==', companyId),
          orderBy('deadline', 'asc'),
          firestoreLimit(maxResults)
        ];

        if (pillar) {
          constraints.splice(1, 0, where('type', '==', pillar));
        }

        const missionsQuery = query(collection(db, 'missions'), ...constraints);

        if (subscribe) {
          unsubscribe = onSnapshot(
            missionsQuery,
            (snapshot) => {
              if (isMounted) {
                const missionsList = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                } as Mission));
                setMissions(missionsList);
              }
            },
            (err) => {
              if (isMounted) setError(err instanceof Error ? err : new Error(String(err)));
            }
          );
        } else {
          const snapshot = await getDocs(missionsQuery);
          if (isMounted) {
            const missionsList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as Mission));
            setMissions(missionsList);
          }
        }
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMissions();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [user, pillar, maxResults, subscribe]);

  return { missions, loading, error };
}

export function useRecentMissions(maxResults = 5) {
  return useMissions(undefined, maxResults, false);
}

export function useEnvironmentalMissions(maxResults = 5) {
  return useMissions('E', maxResults, false);
}

export function useSocialMissions(maxResults = 5) {
  return useMissions('S', maxResults, false);
}

export function useGovernanceMissions(maxResults = 5) {
  return useMissions('G', maxResults, false);
}

import { doc, getDoc } from 'firebase/firestore';
