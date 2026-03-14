import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCompanyData, useCompanyGoals, useEvolutionChart } from '../useCompanyData';

// Mock useAuth
vi.mock('@/context/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Import mocks from setup
import { mockGetDoc } from '@/test/setup';
import { useAuth } from '@/context/useAuth';

describe('useCompanyData', () => {
  const mockUser = { uid: 'user123' };
  const mockCompanyId = 'company456';
  const mockCompany = {
    id: mockCompanyId,
    name: 'Test Company',
    esgScore: { environmental: 75, social: 80, governance: 85, total: 80 },
    currentXP: 1500,
    level: 3,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset useAuth mock
    (useAuth as any).mockReturnValue({ user: mockUser });
    
    // Mock getDoc for user document
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
          data: () => mockCompany,
          id: mockCompanyId,
        });
      }
      return Promise.resolve({ exists: () => false });
    });
  });

  it('should return loading state initially', () => {
    (useAuth as any).mockReturnValue({ user: null });
    
    const { result } = renderHook(() => useCompanyData());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.company).toBeNull();
  });

  it('should fetch company data successfully', async () => {
    const { result } = renderHook(() => useCompanyData());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.company).toEqual(expect.objectContaining({
      id: mockCompanyId,
      name: 'Test Company',
    }));
    expect(result.current.error).toBeNull();
  });

  it('should handle error when fetching company fails', async () => {
    mockGetDoc.mockRejectedValue(new Error('Network error'));
    
    const { result } = renderHook(() => useCompanyData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');
  });

  it('should return null when user document does not exist', async () => {
    mockGetDoc.mockImplementation((docRef: any) => {
      if (docRef.path?.includes('users')) {
        return Promise.resolve({
          exists: () => false,
          data: () => null,
        });
      }
      return Promise.resolve({ exists: () => false });
    });
    
    const { result } = renderHook(() => useCompanyData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.company).toBeNull();
  });

  it('should not fetch data when user is null', () => {
    (useAuth as any).mockReturnValue({ user: null });
    
    const { result } = renderHook(() => useCompanyData());
    
    expect(result.current.loading).toBe(false);
    expect(mockGetDoc).not.toHaveBeenCalled();
  });
});

describe('useCompanyGoals', () => {
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
            id: mockCompanyId,
            goals: {
              energia: 80,
              residuos: 60,
              diversidade: 90,
              etica: 85,
            },
          }),
          id: mockCompanyId,
        });
      }
      return Promise.resolve({ exists: () => false });
    });
  });

  it('should return goals data from company', async () => {
    const { result } = renderHook(() => useCompanyGoals());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.goalsData).toEqual([
      { name: 'Energia', 'Atingido': 80 },
      { name: 'Resíduos', 'Atingido': 60 },
      { name: 'Diversid.', 'Atingido': 90 },
      { name: 'Ética', 'Atingido': 85 },
    ]);
  });

  it('should return default goals when company has no goals', async () => {
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
    
    const { result } = renderHook(() => useCompanyGoals());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.goalsData).toEqual([
      { name: 'Energia', 'Atingido': 0 },
      { name: 'Resíduos', 'Atingido': 0 },
      { name: 'Diversid.', 'Atingido': 0 },
      { name: 'Ética', 'Atingido': 0 },
    ]);
  });
});

describe('useEvolutionChart', () => {
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
            id: mockCompanyId,
            evolutionData: [
              { month: 'Jan', average: 70, environmental: 65, social: 72, governance: 73 },
              { month: 'Feb', average: 72, environmental: 68, social: 73, governance: 75 },
            ],
          }),
          id: mockCompanyId,
        });
      }
      return Promise.resolve({ exists: () => false });
    });
  });

  it('should format chart data correctly', async () => {
    const { result } = renderHook(() => useEvolutionChart());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.chartData).toEqual([
      { date: 'Jan', 'Eficiência': 70, 'Ambiental': 65, 'Social': 72, 'Governança': 73 },
      { date: 'Feb', 'Eficiência': 72, 'Ambiental': 68, 'Social': 73, 'Governança': 75 },
    ]);
  });

  it('should return empty array when no evolution data exists', async () => {
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
    
    const { result } = renderHook(() => useEvolutionChart());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.chartData).toEqual([]);
  });
});
