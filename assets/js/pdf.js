function cleanText(value, fallback = '—') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function hexToRgb(hex) {
  const normalized = String(hex || '').replace('#', '').trim();
  const value = normalized.length === 3
    ? normalized.split('').map(char => char + char).join('')
    : normalized;
  if (!/^[0-9a-f]{6}$/i.test(value)) return [31, 77, 58];
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)];
}

function generatePdf() {
  if (!window.jspdf?.jsPDF) {
    alert('No se pudo cargar la librería PDF. Revisa tu conexión e inténtalo de nuevo.');
    return;
  }

  calculate();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const accent = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#1f4d3a');
  const ink = [23, 23, 23];
  const muted = [111, 106, 97];
  const line = [228, 222, 210];
  const white = [255, 255, 255];
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const tableWidth = 182;
  const quoteTitle = cleanText(els.quoteTitle.value, 'Cotización de proyecto');
  const projectName = cleanText(els.projectName.value, 'Proyecto sin nombre');
  const providerName = cleanText(els.providerName.value || els.providerBrand.value, 'Proveedor');
  const totalValues = totals();
  const advance = effectiveAdvance(totalValues);
  const scheduled = state.schedule.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const mode = els.paymentMode.value;
  const balance = mode === 'deliverable' || mode === 'weekly'
    ? Math.max(0, totalValues.total - advance - scheduled)
    : Math.max(0, totalValues.total - advance);
  const fileSafeCode = cleanText(els.quoteCode.value || els.projectName.value || quoteTitle, 'cotizacion').replace(/[^a-z0-9_-]+/gi, '-').toLowerCase();

  doc.setProperties({
    title: quoteTitle,
    subject: projectName,
    author: providerName,
    creator: 'Cotizador Pro'
  });

  const paintPage = () => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setFillColor(accent[0], accent[1], accent[2]);
    doc.rect(0, 0, pageWidth, 4, 'F');
  };

  const drawSectionTitle = (title, y) => {
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text(String(title).toUpperCase(), margin, y);
    doc.setDrawColor(accent[0], accent[1], accent[2]);
    doc.setLineWidth(0.4);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    return y + 8;
  };

  const measureParty = lines => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    return lines.map(([label, value]) => doc.splitTextToSize(`${label}: ${cleanText(value)}`, 80));
  };

  const drawPartyBox = (x, y, width, height, title, measured) => {
    doc.setDrawColor(line[0], line[1], line[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, width, height, 2, 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text(String(title).toUpperCase(), x + 4, y + 5.5);
    let lineY = y + 10.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(ink[0], ink[1], ink[2]);
    measured.forEach(lines => {
      lines.forEach(text => {
        doc.text(text, x + 4, lineY);
        lineY += 3.6;
      });
      lineY += 1.2;
    });
  };

  paintPage();
  let y = 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(accent[0], accent[1], accent[2]);
  doc.text('COTIZACIÓN', margin, y);
  y += 7;

  let titleSize = 24;
  doc.setFont('times', 'bold');
  doc.setFontSize(titleSize);
  let titleLines = doc.splitTextToSize(quoteTitle, 120);
  while (titleLines.length > 3 && titleSize > 16) {
    titleSize -= 2;
    doc.setFontSize(titleSize);
    titleLines = doc.splitTextToSize(quoteTitle, 120);
  }
  doc.setTextColor(ink[0], ink[1], ink[2]);
  titleLines.forEach((lineText, index) => {
    doc.text(lineText, margin, y + index * (titleSize * 0.42));
  });
  y += titleLines.length * (titleSize * 0.42) + 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(muted[0], muted[1], muted[2]);
  doc.text(`Código: ${cleanText(els.quoteCode.value)} · Emisión: ${formatDate(els.issueDate.value)} · Validez: ${cleanText(els.validity.value)}`, margin, y);

  doc.setFillColor(accent[0], accent[1], accent[2]);
  doc.roundedRect(142, 16, 54, 20, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL', 146, 22);
  let totalSize = 14;
  doc.setFontSize(totalSize);
  const totalText = pdfMoney(totalValues.total);
  while (doc.getTextWidth(totalText) > 46 && totalSize > 8) {
    totalSize -= 1;
    doc.setFontSize(totalSize);
  }
  doc.text(totalText, 146, 31);

  y = Math.max(y, 42) + 8;

  y = drawSectionTitle('Proyecto y entrega', y);
  doc.autoTable({
    startY: y,
    theme: 'plain',
    margin: { left: margin, right: margin, top: 20, bottom: 18 },
    tableWidth,
    styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 2, textColor: ink, valign: 'top' },
    body: [
      ['Proyecto', projectName, 'Tipo', cleanText(els.projectType.value)],
      ['Inicio', formatDate(els.startDate.value), 'Entrega', formatDate(els.endDate.value)],
      ['Plazo', `${cleanText(els.durationQty.value)} ${els.durationUnit.value === 'weeks' ? 'semana(s)' : 'día(s)'}`, 'Forma de pago', paymentModeText()],
      ['Abono inicial', pdfMoney(advance), 'Saldo', pdfMoney(balance)]
    ],
    columnStyles: {
      0: { cellWidth: 30, fontStyle: 'bold' },
      1: { cellWidth: 60 },
      2: { cellWidth: 30, fontStyle: 'bold' },
      3: { cellWidth: 62 }
    }
  });
  y = (doc.lastAutoTable?.finalY || y) + 8;

  const clientMeasured = measureParty([
    ['Nombre', els.clientName.value],
    ['RUC / doc.', els.clientRuc.value],
    ['Contacto', els.contactName.value],
    ['Correo / teléfono', els.contactEmail.value],
    ['Dirección / ciudad', els.clientAddress.value]
  ]);
  const providerMeasured = measureParty([
    ['Nombre', els.providerName.value || els.providerBrand.value],
    ['Marca', els.providerBrand.value],
    ['RUC / doc.', els.providerRuc.value],
    ['Correo', els.providerEmail.value],
    ['Teléfono', els.providerPhone.value],
    ['Dirección / ciudad', els.providerAddress.value]
  ]);
  const partyContentHeight = Math.max(
    clientMeasured.reduce((sum, lines) => sum + lines.length * 3.6 + 1.2, 0),
    providerMeasured.reduce((sum, lines) => sum + lines.length * 3.6 + 1.2, 0)
  );
  const partyHeight = Math.max(32, partyContentHeight + 10);
  if (y + partyHeight > pageHeight - 20) {
    doc.addPage();
    paintPage();
    y = 20;
  }
  y = drawSectionTitle('Cliente y proveedor', y);
  drawPartyBox(margin, y, 88, partyHeight, 'Cliente', clientMeasured);
  drawPartyBox(margin + 94, y, 88, partyHeight, 'Proveedor', providerMeasured);
  y += partyHeight + 8;

  if (y > pageHeight - 50) {
    doc.addPage();
    paintPage();
    y = 20;
  }
  y = drawSectionTitle('Alcance y condiciones', y);
  doc.autoTable({
    startY: y,
    theme: 'plain',
    margin: { left: margin, right: margin, top: 20, bottom: 18 },
    tableWidth,
    styles: { font: 'helvetica', fontSize: 8, cellPadding: 2, textColor: ink, valign: 'top' },
    body: [
      ['Alcance general', cleanText(els.scope.value)],
      ['Condiciones', cleanText(els.terms.value)]
    ],
    columnStyles: {
      0: { cellWidth: 36, fontStyle: 'bold', textColor: accent },
      1: { cellWidth: 146 }
    }
  });

  doc.addPage();
  paintPage();
  y = 20;
  y = drawSectionTitle('Ítems cotizados', y);
  doc.autoTable({
    startY: y,
    theme: 'grid',
    margin: { left: margin, right: margin, top: 20, bottom: 18 },
    tableWidth,
    styles: { font: 'helvetica', fontSize: 8, cellPadding: 2, lineColor: line, lineWidth: 0.2, textColor: ink, valign: 'top', overflow: 'linebreak' },
    headStyles: { fillColor: accent, textColor: white, fontStyle: 'bold', fontSize: 8 },
    head: [['#', 'Ítem y alcance', 'Tipo', 'Cant.', 'Precio', 'Total']],
    body: state.items.length
      ? state.items.map((item, index) => [
        String(index + 1),
        `${cleanText(item.name)}${item.description ? '\n' + item.description : ''}`,
        cleanText(item.type),
        String(item.qty || 0),
        pdfMoney(item.price),
        pdfMoney(Number(item.qty || 0) * Number(item.price || 0))
      ])
      : [['', 'Sin ítems registrados', '—', '0', '—', '—']],
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 76 },
      2: { cellWidth: 24 },
      3: { cellWidth: 12, halign: 'right' },
      4: { cellWidth: 28, halign: 'right' },
      5: { cellWidth: 34, halign: 'right' }
    }
  });
  y = (doc.lastAutoTable?.finalY || y) + 8;

  if (y > pageHeight - 55) {
    doc.addPage();
    paintPage();
    y = 20;
  }
  y = drawSectionTitle('Resumen financiero', y);
  doc.autoTable({
    startY: y,
    theme: 'grid',
    margin: { left: 70, right: margin, top: 20, bottom: 18 },
    tableWidth: 126,
    styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 2.2, lineColor: line, lineWidth: 0.2, textColor: ink },
    body: [
      ['Subtotal', pdfMoney(totalValues.subtotal)],
      ['Descuento', pdfMoney(totalValues.discount)],
      ['Base imponible', pdfMoney(totalValues.taxable)],
      [`Impuesto (${els.taxRate.value || 0}%)`, pdfMoney(totalValues.tax)],
      ['Abono inicial', pdfMoney(advance)],
      ['Saldo', pdfMoney(balance)],
      ['Total', pdfMoney(totalValues.total)]
    ],
    columnStyles: {
      0: { cellWidth: 70, fontStyle: 'bold' },
      1: { cellWidth: 56, halign: 'right', fontStyle: 'bold' }
    },
    didParseCell: data => {
      if (data.row.index === 6) {
        data.cell.styles.fillColor = accent;
        data.cell.styles.textColor = white;
      }
    }
  });
  y = (doc.lastAutoTable?.finalY || y) + 8;

  if (state.thirdPartyCosts.length) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(muted[0], muted[1], muted[2]);
    doc.text('El total de servicios no incluye los costos de terceros.', 70, y);
    y += 5;

    if (y > pageHeight - 70) {
      doc.addPage();
      paintPage();
      y = 20;
    }
    y = drawSectionTitle('Costos de terceros (no incluidos en el total)', y);
    doc.autoTable({
      startY: y,
      theme: 'grid',
      margin: { left: margin, right: margin, top: 20, bottom: 18 },
      tableWidth,
      styles: { font: 'helvetica', fontSize: 8, cellPadding: 2, lineColor: line, lineWidth: 0.2, textColor: ink, valign: 'top', overflow: 'linebreak' },
      headStyles: { fillColor: accent, textColor: white, fontStyle: 'bold', fontSize: 8 },
      head: [['Concepto', 'Periodicidad', 'Total']],
      body: state.thirdPartyCosts.map(cost => [
        cleanText(cost.name),
        thirdPartyPeriodLabel(cost.period),
        pdfMoney(thirdPartyRowTotal(cost))
      ]),
      foot: [['Total referencial', '', pdfMoney(thirdPartyTotal())]],
      footStyles: { fillColor: [247, 244, 238], textColor: ink, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 30 },
        2: { cellWidth: 32, halign: 'right' }
      }
    });
    y = (doc.lastAutoTable?.finalY || y) + 3;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(muted[0], muted[1], muted[2]);
    const thirdPartyNote = doc.splitTextToSize('Estos montos los paga el cliente directamente a cada proveedor y pueden variar según la cuenta, el país y las políticas vigentes. No forman parte del total de servicios.', tableWidth);
    thirdPartyNote.forEach(line => {
      doc.text(line, margin, y);
      y += 3.6;
    });
    y += 5;
  }

  if (state.schedule.length) {
    if (y > pageHeight - 55) {
      doc.addPage();
      paintPage();
      y = 20;
    }
    y = drawSectionTitle('Cronograma de pagos por etapas', y);
    doc.autoTable({
      startY: y,
      theme: 'grid',
      margin: { left: margin, right: margin, top: 20, bottom: 18 },
      tableWidth,
      styles: { font: 'helvetica', fontSize: 8, cellPadding: 2, lineColor: line, lineWidth: 0.2, textColor: ink, valign: 'top', overflow: 'linebreak' },
      headStyles: { fillColor: accent, textColor: white, fontStyle: 'bold' },
      head: [['Etapa', 'Fecha estimada', 'Entregable', 'Abono']],
      body: state.schedule.map((row, index) => [
        `Etapa ${row.etapa || row.week || index + 1}`,
        formatDate(row.date),
        cleanText(row.deliverable),
        Number(row.amount || 0) > 0 ? pdfMoney(row.amount) : '—'
      ]),
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 28 },
        2: { cellWidth: 96 },
        3: { cellWidth: 40, halign: 'right' }
      }
    });
  }

  const pageCount = doc.internal.getNumberOfPages();
  for (let index = 1; index <= pageCount; index += 1) {
    doc.setPage(index);
    doc.setDrawColor(line[0], line[1], line[2]);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(muted[0], muted[1], muted[2]);
    doc.text(`${providerName} · Cotizador Pro · Página ${index} de ${pageCount}`, margin, pageHeight - 8);
  }

  try {
    doc.save(`${fileSafeCode}.pdf`);
    showNotice(els.pdfNotice, 'PDF generado correctamente.', 2400);
  } catch {
    alert('No se pudo generar el PDF. Inténtalo de nuevo.');
  }
}
