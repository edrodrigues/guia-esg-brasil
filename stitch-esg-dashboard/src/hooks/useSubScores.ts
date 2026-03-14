import { useMemo } from 'react';
import type { ESGSubScores } from '../types';

export const DEFAULT_SUBSCORES: ESGSubScores = {
  sga: 0,
  energia: 0,
  agua: 0,
  residuos: 0,
  arClima: 0,
  materiaPrima: 0,
  cicloVida: 0,
  biodiversidade: 0,
  direitosHumanos: 0,
  praticasTrabalhistas: 0,
  saudeSeguranca: 0,
  treinamento: 0,
  diversidade: 0,
  comunidade: 0,
  culturaValores: 0,
  gestaoRiscos: 0,
  conformidade: 0,
  etica: 0,
  transparencia: 0,
};

export const ENVIRONMENTAL_SUBSCORES = [
  { key: 'sga', label: 'Sistema de Gestão Ambiental', shortLabel: 'SGA' },
  { key: 'energia', label: 'Energia', shortLabel: 'Energia' },
  { key: 'agua', label: 'Água e Efluentes', shortLabel: 'Água' },
  { key: 'residuos', label: 'Gestão de Resíduos', shortLabel: 'Resíduos' },
  { key: 'arClima', label: 'Ar e Clima (GEE)', shortLabel: 'GEE' },
  { key: 'materiaPrima', label: 'Matéria-Prima', shortLabel: 'Mat. Prima' },
  { key: 'cicloVida', label: 'Ciclo de Vida', shortLabel: 'Ciclo Vida' },
  { key: 'biodiversidade', label: 'Biodiversidade', shortLabel: 'Biodiversid.' },
];

export const SOCIAL_SUBSCORES = [
  { key: 'direitosHumanos', label: 'Direitos Humanos', shortLabel: 'DH' },
  { key: 'praticasTrabalhistas', label: 'Práticas Trabalhistas', shortLabel: 'Trabalho' },
  { key: 'saudeSeguranca', label: 'Saúde e Segurança', shortLabel: 'Saúde' },
  { key: 'treinamento', label: 'Treinamento', shortLabel: 'Treinamento' },
  { key: 'diversidade', label: 'Diversidade e Inclusão', shortLabel: 'Diversidade' },
  { key: 'comunidade', label: 'Comunidade', shortLabel: 'Comunidade' },
];

export const GOVERNANCE_SUBSCORES = [
  { key: 'culturaValores', label: 'Cultura e Valores', shortLabel: 'Cultura' },
  { key: 'gestaoRiscos', label: 'Gestão de Riscos', shortLabel: 'Riscos' },
  { key: 'conformidade', label: 'Conformidade', shortLabel: 'Compliance' },
  { key: 'etica', label: 'Ética', shortLabel: 'Ética' },
  { key: 'transparencia', label: 'Transparência', shortLabel: 'Transparência' },
];

export function useSubScores(subScores?: Partial<ESGSubScores>, pillar?: 'environmental' | 'social' | 'governance') {
  const defaultSubScores = useMemo(() => {
    switch (pillar) {
      case 'environmental':
        return ENVIRONMENTAL_SUBSCORES;
      case 'social':
        return SOCIAL_SUBSCORES;
      case 'governance':
        return GOVERNANCE_SUBSCORES;
      default:
        return [];
    }
  }, [pillar]);

  const subScoresWithDefaults = useMemo(() => {
    if (!subScores) return DEFAULT_SUBSCORES;
    return { ...DEFAULT_SUBSCORES, ...subScores };
  }, [subScores]);

  const scoresArray = useMemo(() => {
    return defaultSubScores.map(item => ({
      ...item,
      value: subScoresWithDefaults[item.key as keyof ESGSubScores] || 0,
    }));
  }, [defaultSubScores, subScoresWithDefaults]);

  const averageScore = useMemo(() => {
    if (scoresArray.length === 0) return 0;
    const sum = scoresArray.reduce((acc, item) => acc + item.value, 0);
    return Math.round(sum / scoresArray.length);
  }, [scoresArray]);

  return {
    subScores: subScoresWithDefaults,
    scoresArray,
    averageScore,
    defaultSubScores,
  };
}

export function useEnvironmentalSubScores(environmentalSubScores?: Partial<ESGSubScores>) {
  return useSubScores(environmentalSubScores, 'environmental');
}

export function useSocialSubScores(socialSubScores?: Partial<ESGSubScores>) {
  return useSubScores(socialSubScores, 'social');
}

export function useGovernanceSubScores(governanceSubScores?: Partial<ESGSubScores>) {
  return useSubScores(governanceSubScores, 'governance');
}

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import { useState, useEffect } from 'react';

export function useSubScoresFromCompany() {
  const { user } = useAuth();
  const [environmentalSubScores, setEnvironmentalSubScores] = useState<Partial<ESGSubScores>>({});
  const [socialSubScores, setSocialSubScores] = useState<Partial<ESGSubScores>>({});
  const [governanceSubScores, setGovernanceSubScores] = useState<Partial<ESGSubScores>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSubScores = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          setLoading(false);
          return;
        }

        const companyId = userDoc.data().companyId;
        const companyDoc = await getDoc(doc(db, 'companies', companyId));
        
        if (companyDoc.exists()) {
          const data = companyDoc.data();
          setEnvironmentalSubScores(data.environmentalSubScores || {});
          setSocialSubScores(data.socialSubScores || {});
          setGovernanceSubScores(data.governanceSubScores || {});
        }
      } catch (err) {
        console.error('Error fetching sub scores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubScores();
  }, [user]);

  return {
    environmentalSubScores,
    socialSubScores,
    governanceSubScores,
    loading,
  };
}
