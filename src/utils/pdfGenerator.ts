import jsPDF from 'jspdf';
import { DiagnosisResult } from '../types/diagnosis';
import { formatDateBR } from './validators';
import { getSegmentBenchmark, calculateEstimatedPercentile } from '../data/segmentBenchmarks';

/**
 * Gerador de Relatório Executivo Oficial em PDF
 * Metodologia Cresce Del-Rei (ACI Del-Rei & Vortex)
 */
export function generateExecutivePDF(diagnosis: DiagnosisResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Helper para adicionar rodapé institucional e numeração em cada página
  const addInstitutionalHeaderFooter = (pageNum: number, totalPages = 9) => {
    // Header sutil (exceto na capa)
    if (pageNum > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 130, 145);
      doc.text('DIAGNÓSTICO EMPRESARIAL CRESCE DEL-REI', margin, 12);
      doc.text('ACI DEL-REI & VORTEX', pageWidth - margin, 12, { align: 'right' });
      doc.setDrawColor(220, 225, 235);
      doc.setLineWidth(0.3);
      doc.line(margin, 14, pageWidth - margin, 14);
    }

    // Rodapé
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 130, 145);
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

    doc.text(`Empresa: ${diagnosis.company.corporateName.slice(0, 40)}`, margin, pageHeight - 9);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - margin, pageHeight - 9, { align: 'right' });
  };

  // ==========================================
  // PÁGINA 1: CAPA INSTITUCIONAL EXECUTIVA
  // ==========================================
  // Top bar decorativo azul marinho institucional
  doc.setFillColor(15, 30, 60); // Navy blue
  doc.rect(0, 0, pageWidth, 12, 'F');
  doc.setFillColor(37, 99, 235); // Blue accent
  doc.rect(0, 12, pageWidth, 3, 'F');

  // Identificação de Realização e Parceria
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(37, 99, 235);
  doc.text('REALIZAÇÃO INSTITUCIONAL: ACI DEL-REI  |  PARCERIA: VORTEX', margin, 38);

  // Título Principal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(15, 23, 42);
  doc.text('Relatório Executivo de', margin, 54);
  doc.text('Diagnóstico Empresarial', margin, 66);

  doc.setFontSize(22);
  doc.setTextColor(30, 64, 175);
  doc.text('Cresce Del-Rei', margin, 78);

  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1.2);
  doc.line(margin, 85, margin + 50, 85);

  // Subtítulo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  const subtitle = 'Avaliação abrangente de maturidade empresarial em vendas, canais digitais, solidez financeira, processos e estratégia para negócios de São João del-Rei e região.';
  const splitSub = doc.splitTextToSize(subtitle, contentWidth);
  doc.text(splitSub, margin, 94);

  // Bloco de Identificação da Empresa
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, 120, contentWidth, 75, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('DADOS DA EMPRESA AVALIADA', margin + 8, 130);

  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(diagnosis.company.corporateName, margin + 8, 140);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  doc.text(`Nome Fantasia: ${diagnosis.company.tradeName || 'Não informado'}`, margin + 8, 148);
  doc.text(`CNPJ: ${diagnosis.company.cnpj}`, margin + 8, 155);
  doc.text(`Segmento: ${diagnosis.company.segment.toUpperCase()}`, margin + 8, 162);
  doc.text(`Porte: ${diagnosis.company.revenueTier.toUpperCase()}`, margin + 8, 169);
  doc.text(`Município: ${diagnosis.company.city} - ${diagnosis.company.state}`, margin + 8, 176);
  doc.text(`Responsável: ${diagnosis.respondent.fullName} (${diagnosis.respondent.role})`, margin + 8, 183);

  // Resumo de Pontuação de Destaque na Capa
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin, 205, contentWidth, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text('ÍNDICE DE MATURIDADE EMPRESARIAL (IME)', margin + 8, 215);

  doc.setFontSize(28);
  doc.text(`${diagnosis.ime}/100`, margin + 8, 228);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text(`Classificação Operacional: ${diagnosis.imeClassification.toUpperCase()}`, margin + 70, 222);
  doc.text(`Índice de Capacidade Digital (ICD): ${diagnosis.icd}/100 (${diagnosis.icdClassification})`, margin + 70, 230);
  doc.text(`Nível de Confiança da Amostra: ${diagnosis.confidenceLevel}`, margin + 70, 238);

  // Aviso no pé da capa
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Data de Emissão: ${formatDateBR(diagnosis.createdAt)} | Metodologia Cresce Del-Rei v1.0`, margin, 270);
  doc.text('Este documento constitui uma análise diagnóstica orientativa e não possui caráter de certificação ou análise de crédito.', margin, 275);

  // ==========================================
  // PÁGINA 2: RESUMO EXECUTIVO
  // ==========================================
  doc.addPage();
  addInstitutionalHeaderFooter(2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Resumo Executivo', margin, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Visão consolidada da situação da empresa e principais prioridades de evolução.', margin, 32);

  // Caixa de Diagnóstico Sintético
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, 38, contentWidth, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 64, 175);
  doc.text('PARECER PRELIMINAR:', margin + 6, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  const pMsg = doc.splitTextToSize(
    `A empresa atingiu pontuação IME de ${diagnosis.ime}/100, posicionando-se na faixa "${diagnosis.imeClassification}". ${diagnosis.imeMessage}`,
    contentWidth - 12
  );
  doc.text(pMsg, margin + 6, 54);

  // Duas colunas: Destaques Positivos e Principais Gargalos
  const colW = (contentWidth - 6) / 2;

  // Coluna 1: Força
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, 76, colW, 48, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(22, 101, 52);
  doc.text('PRINCIPAL PONTO FORTE', margin + 6, 84);

  doc.setFontSize(9);
  doc.setTextColor(21, 128, 61);
  const str0 = diagnosis.strengths[0];
  if (str0) {
    doc.text(str0.title, margin + 6, 92);
    doc.setFont('helvetica', 'normal');
    const sEvid = doc.splitTextToSize(str0.evidence, colW - 12);
    doc.text(sEvid, margin + 6, 98);
  }

  // Coluna 2: Gargalo
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin + colW + 6, 76, colW, 48, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(153, 27, 27);
  doc.text('PRINCIPAL GARGALO OPERACIONAL', margin + colW + 12, 84);

  doc.setFontSize(9);
  doc.setTextColor(185, 28, 28);
  const btk0 = diagnosis.bottlenecks[0];
  if (btk0) {
    doc.text(btk0.title, margin + colW + 12, 92);
    doc.setFont('helvetica', 'normal');
    const bProb = doc.splitTextToSize(btk0.problem, colW - 12);
    doc.text(bProb, margin + colW + 12, 98);
  }

  // Seção de Alertas Críticos Ativos
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Alertas Críticos Identificados:', margin, 136);

  let alertY = 144;
  if (diagnosis.alerts.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Nenhum alerta crítico com nota inferior a 2 foi registrado nos quesitos essenciais.', margin, alertY);
  } else {
    diagnosis.alerts.slice(0, 4).forEach((al, idx) => {
      doc.setFillColor(255, 241, 242);
      doc.setDrawColor(253, 164, 175);
      doc.roundedRect(margin, alertY, contentWidth, 24, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(159, 18, 57);
      doc.text(`[ALERTA ${idx + 1}] ${al.title}`, margin + 5, alertY + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      const splitDesc = doc.splitTextToSize(al.description, contentWidth - 10);
      doc.text(splitDesc, margin + 5, alertY + 13);
      doc.setFont('helvetica', 'bold');
      doc.text(`Ação prioritária: ${al.actionRequired}`, margin + 5, alertY + 20);

      alertY += 27;
    });
  }

  // ==========================================
  // PÁGINA 3: VISÃO DOS 5 PILARES
  // ==========================================
  doc.addPage();
  addInstitutionalHeaderFooter(3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Desempenho nos Cinco Pilares de Maturidade', margin, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Cada pilar varia de 0 a 20 pontos e compõe 20% do Índice de Maturidade Empresarial (IME).', margin, 32);

  let py = 42;
  const pillarsList = Object.values(diagnosis.pillarScores);

  pillarsList.forEach((pil, i) => {
    // Card do pilar
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, py, contentWidth, 38, 2, 2, 'FD');

    // Título e Nota
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Pilar ${i + 1}: ${pil.name}`, margin + 6, py + 8);

    doc.setFontSize(12);
    doc.setTextColor(30, 64, 175);
    doc.text(`${pil.score}/20 pts (${pil.percentage}%)`, pageWidth - margin - 6, py + 8, { align: 'right' });

    // Barra de progresso visual
    const barWidth = contentWidth - 12;
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(margin + 6, py + 12, barWidth, 4, 1, 1, 'F');

    const fillW = Math.max(2, (barWidth * pil.score) / 20);
    if (pil.score <= 5) doc.setFillColor(239, 68, 68);
    else if (pil.score <= 10) doc.setFillColor(245, 158, 11);
    else if (pil.score <= 15) doc.setFillColor(59, 130, 246);
    else doc.setFillColor(16, 185, 129);

    doc.roundedRect(margin + 6, py + 12, fillW, 4, 1, 1, 'F');

    // Classificação e Descrição
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Classificação: ${pil.classification.toUpperCase()}`, margin + 6, py + 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const pDesc = doc.splitTextToSize(pil.description, contentWidth - 12);
    doc.text(pDesc, margin + 6, py + 28);

    py += 44;
  });

  // ==========================================
  // PÁGINA 4: BENCHMARK REGIONAL COM O SEGMENTO
  // ==========================================
  doc.addPage();
  addInstitutionalHeaderFooter(4);

  const bm = getSegmentBenchmark(diagnosis.company.segment);
  const bmPercentile = calculateEstimatedPercentile(diagnosis.ime, bm.averageIme);
  const bmImeDiff = Number((diagnosis.ime - bm.averageIme).toFixed(1));
  const bmIcdDiff = Number((diagnosis.icd - bm.averageIcd).toFixed(1));

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Comparativo com a Média do Segmento (Benchmark)', margin, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Comparativo contra ${bm.sampleSize} empresas do setor "${bm.name}" em São João del-Rei e região.`, margin, 32);

  // Big numbers card
  const cW3 = (contentWidth - 8) / 3;

  // Box 1: IME
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin, 38, cW3, 30, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 64, 175);
  doc.text('MATURIDADE (IME)', margin + 4, 45);
  doc.setFontSize(14);
  doc.text(`${diagnosis.ime}`, margin + 4, 53);
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`vs ${bm.averageIme} (Setor)`, margin + 22, 53);
  doc.setFontSize(8);
  if (bmImeDiff >= 0) {
    doc.setTextColor(21, 128, 61);
    doc.text(`+${bmImeDiff} pts acima da média`, margin + 4, 62);
  } else {
    doc.setTextColor(185, 28, 28);
    doc.text(`${bmImeDiff} pts abaixo da média`, margin + 4, 62);
  }

  // Box 2: ICD
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin + cW3 + 4, 38, cW3, 30, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(21, 128, 61);
  doc.text('CAPACIDADE DIGITAL (ICD)', margin + cW3 + 8, 45);
  doc.setFontSize(14);
  doc.text(`${diagnosis.icd}`, margin + cW3 + 8, 53);
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`vs ${bm.averageIcd} (Setor)`, margin + cW3 + 26, 53);
  doc.setFontSize(8);
  if (bmIcdDiff >= 0) {
    doc.setTextColor(21, 128, 61);
    doc.text(`+${bmIcdDiff} pts mais digital`, margin + cW3 + 8, 62);
  } else {
    doc.setTextColor(185, 28, 28);
    doc.text(`${bmIcdDiff} pts menos digital`, margin + cW3 + 8, 62);
  }

  // Box 3: Posição Relativa
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + (cW3 + 4) * 2, 38, cW3, 30, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('POSICIONAMENTO REGIONAL', margin + (cW3 + 4) * 2 + 4, 45);
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(`Top ${100 - bmPercentile}%`, margin + (cW3 + 4) * 2 + 4, 53);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Percentil estimado ~${bmPercentile}%`, margin + (cW3 + 4) * 2 + 4, 62);

  // Seção de Barras Comparativas por Pilar
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Comparativo de Notas por Pilar (0 a 20 pontos):', margin, 77);

  // Legenda
  doc.setFillColor(37, 99, 235);
  doc.rect(pageWidth - margin - 58, 73, 3, 3, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Sua Empresa', pageWidth - margin - 53, 75.5);

  doc.setFillColor(245, 158, 11);
  doc.rect(pageWidth - margin - 26, 73, 3, 3, 'F');
  doc.text('Média Setor', pageWidth - margin - 21, 75.5);

  const pillarsListBm = [
    { id: 'pilar1', name: '1. Receita & Vendas', u: diagnosis.pillarScores.pilar1?.score || 0, avg: bm.pillarAverages.pilar1 },
    { id: 'pilar2', name: '2. Presença Digital', u: diagnosis.pillarScores.pilar2?.score || 0, avg: bm.pillarAverages.pilar2 },
    { id: 'pilar3', name: '3. Finanças & Caixa', u: diagnosis.pillarScores.pilar3?.score || 0, avg: bm.pillarAverages.pilar3 },
    { id: 'pilar4', name: '4. Processos & TI', u: diagnosis.pillarScores.pilar4?.score || 0, avg: bm.pillarAverages.pilar4 },
    { id: 'pilar5', name: '5. Estratégia & Pessoas', u: diagnosis.pillarScores.pilar5?.score || 0, avg: bm.pillarAverages.pilar5 },
  ];

  let bmy = 82;
  const barMaxW = 75;

  pillarsListBm.forEach((p) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, bmy, contentWidth, 22, 1.5, 1.5, 'FD');

    // Nome
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(p.name, margin + 5, bmy + 8);

    const diff = Number((p.u - p.avg).toFixed(1));
    doc.setFontSize(8);
    if (diff > 0) {
      doc.setTextColor(21, 128, 61);
      doc.text(`+${diff} pts acima`, margin + 5, bmy + 16);
    } else if (diff < 0) {
      doc.setTextColor(185, 28, 28);
      doc.text(`${diff} pts abaixo`, margin + 5, bmy + 16);
    } else {
      doc.setTextColor(100, 116, 139);
      doc.text('Na média', margin + 5, bmy + 16);
    }

    // Barra Sua Empresa
    const barX = margin + 65;
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(barX, bmy + 4, barMaxW, 4, 1, 1, 'F');
    doc.setFillColor(37, 99, 235);
    const uW = Math.max(2, (barMaxW * p.u) / 20);
    doc.roundedRect(barX, bmy + 4, uW, 4, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 64, 175);
    doc.text(`${p.u}/20`, barX + barMaxW + 4, bmy + 7.5);

    // Barra Média Setor
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(barX, bmy + 12, barMaxW, 4, 1, 1, 'F');
    doc.setFillColor(245, 158, 11);
    const avgW = Math.max(2, (barMaxW * p.avg) / 20);
    doc.roundedRect(barX, bmy + 12, avgW, 4, 1, 1, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(180, 83, 9);
    doc.text(`${p.avg}/20`, barX + barMaxW + 4, bmy + 15.5);

    bmy += 26;
  });

  // Insights do Benchmark
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, 218, contentWidth, 24, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(21, 128, 61);
  doc.text('FORÇA REGIONAL DO SETOR:', margin + 6, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(22, 101, 52);
  const strSec = doc.splitTextToSize(bm.topStrengthSector, contentWidth - 12);
  doc.text(strSec, margin + 6, 231);

  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin, 246, contentWidth, 24, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(185, 28, 28);
  doc.text('PRINCIPAL GARGALO TÍPICO DO SETOR EM SÃO JOÃO DEL-REI:', margin + 6, 253);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(153, 27, 27);
  const btkSec = doc.splitTextToSize(bm.topBottleneckSector, contentWidth - 12);
  doc.text(btkSec, margin + 6, 259);

  // ==========================================
  // PÁGINA 5: PONTOS FORTES EM DETALHE
  // ==========================================
  doc.addPage();
  addInstitutionalHeaderFooter(5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('4. Principais Pontos Fortes e Competências', margin, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Práticas identificadas com maior grau de consistência e valor agregado.', margin, 32);

  let sy = 40;
  diagnosis.strengths.forEach((st, idx) => {
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, sy, contentWidth, 52, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(21, 128, 61);
    doc.text(`Destaque ${idx + 1}: ${st.title}`, margin + 6, sy + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);

    doc.setFont('helvetica', 'bold');
    doc.text('Evidência identificada:', margin + 6, sy + 16);
    doc.setFont('helvetica', 'normal');
    const evText = doc.splitTextToSize(st.evidence, contentWidth - 12);
    doc.text(evText, margin + 6, sy + 21);

    doc.setFont('helvetica', 'bold');
    doc.text('Por que é relevante para o negócio:', margin + 6, sy + 30);
    doc.setFont('helvetica', 'normal');
    const whyText = doc.splitTextToSize(st.whyImportant, contentWidth - 12);
    doc.text(whyText, margin + 6, sy + 35);

    doc.setFont('helvetica', 'bold');
    doc.text('Como preservar e alavancar:', margin + 6, sy + 43);
    doc.setFont('helvetica', 'normal');
    doc.text(st.howToLeverage, margin + 6, sy + 48);

    sy += 58;
  });

  // ==========================================
  // PÁGINA 6: GARGALOS E OPORTUNIDADES
  // ==========================================
  doc.addPage();
  addInstitutionalHeaderFooter(6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('5. Gargalos Críticos e Prioridades de Correção', margin, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Processos que apresentam vulnerabilidade e demandam ação corretiva coordenada.', margin, 32);

  let by = 40;
  diagnosis.bottlenecks.forEach((bt, idx) => {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(margin, by, contentWidth, 54, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(185, 28, 28);
    doc.text(`Gargalo ${idx + 1}: ${bt.title} | Prioridade: ${bt.priority}`, margin + 6, by + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);

    doc.text('Problema diagnosticado:', margin + 6, by + 16);
    doc.setFont('helvetica', 'normal');
    const prText = doc.splitTextToSize(bt.problem, contentWidth - 12);
    doc.text(prText, margin + 6, by + 21);

    doc.setFont('helvetica', 'bold');
    doc.text('Impacto e risco de não agir:', margin + 6, by + 30);
    doc.setFont('helvetica', 'normal');
    const impText = doc.splitTextToSize(`${bt.impact} ${bt.risk}`, contentWidth - 12);
    doc.text(impText, margin + 6, by + 35);

    doc.setFont('helvetica', 'bold');
    doc.text('Ação inicial recomendada:', margin + 6, by + 44);
    doc.setFont('helvetica', 'normal');
    doc.text(bt.recommendedAction, margin + 6, by + 49);

    by += 60;
  });

  // ==========================================
  // PÁGINA 7: MATRIZ DE PRIORIDADES EXECUTIVA
  // ==========================================
  doc.addPage();
  addInstitutionalHeaderFooter(7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('6. Matriz de Priorização das Ações', margin, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Classificação das iniciativas recomendadas por impacto, esforço, urgência e métrica.', margin, 32);

  // Tabela de matriz
  let my = 40;
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, my, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('INICIATIVA RECOMENDADA', margin + 3, my + 5.5);
  doc.text('IMPACTO', margin + 85, my + 5.5);
  doc.text('ESFORÇO', margin + 105, my + 5.5);
  doc.text('URGÊNCIA', margin + 125, my + 5.5);
  doc.text('PRAZO', margin + 148, my + 5.5);

  my += 8;

  diagnosis.actionPlan.forEach((act, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, my, contentWidth, 14, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);

    const actName = doc.splitTextToSize(act.action, 80);
    doc.text(actName, margin + 3, my + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.text(act.impact, margin + 85, my + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(act.effort, margin + 105, my + 5);
    doc.text(act.urgency, margin + 125, my + 5);
    doc.text(act.timeframe, margin + 148, my + 5);

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, my + 14, pageWidth - margin, my + 14);
    my += 15;
  });

  // ==========================================
  // PÁGINA 8: PLANO DE AÇÃO (30, 90 DIAS E 12 MESES)
  // ==========================================
  doc.addPage();
  addInstitutionalHeaderFooter(8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('7. Plano de Ação Estruturado em 3 Horizontes', margin, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Roteiro cronológico de execução desenhado para evitar sobrecarga.', margin, 32);

  // Bloco 30 dias
  let ay = 40;
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin, ay, contentWidth, 38, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 64, 175);
  doc.text('PRÓXIMOS 30 DIAS — AÇÕES IMEDIATAS DE ESTABILIZAÇÃO', margin + 6, ay + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const act30 = diagnosis.actionPlan.filter((a) => a.horizon === '30_dias');
  act30.forEach((item, i) => {
    doc.text(`• ${item.action}`, margin + 6, ay + 14 + i * 7);
  });

  // Bloco 90 dias
  ay += 46;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, ay, contentWidth, 38, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(21, 128, 61);
  doc.text('PRÓXIMOS 90 DIAS — ESTRUTURAÇÃO DE PROCESSOS E INDICADORES', margin + 6, ay + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const act90 = diagnosis.actionPlan.filter((a) => a.horizon === '90_dias');
  act90.forEach((item, i) => {
    doc.text(`• ${item.action}`, margin + 6, ay + 14 + i * 7);
  });

  // Bloco 12 meses
  ay += 46;
  doc.setFillColor(250, 245, 255);
  doc.setDrawColor(233, 213, 255);
  doc.roundedRect(margin, ay, contentWidth, 38, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(126, 34, 206);
  doc.text('PRÓXIMOS 12 MESES — TRANSFORMAÇÃO, AUTOMAÇÃO E ESCALA', margin + 6, ay + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const act12m = diagnosis.actionPlan.filter((a) => a.horizon === '12_meses');
  act12m.forEach((item, i) => {
    doc.text(`• ${item.action}`, margin + 6, ay + 14 + i * 7);
  });

  // ==========================================
  // PÁGINA 9: TRILHAS DE APOIO E PRÓXIMOS PASSOS
  // ==========================================
  doc.addPage();
  addInstitutionalHeaderFooter(9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('8. Trilhas de Apoio Institucional e Devolutiva', margin, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Oportunidades de acompanhamento com a equipe da ACI Del-Rei e Vortex.', margin, 32);

  let ty = 40;
  diagnosis.supportTrails.forEach((tr) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, ty, contentWidth, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 64, 175);
    doc.text(`Trilha: ${tr.category} (${tr.priority === 'alta' ? 'Alta Prioridade' : 'Desenvolvimento'})`, margin + 6, ty + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const splitTr = doc.splitTextToSize(tr.description, contentWidth - 12);
    doc.text(splitTr, margin + 6, ty + 12);

    ty += 24;
  });

  // Caixa de Convite para Devolutiva
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(147, 197, 253);
  doc.roundedRect(margin, 195, contentWidth, 54, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text('AGENDE SUA REUNIÃO DE DEVOLUTIVA COM UM CONSULTOR', margin + 8, 205);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  const meetInfo = doc.splitTextToSize(
    'A ACI Del-Rei e a Vortex colocam à disposição dos empresários de São João del-Rei uma conversa executiva online de 45 minutos (via Google Meet) para aprofundar as recomendações deste relatório e apoiar na definição das ações prioritárias. O agendamento pode ser realizado diretamente na plataforma da pesquisa.',
    contentWidth - 16
  );
  doc.text(meetInfo, margin + 8, 213);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 64, 175);
  doc.text('Canais de Atendimento Institucional:', margin + 8, 232);
  doc.setFont('helvetica', 'normal');
  doc.text('ACI Del-Rei: (32) 3371-2000 | contato@acidelrei.org.br', margin + 8, 238);
  doc.text('Vortex Tecnologia & Metodologia: contato@vortextecnologia.com.br', margin + 8, 244);

  // Termos legais no final
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Tratamento de dados em conformidade com a LGPD (Lei 13.709/2018). Dados não comercializados.', margin, 268);
  doc.text('São João del-Rei - Minas Gerais, Brasil.', margin, 272);

  // Download do arquivo PDF
  const safeName = diagnosis.company.corporateName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
  doc.save(`diagnostico-cresce-del-rei-${safeName}.pdf`);
}
