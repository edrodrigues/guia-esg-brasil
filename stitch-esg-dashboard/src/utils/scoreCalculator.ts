import type { CompanyGoals, ESGDelta, ESGScore, Question } from '../types';

export const calculateESGScore = (
  formData: Record<string, number | string>,
  questions?: Question[]
): ESGScore => {
  let environmentalScore = 0;
  let socialScore = 0;
  let governanceScore = 0;

  let totalWeightE = 0;
  let totalWeightS = 0;
  let totalWeightG = 0;

  const formKeys = Object.keys(formData);
  
  formKeys.forEach(key => {
    const value = formData[key];
    const question = questions?.find(q => q.id === key);

    if (question && question.options) {
      const processOption = (val: number | string) => {
        const selectedOption = question.options?.find(opt => opt.value === val);
        if (selectedOption && selectedOption.points !== undefined) {
          const points = selectedOption.points;
          const weight = selectedOption.weight || 1;

          if (question.category === 'environmental') {
            environmentalScore += points * weight;
            totalWeightE += weight;
          } else if (question.category === 'social') {
            socialScore += points * weight;
            totalWeightS += weight;
          } else if (question.category === 'governance') {
            governanceScore += points * weight;
            totalWeightG += weight;
          }
        }
      };

      if (Array.isArray(value)) {
        value.forEach(val => processOption(val));
      } else {
        processOption(value);
      }
    } else if (typeof value === 'number') {
      // Fallback for cases where questions are not provided
      const maxScore = 5;
      const normalizedScore = (value / maxScore) * 100;
      
      if (key.includes('environmental') || key.startsWith('environmental')) {
        environmentalScore += normalizedScore;
        totalWeightE += 1;
      } else if (key.includes('social') || key.startsWith('social')) {
        socialScore += normalizedScore;
        totalWeightS += 1;
      } else if (key.includes('governance') || key.startsWith('governance')) {
        governanceScore += normalizedScore;
        totalWeightG += 1;
      }
    }
  });

  // Calculate percentages (0-100) based on total weights
  // Assuming max points is 5 per question as per common ESG diagnostic pattern
  const normalize = (score: number, totalWeight: number) => {
    if (totalWeight === 0) return 0;
    return Math.min(Math.round((score / (totalWeight * 5)) * 100), 100);
  };

  return {
    environmental: normalize(environmentalScore, totalWeightE),
    social: normalize(socialScore, totalWeightS),
    governance: normalize(governanceScore, totalWeightG),
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
