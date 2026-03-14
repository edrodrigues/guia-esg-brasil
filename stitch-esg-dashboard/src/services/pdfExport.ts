import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Company } from '../types';

interface ReportData {
  company: Company;
  totalCarbon: number;
  renewableEnergy: string;
  wasteDiverted: string;
  escopo1: number;
  escopo2: number;
  escopo3: number;
  regionalComparison?: {
    region: string;
    companyScore: number;
    regionalAverage: number;
  };
  sectorComparison?: {
    industry: string;
    companyScore: number;
    sectorAverage: number;
    percentile: number;
  };
}

export function generateESGReportPDF(data: ReportData): jsPDF {
  const doc = new jsPDF();
  const { company, totalCarbon, renewableEnergy, wasteDiverted, escopo1, escopo2, escopo3 } = data;
  
  // Cores - usando formato que o jsPDF aceita
  const primaryColor: [number, number, number] = [16, 185, 129]; // emerald-500
  const darkColor: [number, number, number] = [30, 41, 59]; // slate-800
  const lightColor: [number, number, number] = [248, 250, 252]; // slate-50
  
  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO ESG', 20, 20);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(company.name || 'Empresa', 20, 30);
  
  // Data
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 36);
  
  // Seção de Scores ESG
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Scores ESG', 20, 55);
  
  // Tabela de Scores
  autoTable(doc, {
    startY: 60,
    head: [['Pilar', 'Score', 'Status']],
    body: [
      ['Ambiental (E)', `${company.esgScores.environmental}/100`, getScoreStatus(company.esgScores.environmental)],
      ['Social (S)', `${company.esgScores.social}/100`, getScoreStatus(company.esgScores.social)],
      ['Governança (G)', `${company.esgScores.governance}/100`, getScoreStatus(company.esgScores.governance)],
      ['Média Total', `${Math.round((company.esgScores.environmental + company.esgScores.social + company.esgScores.governance) / 3)}/100`, ''],
    ],
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: lightColor
    }
  });
  
  // Seção Ambiental
  let currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Indicadores Ambientais', 20, currentY);
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Indicador', 'Valor', 'Benchmark']],
    body: [
      ['Emissões CO2e (Total)', `${totalCarbon.toLocaleString('pt-BR')} t`, 'Média Setor: +15%'],
      ['Escopo 1 (Diretas)', `${escopo1} t`, ''],
      ['Escopo 2 (Energia)', `${escopo2} t`, ''],
      ['Escopo 3 (Cadeia)', `${escopo3} t`, ''],
      ['Energia Renovável', renewableEnergy, 'Meta 2025: 80%'],
      ['Resíduos Desviados', wasteDiverted, 'Meta 2025: 95%'],
    ],
    headStyles: {
      fillColor: darkColor,
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: lightColor
    }
  });
  
  // Comparação Regional
  if (data.regionalComparison) {
    currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Comparação Regional: ${data.regionalComparison.region}`, 20, currentY);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Métrica', 'Sua Empresa', 'Média Regional', 'Diferença']],
      body: [
        ['Score ESG', 
         data.regionalComparison.companyScore.toString(), 
         data.regionalComparison.regionalAverage.toString(),
         `${data.regionalComparison.companyScore - data.regionalComparison.regionalAverage > 0 ? '+' : ''}${data.regionalComparison.companyScore - data.regionalComparison.regionalAverage}`
        ],
      ],
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: lightColor
      }
    });
  }
  
  // Comparação Setorial
  if (data.sectorComparison) {
    currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Comparação Setorial: ${data.sectorComparison.industry}`, 20, currentY);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Métrica', 'Sua Empresa', 'Média do Setor', 'Percentil']],
      body: [
        ['Score ESG', 
         data.sectorComparison.companyScore.toString(), 
         data.sectorComparison.sectorAverage.toString(),
         `Top ${100 - data.sectorComparison.percentile}%`
        ],
      ],
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: lightColor
      }
    });
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('© 2026 Stitch ESG Dashboard - Relatório gerado automaticamente', 20, pageHeight - 10);
  
  return doc;
}

function getScoreStatus(score: number): string {
  if (score >= 80) return 'Excelente';
  if (score >= 60) return 'Bom';
  if (score >= 40) return 'Regular';
  return 'Em Desenvolvimento';
}

export function downloadESGReport(data: ReportData): void {
  const doc = generateESGReportPDF(data);
  const companyName = data.company.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Empresa';
  const date = new Date().toISOString().split('T')[0];
  doc.save(`Relatorio_ESG_${companyName}_${date}.pdf`);
}

export async function generateReportFromElement(
  elementId: string, 
  filename: string
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }
  
  try {
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;
    
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF from element:', error);
    alert('Erro ao gerar PDF. Tente novamente.');
  }
}
