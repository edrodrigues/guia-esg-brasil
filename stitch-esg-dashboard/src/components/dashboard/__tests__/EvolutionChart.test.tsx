import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { EvolutionChart } from '../EvolutionChart';
import { renderWithProviders } from '@/test/test-utils';

// Mock hooks
vi.mock('@/hooks/useCompanyData', () => ({
  useEvolutionChart: vi.fn(),
}));

import { useEvolutionChart } from '@/hooks/useCompanyData';

describe('EvolutionChart', () => {
  const mockChartData = [
    { date: 'Jan', 'Eficiência': 70, 'Ambiental': 65, 'Social': 72, 'Governança': 73 },
    { date: 'Feb', 'Eficiência': 72, 'Ambiental': 68, 'Social': 73, 'Governança': 75 },
    { date: 'Mar', 'Eficiência': 75, 'Ambiental': 70, 'Social': 75, 'Governança': 76 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component', () => {
    (useEvolutionChart as any).mockReturnValue({
      chartData: mockChartData,
      loading: false,
      error: null,
    });

    renderWithProviders(<EvolutionChart />);
    
    expect(screen.getByText('Evolução da Jornada')).toBeInTheDocument();
  });

  it('should render pillar filter buttons', () => {
    (useEvolutionChart as any).mockReturnValue({
      chartData: mockChartData,
      loading: false,
      error: null,
    });

    renderWithProviders(<EvolutionChart />);
    
    expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ambiental' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Social' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Governança' })).toBeInTheDocument();
  });

  it('should render time range selector', () => {
    (useEvolutionChart as any).mockReturnValue({
      chartData: mockChartData,
      loading: false,
      error: null,
    });

    renderWithProviders(<EvolutionChart />);
    
    // Should have select dropdown for time range
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should display empty state when no data', () => {
    (useEvolutionChart as any).mockReturnValue({
      chartData: [],
      loading: false,
      error: null,
    });

    renderWithProviders(<EvolutionChart />);
    
    expect(screen.getByText('Nenhum dado de evolução disponível')).toBeInTheDocument();
  });
});
