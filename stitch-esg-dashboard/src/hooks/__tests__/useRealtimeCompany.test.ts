import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useRealtimeCompany, useRealtimeESGScores } from '../useRealtimeCompany';
import { mockOnSnapshot, mockUpdateDoc, mockDoc } from '@/test/setup';

// Mock useAuth
vi.mock('@/context/useAuth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '@/context/useAuth';

describe('useRealtimeCompany', () => {
  const mockUser = { uid: 'user123' };
  const mockCompanyId = 'company456';
  const mockCompany = {
    id: mockCompanyId,
    name: 'Test Company',
    esgScores: { environmental: 75, social: 80, governance: 85, total: 80 },
    currentXP: 1500,
    level: 3,
  };

  let onSnapshotCallback: ((snapshot: any) => void) | null = null;
  let onSnapshotError: ((error: any) => void) | null = null;
  let unsubscribeMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    onSnapshotCallback = null;
    onSnapshotError = null;
    unsubscribeMock = vi.fn();
    
    (useAuth as any).mockReturnValue({ user: mockUser });
    
    // Mock global fetch
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('users')) {
        return Promise.resolve({
          json: () => Promise.resolve({ companyId: mockCompanyId }),
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve(null),
      });
    });

    // Mock onSnapshot to capture callbacks
    mockOnSnapshot.mockImplementation(
      (ref: any, onNext: any, onError: any) => {
        onSnapshotCallback = onNext;
        onSnapshotError = onError;
        return unsubscribeMock;
      }
    );

    // Mock doc
    mockDoc.mockReturnValue({ path: `companies/${mockCompanyId}` });
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useRealtimeCompany());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.company).toBeNull();
    expect(result.current.isOffline).toBe(false);
  });

  it('should not fetch when user is null', () => {
    (useAuth as any).mockReturnValue({ user: null });
    
    const { result } = renderHook(() => useRealtimeCompany());
    
    expect(result.current.loading).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should receive real-time updates', async () => {
    const { result } = renderHook(() => useRealtimeCompany());
    
    // Wait for initial setup
    await waitFor(() => {
      expect(onSnapshotCallback).toBeTruthy();
    });

    // Simulate snapshot update
    act(() => {
      onSnapshotCallback!({
        exists: () => true,
        id: mockCompanyId,
        data: () => mockCompany,
      });
    });

    await waitFor(() => {
      expect(result.current.company).toEqual(expect.objectContaining({
        id: mockCompanyId,
        name: 'Test Company',
      }));
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle offline error', async () => {
    const { result } = renderHook(() => useRealtimeCompany());
    
    await waitFor(() => {
      expect(onSnapshotError).toBeTruthy();
    });

    // Simulate offline error
    act(() => {
      onSnapshotError!({
        message: 'Client is offline',
        code: 'unavailable',
      });
    });

    await waitFor(() => {
      expect(result.current.isOffline).toBe(true);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle regular errors', async () => {
    const { result } = renderHook(() => useRealtimeCompany());
    
    await waitFor(() => {
      expect(onSnapshotError).toBeTruthy();
    });

    // Simulate regular error
    act(() => {
      onSnapshotError!(new Error('Database error'));
    });

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.isOffline).toBe(false);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should unsubscribe on unmount', async () => {
    const { unmount } = renderHook(() => useRealtimeCompany());
    
    await waitFor(() => {
      expect(onSnapshotCallback).toBeTruthy();
    });

    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it('should update company with optimistic updates', async () => {
    const { result } = renderHook(() => useRealtimeCompany());
    
    await waitFor(() => {
      expect(onSnapshotCallback).toBeTruthy();
    });

    // Set initial company
    act(() => {
      onSnapshotCallback!({
        exists: () => true,
        id: mockCompanyId,
        data: () => mockCompany,
      });
    });

    await waitFor(() => {
      expect(result.current.company).toBeTruthy();
    });

    mockUpdateDoc.mockResolvedValue(undefined);

    // Update company
    await act(async () => {
      await result.current.updateCompany({ name: 'Updated Company' });
    });

    // Optimistic update should be applied
    expect(result.current.company?.name).toBe('Updated Company');
    expect(mockUpdateDoc).toHaveBeenCalled();
  });

  it('should rollback on update error', async () => {
    const { result } = renderHook(() => useRealtimeCompany());
    
    await waitFor(() => {
      expect(onSnapshotCallback).toBeTruthy();
    });

    // Set initial company
    act(() => {
      onSnapshotCallback!({
        exists: () => true,
        id: mockCompanyId,
        data: () => mockCompany,
      });
    });

    await waitFor(() => {
      expect(result.current.company).toBeTruthy();
    });

    mockUpdateDoc.mockRejectedValue(new Error('Update failed'));

    // Update should throw
    await expect(
      result.current.updateCompany({ name: 'Updated Company' })
    ).rejects.toThrow('Update failed');

    // Should rollback to previous state
    expect(result.current.company?.name).toBe('Test Company');
  });
});

describe('useRealtimeESGScores', () => {
  const mockUser = { uid: 'user123' };
  const mockCompanyId = 'company456';
  const mockCompany = {
    id: mockCompanyId,
    name: 'Test Company',
    esgScores: { environmental: 75, social: 80, governance: 85, total: 80 },
  };

  let onSnapshotCallback: ((snapshot: any) => void) | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useAuth as any).mockReturnValue({ user: mockUser });
    
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('users')) {
        return Promise.resolve({
          json: () => Promise.resolve({ companyId: mockCompanyId }),
        });
      }
      return Promise.resolve({ json: () => Promise.resolve(null) });
    });

    mockOnSnapshot.mockImplementation(
      (ref: any, onNext: any) => {
        onSnapshotCallback = onNext;
        return vi.fn();
      }
    );

    mockDoc.mockReturnValue({ path: `companies/${mockCompanyId}` });
  });

  it('should expose esgScores from company', async () => {
    const { result } = renderHook(() => useRealtimeESGScores());
    
    await waitFor(() => {
      expect(onSnapshotCallback).toBeTruthy();
    });

    act(() => {
      onSnapshotCallback!({
        exists: () => true,
        id: mockCompanyId,
        data: () => mockCompany,
      });
    });

    await waitFor(() => {
      expect(result.current.esgScores).toEqual({
        environmental: 75,
        social: 80,
        governance: 85,
        total: 80,
      });
    });
  });

  it('should update specific ESG score', async () => {
    const { result } = renderHook(() => useRealtimeESGScores());
    
    await waitFor(() => {
      expect(onSnapshotCallback).toBeTruthy();
    });

    act(() => {
      onSnapshotCallback!({
        exists: () => true,
        id: mockCompanyId,
        data: () => mockCompany,
      });
    });

    await waitFor(() => {
      expect(result.current.esgScores).toBeTruthy();
    });

    mockUpdateDoc.mockResolvedValue(undefined);

    await act(async () => {
      await result.current.updateESGScore('environmental', 90);
    });

    expect(mockUpdateDoc).toHaveBeenCalled();
  });
});
