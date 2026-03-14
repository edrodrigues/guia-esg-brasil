import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { 
  useMissions, 
  useRecentMissions, 
  useEnvironmentalMissions, 
  useSocialMissions, 
  useGovernanceMissions 
} from '../useMissions';
import { mockGetDoc, mockGetDocs, mockLimit, mockWhere, mockQuery } from '@/test/setup';

// Mock useAuth
vi.mock('@/context/useAuth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '@/context/useAuth';

describe('useMissions', () => {
  const mockUser = { uid: 'user123' };
  const mockCompanyId = 'company456';
  const mockMissions = [
    {
      id: 'mission1',
      title: 'Reduzir emissões',
      type: 'E',
      companyId: mockCompanyId,
      deadline: new Date('2024-12-31'),
      completed: false,
    },
    {
      id: 'mission2',
      title: 'Treinamento diversidade',
      type: 'S',
      companyId: mockCompanyId,
      deadline: new Date('2024-11-30'),
      completed: true,
    },
    {
      id: 'mission3',
      title: 'Atualizar compliance',
      type: 'G',
      companyId: mockCompanyId,
      deadline: new Date('2024-12-15'),
      completed: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useAuth as any).mockReturnValue({ user: mockUser });
    
    // Mock getDoc for user document
    mockGetDoc.mockImplementation((docRef: any) => {
      if (docRef.path?.includes('users')) {
        return Promise.resolve({
          exists: () => true,
          data: () => ({ companyId: mockCompanyId }),
        });
      }
      return Promise.resolve({ exists: () => false });
    });
    
    // Mock getDocs for missions query
    mockGetDocs.mockImplementation(() => {
      return Promise.resolve({
        docs: mockMissions.map(mission => ({
          id: mission.id,
          data: () => mission,
        })),
      });
    });
  });

  it('should fetch all missions when no pillar specified', async () => {
    const { result } = renderHook(() => useMissions());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.missions).toHaveLength(3);
    expect(result.current.error).toBeNull();
  });

  it('should fetch missions filtered by pillar', async () => {
    mockGetDocs.mockImplementation(() => {
      return Promise.resolve({
        docs: mockMissions
          .filter(m => m.type === 'E')
          .map(mission => ({
            id: mission.id,
            data: () => mission,
          })),
      });
    });
    
    const { result } = renderHook(() => useMissions('E'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.missions).toHaveLength(1);
    expect(result.current.missions[0].type).toBe('E');
  });

  it('should limit results correctly', async () => {
    const { result } = renderHook(() => useMissions(undefined, 2));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Verify limit was called with correct value
    expect(mockLimit).toHaveBeenCalledWith(2);
  });

  it('should handle errors gracefully', async () => {
    mockGetDocs.mockRejectedValue(new Error('Database error'));
    
    const { result } = renderHook(() => useMissions());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.missions).toEqual([]);
  });

  it('should not fetch when user is null', () => {
    (useAuth as any).mockReturnValue({ user: null });
    
    const { result } = renderHook(() => useMissions());
    
    expect(result.current.loading).toBe(false);
    expect(mockGetDoc).not.toHaveBeenCalled();
  });
});

describe('useRecentMissions', () => {
  const mockUser = { uid: 'user123' };

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useAuth as any).mockReturnValue({ user: mockUser });
    
    mockGetDoc.mockImplementation((docRef: any) => {
      if (docRef.path?.includes('users')) {
        return Promise.resolve({
          exists: () => true,
          data: () => ({ companyId: 'company456' }),
        });
      }
      return Promise.resolve({ exists: () => false });
    });
    
    mockGetDocs.mockImplementation(() => {
      return Promise.resolve({ docs: [] });
    });
  });

  it('should use default limit of 5', async () => {
    renderHook(() => useRecentMissions());
    
    await waitFor(() => {
      expect(mockLimit).toHaveBeenCalledWith(5);
    });
  });

  it('should accept custom limit', async () => {
    renderHook(() => useRecentMissions(10));
    
    await waitFor(() => {
      expect(mockLimit).toHaveBeenCalledWith(10);
    });
  });
});

describe('Pillar-specific hooks', () => {
  const mockUser = { uid: 'user123' };

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useAuth as any).mockReturnValue({ user: mockUser });
    
    mockGetDoc.mockImplementation((docRef: any) => {
      if (docRef.path?.includes('users')) {
        return Promise.resolve({
          exists: () => true,
          data: () => ({ companyId: 'company456' }),
        });
      }
      return Promise.resolve({ exists: () => false });
    });
    
    mockGetDocs.mockImplementation(() => {
      return Promise.resolve({ docs: [] });
    });
  });

  it('useEnvironmentalMissions should filter by E pillar', async () => {
    renderHook(() => useEnvironmentalMissions());
    
    await waitFor(() => {
      expect(mockWhere).toHaveBeenCalledWith('type', '==', 'E');
    });
  });

  it('useSocialMissions should filter by S pillar', async () => {
    renderHook(() => useSocialMissions());
    
    await waitFor(() => {
      expect(mockWhere).toHaveBeenCalledWith('type', '==', 'S');
    });
  });

  it('useGovernanceMissions should filter by G pillar', async () => {
    renderHook(() => useGovernanceMissions());
    
    await waitFor(() => {
      expect(mockWhere).toHaveBeenCalledWith('type', '==', 'G');
    });
  });
});
