import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useSubScores,
  useEnvironmentalSubScores,
  useSocialSubScores,
  useGovernanceSubScores,
  useSubScoresFromCompany,
  DEFAULT_SUBSCORES,
  ENVIRONMENTAL_SUBSCORES,
  SOCIAL_SUBSCORES,
  GOVERNANCE_SUBSCORES,
} from '../useSubScores';
import { mockGetDoc } from '@/test/setup';

// Mock useAuth
vi.mock('@/context/useAuth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '@/context/useAuth';

describe('useSubScores', () => {
  it('should return default scores when no subScores provided', () => {
    const { result } = renderHook(() => useSubScores());
    
    expect(result.current.subScores).toEqual(DEFAULT_SUBSCORES);
  });

  it('should merge provided subScores with defaults', () => {
    const partialScores = { sga: 85, energia: 70 };
    const { result } = renderHook(() => useSubScores(partialScores));
    
    expect(result.current.subScores.sga).toBe(85);
    expect(result.current.subScores.energia).toBe(70);
    expect(result.current.subScores.agua).toBe(0); // Default value
  });

  it('should return correct defaultSubScores for environmental pillar', () => {
    const { result } = renderHook(() => useSubScores(undefined, 'environmental'));
    
    expect(result.current.defaultSubScores).toEqual(ENVIRONMENTAL_SUBSCORES);
    expect(result.current.defaultSubScores).toHaveLength(8);
  });

  it('should return correct defaultSubScores for social pillar', () => {
    const { result } = renderHook(() => useSubScores(undefined, 'social'));
    
    expect(result.current.defaultSubScores).toEqual(SOCIAL_SUBSCORES);
    expect(result.current.defaultSubScores).toHaveLength(6);
  });

  it('should return correct defaultSubScores for governance pillar', () => {
    const { result } = renderHook(() => useSubScores(undefined, 'governance'));
    
    expect(result.current.defaultSubScores).toEqual(GOVERNANCE_SUBSCORES);
    expect(result.current.defaultSubScores).toHaveLength(5);
  });

  it('should calculate average score correctly', () => {
    const scores = {
      sga: 80,
      energia: 90,
      agua: 70,
    };
    const { result } = renderHook(() => useSubScores(scores, 'environmental'));
    
    // Average of 8 items, with 3 having values 80, 90, 70
    const expectedAverage = Math.round((80 + 90 + 70 + 0 + 0 + 0 + 0 + 0) / 8);
    expect(result.current.averageScore).toBe(expectedAverage);
  });

  it('should return 0 average when no pillar specified', () => {
    const { result } = renderHook(() => useSubScores());
    
    expect(result.current.averageScore).toBe(0);
  });

  it('should format scoresArray correctly', () => {
    const scores = { sga: 85, energia: 75 };
    const { result } = renderHook(() => useSubScores(scores, 'environmental'));
    
    const sgaScore = result.current.scoresArray.find(s => s.key === 'sga');
    expect(sgaScore?.value).toBe(85);
    expect(sgaScore?.label).toBe('Sistema de Gestão Ambiental');
  });
});

describe('useEnvironmentalSubScores', () => {
  it('should automatically use environmental pillar', () => {
    const scores = { sga: 90, energia: 85 };
    const { result } = renderHook(() => useEnvironmentalSubScores(scores));
    
    expect(result.current.defaultSubScores).toEqual(ENVIRONMENTAL_SUBSCORES);
    expect(result.current.scoresArray).toHaveLength(8);
  });
});

describe('useSocialSubScores', () => {
  it('should automatically use social pillar', () => {
    const scores = { direitosHumanos: 95, diversidade: 88 };
    const { result } = renderHook(() => useSocialSubScores(scores));
    
    expect(result.current.defaultSubScores).toEqual(SOCIAL_SUBSCORES);
    expect(result.current.scoresArray).toHaveLength(6);
  });
});

describe('useGovernanceSubScores', () => {
  it('should automatically use governance pillar', () => {
    const scores = { etica: 92, transparencia: 87 };
    const { result } = renderHook(() => useGovernanceSubScores(scores));
    
    expect(result.current.defaultSubScores).toEqual(GOVERNANCE_SUBSCORES);
    expect(result.current.scoresArray).toHaveLength(5);
  });
});

describe('useSubScoresFromCompany', () => {
  const mockUser = { uid: 'user123' };
  const mockCompanyId = 'company456';

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useAuth as any).mockReturnValue({ user: mockUser });
    
    mockGetDoc.mockImplementation((docRef: any) => {
      if (docRef.path?.includes('users')) {
        return Promise.resolve({
          exists: () => true,
          data: () => ({ companyId: mockCompanyId }),
        });
      }
      if (docRef.path?.includes('companies')) {
        return Promise.resolve({
          exists: () => true,
          data: () => ({
            environmentalSubScores: { sga: 80, energia: 75 },
            socialSubScores: { direitosHumanos: 90, diversidade: 85 },
            governanceSubScores: { etica: 88, transparencia: 82 },
          }),
          id: mockCompanyId,
        });
      }
      return Promise.resolve({ exists: () => false });
    });
  });

  it('should fetch sub scores from company', async () => {
    const { result } = renderHook(() => useSubScoresFromCompany());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.environmentalSubScores).toEqual({ sga: 80, energia: 75 });
    expect(result.current.socialSubScores).toEqual({ direitosHumanos: 90, diversidade: 85 });
    expect(result.current.governanceSubScores).toEqual({ etica: 88, transparencia: 82 });
  });

  it('should return empty objects when company has no sub scores', async () => {
    mockGetDoc.mockImplementation((docRef: any) => {
      if (docRef.path?.includes('users')) {
        return Promise.resolve({
          exists: () => true,
          data: () => ({ companyId: mockCompanyId }),
        });
      }
      if (docRef.path?.includes('companies')) {
        return Promise.resolve({
          exists: () => true,
          data: () => ({ id: mockCompanyId }),
          id: mockCompanyId,
        });
      }
      return Promise.resolve({ exists: () => false });
    });
    
    const { result } = renderHook(() => useSubScoresFromCompany());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.environmentalSubScores).toEqual({});
    expect(result.current.socialSubScores).toEqual({});
    expect(result.current.governanceSubScores).toEqual({});
  });

  it('should handle errors gracefully', async () => {
    mockGetDoc.mockRejectedValue(new Error('Database error'));
    
    const { result } = renderHook(() => useSubScoresFromCompany());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.environmentalSubScores).toEqual({});
  });

  it('should not fetch when user is null', () => {
    (useAuth as any).mockReturnValue({ user: null });
    
    const { result } = renderHook(() => useSubScoresFromCompany());
    
    expect(result.current.loading).toBe(false);
    expect(mockGetDoc).not.toHaveBeenCalled();
  });
});
