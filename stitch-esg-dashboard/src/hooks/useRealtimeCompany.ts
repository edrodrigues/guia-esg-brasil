import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import type { Company, ESGScore } from '../types';

interface UseRealtimeCompanyReturn {
  company: Company | null;
  loading: boolean;
  error: Error | null;
  updateCompany: (updates: Partial<Company>) => Promise<void>;
  isOffline: boolean;
}

export function useRealtimeCompany(): UseRealtimeCompanyReturn {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const setupRealtimeListener = async () => {
      try {
        // Get user document to find companyId
        const userDoc = await fetch(`${db.app.options.databaseURL}/users/${user.uid}.json`).then(r => r.json());
        
        if (!userDoc?.companyId) {
          setLoading(false);
          return;
        }

        const companyId = userDoc.companyId;
        const companyRef = doc(db, 'companies', companyId);

        // Set up real-time listener
        unsubscribe = onSnapshot(
          companyRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const companyData = { id: snapshot.id, ...snapshot.data() } as Company;
              setCompany(companyData);
              setIsOffline(false);
            }
            setLoading(false);
          },
          (err) => {
            console.error('Error in real-time company listener:', err);
            
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
        console.error('Error setting up company listener:', err);
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
  }, [user]);

  // Update company with optimistic updates
  const updateCompany = useCallback(async (updates: Partial<Company>) => {
    if (!company) return;

    // Optimistic update
    const previousCompany = { ...company };
    setCompany({ ...company, ...updates });

    try {
      await updateDoc(doc(db, 'companies', company.id), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      // Rollback on error
      setCompany(previousCompany);
      console.error('Error updating company:', err);
      throw err;
    }
  }, [company]);

  return { company, loading, error, updateCompany, isOffline };
}

// Helper hook for updating specific ESG scores
export function useRealtimeESGScores() {
  const { company, updateCompany, isOffline } = useRealtimeCompany();

  const updateESGScore = useCallback(async (
    pillar: 'environmental' | 'social' | 'governance',
    score: number
  ) => {
    if (!company) return;

    const newScores: ESGScore = {
      ...company.esgScores,
      [pillar]: score,
    };

    await updateCompany({ esgScores: newScores });
  }, [company, updateCompany]);

  return {
    esgScores: company?.esgScores,
    updateESGScore,
    isOffline,
  };
}

export default useRealtimeCompany;
