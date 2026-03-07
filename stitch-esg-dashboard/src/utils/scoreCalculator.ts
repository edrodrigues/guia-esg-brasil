import type { CompanyGoals, ESGDelta, ESGScore } from '../types';

export const calculateESGScore = (
  formData: Record<string, number | string>,
  environmentalData?: Record<string, number | string>,
  socialData?: Record<string, number | string>,
  governanceData?: Record<string, number | string>
): ESGScore => {
  let environmentalScore = 0;
  let socialScore = 0;
  let governanceScore = 0;

  const formKeys = Object.keys(formData);
  
  formKeys.forEach(key => {
    const value = formData[key];
    if (typeof value === 'number') {
      const maxScore = 10;
      const normalizedScore = Math.min((value / maxScore) * 100, 100);
      
      if (key.includes('environmental') || key.startsWith('E')) {
        environmentalScore += normalizedScore;
      } else if (key.includes('social') || key.startsWith('S')) {
        socialScore += normalizedScore;
      } else if (key.includes('governance') || key.startsWith('G')) {
        governanceScore += normalizedScore;
      }
    }
  });

  if (environmentalData) {
    Object.values(environmentalData).forEach(value => {
      if (typeof value === 'number') {
        environmentalScore += Math.min(value, 100);
      }
    });
  }

  if (socialData) {
    Object.values(socialData).forEach(value => {
      if (typeof value === 'number') {
        socialScore += Math.min(value, 100);
      }
    });
  }

  if (governanceData) {
    Object.values(governanceData).forEach(value => {
      if (typeof value === 'number') {
        governanceScore += Math.min(value, 100);
      }
    });
  }

  return {
    environmental: Math.round(environmentalScore || 0),
    social: Math.round(socialScore || 0),
    governance: Math.round(governanceScore || 0),
  };
};

export const calculateESGDelta = (
  currentScores: ESGScore,
  previousScores?: ESGScore
): ESGDelta => {
  if (!previousScores) {
    return {
      environmental: 0,
      social: 0,
      governance: 0,
    };
  }

  const calculateDelta = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    const delta = ((current - previous) / previous) * 100;
    return Math.round(delta * 10) / 10;
  };

  return {
    environmental: calculateDelta(currentScores.environmental, previousScores.environmental),
    social: calculateDelta(currentScores.social, previousScores.social),
    governance: calculateDelta(currentScores.governance, previousScores.governance),
  };
};

export const calculateGoalsFromScores = (
  environmentalScore: number,
  socialScore: number,
  governanceScore: number
): CompanyGoals => {
  return {
    energia: Math.min(Math.round(environmentalScore * 0.9), 100),
    residuos: Math.min(Math.round(environmentalScore * 0.7), 100),
    diversidade: Math.min(Math.round(socialScore * 0.85), 100),
    etica: Math.min(Math.round(governanceScore * 0.95), 100),
  };
};

export const getGoalsDataForChart = (goals?: CompanyGoals) => {
  if (!goals) {
    return [
      { name: 'Energia', 'Atingido': 0 },
      { name: 'Resíduos', 'Atingido': 0 },
      { name: 'Diversid.', 'Atingido': 0 },
      { name: 'Ética', 'Atingido': 0 },
    ];
  }

  return [
    { name: 'Energia', 'Atingido': goals.energia },
    { name: 'Resíduos', 'Atingido': goals.residuos },
    { name: 'Diversid.', 'Atingido': goals.diversidade },
    { name: 'Ética', 'Atingido': goals.etica },
  ];
};

export const getDeltaType = (delta: number): 'increase' | 'moderateIncrease' | 'decrease' | 'moderateDecrease' | 'unchanged' => {
  if (delta > 5) return 'increase';
  if (delta > 0) return 'moderateIncrease';
  if (delta < -5) return 'decrease';
  if (delta < 0) return 'moderateDecrease';
  return 'unchanged';
};

export const formatDelta = (delta: number): string => {
  if (delta > 0) return `+${delta.toFixed(1)}%`;
  if (delta < 0) return `${delta.toFixed(1)}%`;
  return '0%';
};
