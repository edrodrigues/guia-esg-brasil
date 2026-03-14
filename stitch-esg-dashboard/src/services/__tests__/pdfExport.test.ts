import { describe, it, expect, vi, beforeEach } from 'vitest';

// Simple mock for jsPDF
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    setFillColor: vi.fn(),
    rect: vi.fn(),
    setTextColor: vi.fn(),
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    text: vi.fn(),
    internal: {
      pageSize: {
        height: 297,
        width: 210,
      },
    },
    addImage: vi.fn(),
    addPage: vi.fn(),
    save: vi.fn(),
  })),
}));

// Mock jspdf-autotable
vi.mock('jspdf-autotable', () => ({
  default: vi.fn(),
}));

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: () => 'data:image/png;base64,mockImageData',
    height: 1000,
    width: 800,
  }),
}));

import { generateESGReportPDF, downloadESGReport, generateReportFromElement } from '../pdfExport';
import autoTable from 'jspdf-autotable';

describe('pdfExport', () => {
  const mockCompany = {
    id: 'company1',
    name: 'Test Company',
    esgScores: {
      environmental: 75,
      social: 80,
      governance: 85,
      total: 80,
    },
    currentXP: 1500,
    level: 3,
  };

  const mockReportData = {
    company: mockCompany,
    totalCarbon: 1000,
    renewableEnergy: '60%',
    wasteDiverted: '75%',
    escopo1: 300,
    escopo2: 400,
    escopo3: 300,
    regionalComparison: {
      region: 'Sudeste',
      companyScore: 80,
      regionalAverage: 72,
    },
    sectorComparison: {
      industry: 'Technology',
      companyScore: 80,
      sectorAverage: 75,
      percentile: 85,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateESGReportPDF', () => {
    it('should generate PDF with basic data', () => {
      const doc = generateESGReportPDF(mockReportData);

      expect(doc).toBeDefined();
      expect(doc.text).toHaveBeenCalledWith('RELATÓRIO ESG', 20, 20);
    });

    it('should include company name in header', () => {
      const doc = generateESGReportPDF(mockReportData);

      expect(doc.text).toHaveBeenCalledWith('Test Company', 20, 30);
    });

    it('should include ESG scores table', () => {
      generateESGReportPDF(mockReportData);

      expect(autoTable).toHaveBeenCalled();
    });

    it('should handle missing regional comparison', () => {
      const dataWithoutRegional = {
        ...mockReportData,
        regionalComparison: undefined,
      };

      const doc = generateESGReportPDF(dataWithoutRegional);

      expect(doc).toBeDefined();
    });

    it('should handle company without name', () => {
      const dataWithoutName = {
        ...mockReportData,
        company: { ...mockCompany, name: undefined },
      };

      const doc = generateESGReportPDF(dataWithoutName as any);

      expect(doc.text).toHaveBeenCalledWith('Empresa', 20, 30);
    });

    it('should include footer with copyright', () => {
      const doc = generateESGReportPDF(mockReportData);

      expect(doc.text).toHaveBeenCalledWith(
        '© 2026 Stitch ESG Dashboard - Relatório gerado automaticamente',
        20,
        expect.any(Number)
      );
    });
  });

  describe('downloadESGReport', () => {
    it('should generate and save PDF', () => {
      downloadESGReport(mockReportData);
    });

    it('should sanitize company name for filename', () => {
      const dataWithSpecialChars = {
        ...mockReportData,
        company: { ...mockCompany, name: 'Test & Company Ltd.' },
      };

      downloadESGReport(dataWithSpecialChars);
    });
  });

  describe('generateReportFromElement', () => {
    beforeEach(() => {
      document.getElementById = vi.fn();
    });

    it('should return early if element not found', async () => {
      (document.getElementById as any).mockReturnValue(null);
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      await generateReportFromElement('nonexistent', 'report');
      
      expect(consoleSpy).toHaveBeenCalledWith('Element with id nonexistent not found');
      
      consoleSpy.mockRestore();
    });

    it('should handle html2canvas errors', async () => {
      const mockElement = document.createElement('div');
      (document.getElementById as any).mockReturnValue(mockElement);

      const html2canvas = await import('html2canvas');
      (html2canvas.default as any).mockRejectedValue(new Error('Canvas error'));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      await generateReportFromElement('reportElement', 'my-report');

      expect(alertSpy).toHaveBeenCalledWith('Erro ao gerar PDF. Tente novamente.');

      consoleSpy.mockRestore();
      alertSpy.mockRestore();
    });
  });
});
