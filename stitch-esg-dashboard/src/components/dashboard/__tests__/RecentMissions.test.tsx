import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { RecentMissions } from '../RecentMissions';
import { renderWithProviders } from '@/test/test-utils';

// Mock hooks
vi.mock('@/hooks/useMissions', () => ({
  useMissions: vi.fn(),
}));

import { useMissions } from '@/hooks/useMissions';

describe('RecentMissions', () => {
  const mockMissions = [
    {
      id: 'mission1',
      title: 'Reduzir emissões de carbono',
      description: 'Implementar medidas para reduzir emissões',
      type: 'E',
      deadline: new Date('2024-12-31'),
      completed: false,
      xpReward: 100,
    },
    {
      id: 'mission2',
      title: 'Treinamento de diversidade',
      description: 'Capacitar equipe em diversidade e inclusão',
      type: 'S',
      deadline: new Date('2024-11-30'),
      completed: true,
      xpReward: 150,
    },
    {
      id: 'mission3',
      title: 'Atualizar políticas de compliance',
      description: 'Revisar e atualizar documentação',
      type: 'G',
      deadline: new Date('2024-12-15'),
      completed: false,
      xpReward: 200,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component title', () => {
    (useMissions as any).mockReturnValue({
      missions: mockMissions,
      loading: false,
      error: null,
    });

    renderWithProviders(<RecentMissions />);
    
    expect(screen.getByText('Missões Recentes')).toBeInTheDocument();
  });

  it('should render pillar filter buttons', () => {
    (useMissions as any).mockReturnValue({
      missions: mockMissions,
      loading: false,
      error: null,
    });

    renderWithProviders(<RecentMissions />);
    
    expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'E' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'S' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'G' })).toBeInTheDocument();
  });
});
