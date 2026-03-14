import React, { useState, useMemo } from 'react';
import { AreaChart } from '@tremor/react';
import { Card } from '../ui/Card';
import type { EvolutionDataPoint } from '../../types';

type Pillar = 'all' | 'E' | 'S' | 'G';
type TimeRange = '6months' | 'all';

interface EvolutionChartProps {
  data: EvolutionDataPoint[];
  showBenchmark?: boolean;
  benchmarkData?: { value: number; label: string };
}

const PILLAR_COLORS = {
  all: ['emerald', 'amber', 'blue'],
  E: ['emerald'],
  S: ['amber'],
  G: ['blue'],
};

const PILLAR_LABELS = {
  all: 'Todos',
  E: 'Ambiental',
  S: 'Social',
  G: 'Governança',
};

export const EvolutionChart: React.FC<EvolutionChartProps> = ({ 
  data, 
  showBenchmark = false,
  benchmarkData 
}) => {
  const [selectedPillar, setSelectedPillar] = useState<Pillar>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('6months');

  // Filter data based on time range
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    if (timeRange === '6months') {
      return data.slice(-6);
    }
    return data;
  }, [data, timeRange]);

  // Prepare chart data based on selected pillar
  const chartData = useMemo(() => {
    return filteredData.map(point => {
      const baseData: Record<string, number | string> = {
        month: point.month,
      };

      if (selectedPillar === 'all') {
        baseData['Ambiental'] = point.environmental;
        baseData['Social'] = point.social;
        baseData['Governança'] = point.governance;
      } else if (selectedPillar === 'E') {
        baseData['Score'] = point.environmental;
      } else if (selectedPillar === 'S') {
        baseData['Score'] = point.social;
      } else if (selectedPillar === 'G') {
        baseData['Score'] = point.governance;
      }

      // Add benchmark line if enabled
      if (showBenchmark && benchmarkData) {
        baseData[benchmarkData.label] = benchmarkData.value;
      }

      return baseData;
    });
  }, [filteredData, selectedPillar, showBenchmark, benchmarkData]);

  // Determine categories based on pillar selection
  const categories = useMemo(() => {
    if (selectedPillar === 'all') {
      const cats = ['Ambiental', 'Social', 'Governança'];
      if (showBenchmark && benchmarkData) {
        cats.push(benchmarkData.label);
      }
      return cats;
    }
    const cats = ['Score'];
    if (showBenchmark && benchmarkData) {
      cats.push(benchmarkData.label);
    }
    return cats;
  }, [selectedPillar, showBenchmark, benchmarkData]);

  const valueFormatter = (number: number) => `${number}`;

  const getPillarButtonClass = (pillar: Pillar) => {
    const baseClass = "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all";
    if (selectedPillar === pillar) {
      switch (pillar) {
        case 'all':
          return `${baseClass} bg-slate-900 text-white shadow-lg`;
        case 'E':
          return `${baseClass} bg-emerald-500 text-white shadow-lg shadow-emerald-500/30`;
        case 'S':
          return `${baseClass} bg-amber-500 text-white shadow-lg shadow-amber-500/30`;
        case 'G':
          return `${baseClass} bg-blue-500 text-white shadow-lg shadow-blue-500/30`;
      }
    }
    return `${baseClass} text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white`;
  };

  return (
    <Card 
      title="Evolução da Jornada" 
      headerAction={
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-primary focus:ring-2 p-2 cursor-pointer outline-none"
        >
          <option value="6months">Últimos 6 Meses</option>
          <option value="all">Desde o Início</option>
        </select>
      }
    >
      {/* Pillar Tabs */}
      <div className="flex items-center gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
        {(Object.keys(PILLAR_LABELS) as Pillar[]).map((pillar) => (
          <button
            key={pillar}
            onClick={() => setSelectedPillar(pillar)}
            className={getPillarButtonClass(pillar)}
          >
            {PILLAR_LABELS[pillar]}
          </button>
        ))}
      </div>

      <div className="h-72">
        {chartData.length > 0 ? (
          <AreaChart
            className="h-full"
            data={chartData}
            index="month"
            categories={categories}
            colors={selectedPillar === 'all' ? PILLAR_COLORS[selectedPillar] : ['emerald']}
            valueFormatter={valueFormatter}
            yAxisWidth={40}
            showAnimation={true}
            showLegend={categories.length > 1}
            showGridLines={true}
            curveType="monotone"
            minValue={0}
            maxValue={100}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            <p className="text-sm font-medium">Nenhum dado de evolução disponível</p>
          </div>
        )}
      </div>

      {/* Legend for single pillar mode */}
      {selectedPillar !== 'all' && chartData.length > 0 && (
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {PILLAR_LABELS[selectedPillar]}
            </span>
          </div>
          {showBenchmark && benchmarkData && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-slate-400" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {benchmarkData.label}
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default EvolutionChart;
