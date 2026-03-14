import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getRegionFromState,
  getRegionalAverages,
  calculateRegionalAverages,
  getSectorComparison,
  calculateCarbonTrend,
  getIndustryBenchmarks,
  DEFAULT_BENCHMARKS,
} from '../regionalData';
import * as firebaseFirestore from 'firebase/firestore';

describe('regionalData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRegionFromState', () => {
    it('should return correct region for Sudeste states', () => {
      expect(getRegionFromState('SP')).toBe('Sudeste');
      expect(getRegionFromState('RJ')).toBe('Sudeste');
      expect(getRegionFromState('MG')).toBe('Sudeste');
      expect(getRegionFromState('ES')).toBe('Sudeste');
    });

    it('should return correct region for Sul states', () => {
      expect(getRegionFromState('PR')).toBe('Sul');
      expect(getRegionFromState('SC')).toBe('Sul');
      expect(getRegionFromState('RS')).toBe('Sul');
    });

    it('should return correct region for Centro-Oeste states', () => {
      expect(getRegionFromState('MS')).toBe('Centro-Oeste');
      expect(getRegionFromState('MT')).toBe('Centro-Oeste');
      expect(getRegionFromState('GO')).toBe('Centro-Oeste');
      expect(getRegionFromState('DF')).toBe('Centro-Oeste');
    });

    it('should return correct region for Norte states', () => {
      expect(getRegionFromState('AM')).toBe('Norte');
      expect(getRegionFromState('PA')).toBe('Norte');
      expect(getRegionFromState('AC')).toBe('Norte');
    });

    it('should return correct region for Nordeste states', () => {
      expect(getRegionFromState('BA')).toBe('Nordeste');
      expect(getRegionFromState('PE')).toBe('Nordeste');
      expect(getRegionFromState('CE')).toBe('Nordeste');
    });

    it('should return "Outros" for unknown states', () => {
      expect(getRegionFromState('XX')).toBe('Outros');
      expect(getRegionFromState('')).toBe('Outros');
    });

    it('should be case insensitive', () => {
      expect(getRegionFromState('sp')).toBe('Sudeste');
      expect(getRegionFromState('Sp')).toBe('Sudeste');
      expect(getRegionFromState('sP')).toBe('Sudeste');
    });
  });

  describe('getRegionalAverages', () => {
    const mockRegionalAverages = {
      region: 'Sudeste',
      avgEnvironmental: 72,
      avgSocial: 68,
      avgGovernance: 75,
      avgTotal: 72,
      totalCompanies: 45,
      updatedAt: new Date(),
    };

    it('should return cached regional averages if available', async () => {
      (firebaseFirestore.getDoc as any).mockResolvedValue({
        exists: () => true,
        data: () => mockRegionalAverages,
      });

      const result = await getRegionalAverages('Sudeste');

      expect(result).toEqual(mockRegionalAverages);
      expect(firebaseFirestore.getDoc).toHaveBeenCalled();
    });

    it('should calculate averages if not cached', async () => {
      (firebaseFirestore.getDoc as any).mockResolvedValue({
        exists: () => false,
      });

      const mockCompanies = [
        { esgScores: { environmental: 70, social: 65, governance: 72 } },
        { esgScores: { environmental: 75, social: 70, governance: 78 } },
      ];

      (firebaseFirestore.getDocs as any).mockResolvedValue({
        docs: mockCompanies.map((c, i) => ({
          id: `company${i}`,
          data: () => c,
        })),
      });

      const result = await getRegionalAverages('Sudeste');

      expect(result).not.toBeNull();
      expect(result?.region).toBe('Sudeste');
      expect(result?.totalCompanies).toBe(2);
    });

    it('should handle errors gracefully', async () => {
      (firebaseFirestore.getDoc as any).mockRejectedValue(new Error('Database error'));

      const result = await getRegionalAverages('Sudeste');

      expect(result).toBeNull();
    });
  });

  describe('calculateRegionalAverages', () => {
    it('should calculate averages correctly', async () => {
      const mockCompanies = [
        { esgScores: { environmental: 70, social: 65, governance: 72 } },
        { esgScores: { environmental: 80, social: 70, governance: 78 } },
        { esgScores: { environmental: 60, social: 75, governance: 80 } },
      ];

      (firebaseFirestore.getDocs as any).mockResolvedValue({
        docs: mockCompanies.map((c, i) => ({
          id: `company${i}`,
          data: () => c,
        })),
      });

      const result = await calculateRegionalAverages('Sudeste');

      expect(result).not.toBeNull();
      expect(result?.avgEnvironmental).toBe(70); // Round((70+80+60)/3)
      expect(result?.avgSocial).toBe(70); // Round((65+70+75)/3)
      expect(result?.avgGovernance).toBe(77); // Round((72+78+80)/3)
      expect(result?.avgTotal).toBe(72); // Round((70+70+77)/3)
      expect(result?.totalCompanies).toBe(3);
    });

    it('should return null for empty region', async () => {
      (firebaseFirestore.getDocs as any).mockResolvedValue({
        docs: [],
      });

      const result = await calculateRegionalAverages('Sudeste');

      expect(result).toBeNull();
    });

    it('should handle companies with missing scores', async () => {
      const mockCompanies = [
        { esgScores: { environmental: 70, social: 65, governance: 72 } },
        { esgScores: {} }, // Missing scores
        { esgScores: { environmental: 60 } }, // Partial scores
      ];

      (firebaseFirestore.getDocs as any).mockResolvedValue({
        docs: mockCompanies.map((c, i) => ({
          id: `company${i}`,
          data: () => c,
        })),
      });

      const result = await calculateRegionalAverages('Sudeste');

      expect(result).not.toBeNull();
      expect(result?.avgEnvironmental).toBe(43); // Round((70+0+60)/3)
    });
  });

  describe('getSectorComparison', () => {
    const mockCompany = {
      id: 'company1',
      industry: 'Technology',
      esgScores: { environmental: 80, social: 75, governance: 85 },
    };

    it('should return null if company has no industry', async () => {
      const companyWithoutIndustry = { ...mockCompany, industry: undefined };
      const result = await getSectorComparison(companyWithoutIndustry as any);
      expect(result).toBeNull();
    });

    it('should calculate sector comparison correctly', async () => {
      const mockCompanies = [
        { id: 'company3', esgScores: { environmental: 90, social: 80, governance: 88 } },
        { id: 'company1', esgScores: { environmental: 80, social: 75, governance: 85 } },
        { id: 'company2', esgScores: { environmental: 70, social: 65, governance: 75 } },
      ];

      (firebaseFirestore.getDocs as any).mockResolvedValue({
        docs: mockCompanies.map(c => ({
          id: c.id,
          data: () => c,
        })),
      });

      const result = await getSectorComparison(mockCompany as any);

      expect(result).not.toBeNull();
      expect(result?.industry).toBe('Technology');
      expect(result?.companyRank).toBe(2); // Second best environmental score (90, 80, 70)
      expect(result?.totalCompanies).toBe(3);
      expect(result?.percentile).toBe(33); // ((3-2)/3)*100 = 33
    });

    it('should return last rank if company not found', async () => {
      const mockCompanies = [
        { id: 'company2', esgScores: { environmental: 70 } },
        { id: 'company3', esgScores: { environmental: 90 } },
      ];

      (firebaseFirestore.getDocs as any).mockResolvedValue({
        docs: mockCompanies.map(c => ({
          id: c.id,
          data: () => c,
        })),
      });

      const result = await getSectorComparison(mockCompany as any);

      expect(result?.companyRank).toBe(2);
    });
  });

  describe('calculateCarbonTrend', () => {
    it('should generate carbon data for 8 months', () => {
      const result = calculateCarbonTrend(100);

      expect(result).toHaveLength(8);
      expect(result[0]).toHaveProperty('month');
      expect(result[0]).toHaveProperty('year');
      expect(result[0]).toHaveProperty('companyValue');
      expect(result[0]).toHaveProperty('sectorAverage');
      expect(result[0]).toHaveProperty('regionalAverage');
    });

    it('should return minimum value (0.1) when currentCarbon is 0', () => {
      const result = calculateCarbonTrend(0);

      // When currentCarbon is 0, the function still returns 0.1 due to Math.max(0.1, ...)
      result.forEach(monthData => {
        expect(monthData.companyValue).toBe(0.1);
      });
    });

    it('should have sector average higher than company value', () => {
      const result = calculateCarbonTrend(100);

      result.forEach(monthData => {
        expect(monthData.sectorAverage).toBeGreaterThan(monthData.companyValue);
      });
    });

    it('should have regional average between company and sector', () => {
      const result = calculateCarbonTrend(100);

      result.forEach(monthData => {
        expect(monthData.regionalAverage).toBeGreaterThan(monthData.companyValue);
        expect(monthData.regionalAverage).toBeLessThan(monthData.sectorAverage);
      });
    });
  });

  describe('getIndustryBenchmarks', () => {
    it('should calculate industry averages correctly', async () => {
      const mockCompanies = [
        { industry: 'Technology', esgScores: { environmental: 80, social: 75, governance: 85 } },
        { industry: 'Technology', esgScores: { environmental: 70, social: 65, governance: 75 } },
        { industry: 'Healthcare', esgScores: { environmental: 60, social: 80, governance: 70 } },
      ];

      (firebaseFirestore.getDocs as any).mockResolvedValue({
        docs: mockCompanies.map((c, i) => ({
          id: `company${i}`,
          data: () => c,
        })),
      });

      const result = await getIndustryBenchmarks();

      expect(result).toHaveProperty('Technology');
      expect(result).toHaveProperty('Healthcare');
      // Technology: (80+70)/2 + (75+65)/2 + (85+75)/2 = 75 + 70 + 80 = 225 / 3 = 75
      expect(result['Technology']).toBe(75);
      // Healthcare: (60 + 80 + 70) / 3 = 70
      expect(result['Healthcare']).toBe(70);
    });

    it('should handle companies without industry', async () => {
      const mockCompanies = [
        { industry: 'Technology', esgScores: { environmental: 80 } },
        { esgScores: { environmental: 70 } }, // No industry
      ];

      (firebaseFirestore.getDocs as any).mockResolvedValue({
        docs: mockCompanies.map((c, i) => ({
          id: `company${i}`,
          data: () => c,
        })),
      });

      const result = await getIndustryBenchmarks();

      expect(result).toHaveProperty('Technology');
      expect(Object.keys(result)).toHaveLength(1);
    });

    it('should return empty object on error', async () => {
      (firebaseFirestore.getDocs as any).mockRejectedValue(new Error('Database error'));

      const result = await getIndustryBenchmarks();

      expect(result).toEqual({});
    });
  });

  describe('DEFAULT_BENCHMARKS', () => {
    it('should have expected benchmark values', () => {
      expect(DEFAULT_BENCHMARKS.environmental).toBe(65);
      expect(DEFAULT_BENCHMARKS.social).toBe(58);
      expect(DEFAULT_BENCHMARKS.governance).toBe(72);
      expect(DEFAULT_BENCHMARKS.total).toBe(65);
    });
  });
});
