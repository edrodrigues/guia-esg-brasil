import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import type { Company, ESGScore } from '../types';

export function useCompanyData(subscribe = false) {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return () => {};
    }

    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const fetchCompany = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          setLoading(false);
          return;
        }

        const companyId = userDoc.data().companyId;

        if (subscribe) {
          unsubscribe = onSnapshot(
            doc(db, 'companies', companyId),
            (snapshot) => {
              if (isMounted && snapshot.exists()) {
                setCompany({ id: snapshot.id, ...snapshot.data() } as Company);
              }
            },
            (err) => {
              if (isMounted) setError(err instanceof Error ? err : new Error(String(err)));
            }
          );
        } else {
          const companyDoc = await getDoc(doc(db, 'companies', companyId));
          if (isMounted && companyDoc.exists()) {
            setCompany({ id: companyDoc.id, ...companyDoc.data() } as Company);
          }
        }
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCompany();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [user, subscribe]);

  const updateCompanyScores = useCallback(async (scores: Partial<ESGScore>) => {
    if (!company) return;
    
    try {
      await updateDoc(doc(db, 'companies', company.id), {
        ...scores,
        updatedAt: new Date()
      });
    } catch (err) {
      console.error('Error updating company scores:', err);
      throw err;
    }
  }, [company]);

  const updateCompanyXP = useCallback(async (xpToAdd: number) => {
    if (!company) return;
    
    try {
      const newXP = company.currentXP + xpToAdd;
      await updateDoc(doc(db, 'companies', company.id), {
        currentXP: newXP,
        updatedAt: new Date()
      });
    } catch (err) {
      console.error('Error updating company XP:', err);
      throw err;
    }
  }, [company]);

  return { company, loading, error, updateCompanyScores, updateCompanyXP };
}

export function useCompanyGoals() {
  const { company, loading, error } = useCompanyData();
  
  const goalsData = company?.goals ? [
    { name: 'Energia', 'Atingido': company.goals.energia },
    { name: 'Resíduos', 'Atingido': company.goals.residuos },
    { name: 'Diversid.', 'Atingido': company.goals.diversidade },
    { name: 'Ética', 'Atingido': company.goals.etica },
  ] : [
    { name: 'Energia', 'Atingido': 0 },
    { name: 'Resíduos', 'Atingido': 0 },
    { name: 'Diversid.', 'Atingido': 0 },
    { name: 'Ética', 'Atingido': 0 },
  ];

  return { goalsData, loading, error };
}

export function useEvolutionChart() {
  const { company, loading, error } = useCompanyData();
  
  const chartData = company?.evolutionData?.map(point => ({
    date: point.month,
    'Eficiência': point.average,
    'Ambiental': point.environmental,
    'Social': point.social,
    'Governança': point.governance,
  })) || [];

  return { chartData, loading, error };
}
