function cleanText(value, fallback = '—') {
      const text = String(value || '').trim();
      return text || fallback;
    }

    function addPdfSectionTitle(doc, title, y, accent) {
      doc.setTextColor(accent[0], accent[1], accent[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(title.toUpperCase(), 14, y);
      doc.setDrawColor(accent[0], accent[1], accent[2]);
      doc.line(14, y + 2, 196, y + 2);
    }

    function hexToRgb(hex) {
      const normalized = hex.replace('#', '');
      const value = normalized.length === 3 ? normalized.split('').map(c => c + c).join('') : normalized;
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
      const accent = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2563eb');
      const totalValues = totals();
      const fileSafeCode = cleanText(els.quoteCode.value, 'cotizacion-web').replace(/[^a-z0-9_-]+/gi, '-').toLowerCase();

      const paintPage = () => {
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 0, 210, 297, 'F');
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(10, 10, 190, 277, 3, 3, 'F');
        doc.setFillColor(accent[0], accent[1], accent[2]);
        doc.rect(10, 10, 190, 4, 'F');
      };

      const sectionPage = title => {
        doc.addPage();
        paintPage();
        addPdfSectionTitle(doc, title, 28, accent);
        return 38;
      };

      paintPage();

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(22);
      doc.text('Cotización de proyecto web', 14, 28);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Código: ${cleanText(els.quoteCode.value)} · Emisión: ${formatDate(els.issueDate.value)}`, 14, 35);
      doc.text(`Validez: ${cleanText(els.validity.value)}`, 14, 41);

      doc.setFillColor(accent[0], accent[1], accent[2]);
      doc.roundedRect(142, 24, 44, 19, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('TOTAL', 146, 31);
      doc.setFontSize(14);
      doc.text(pdfMoney(totalValues.total), 146, 39);

      addPdfSectionTitle(doc, 'Proyecto y entrega', 58, accent);
      let y = 68;
      doc.autoTable({
        startY: y,
        theme: 'plain',
        styles: { fontSize: 8.5, cellPadding: 1.8, textColor: [30, 41, 59] },
        body: [
          ['Proyecto', cleanText(els.projectName.value), 'Tipo', cleanText(els.projectType.value)],
          ['Inicio', formatDate(els.startDate.value), 'Entrega', formatDate(els.endDate.value)],
          ['Plazo', `${cleanText(els.durationQty.value)} ${els.durationUnit.value === 'weeks' ? 'semana(s)' : 'día(s)'}`, 'Forma de pago', paymentModeText()],
          ['Abono inicial', pdfMoney(totalValues.advance), 'Saldo referencial', pdfMoney(Math.max(0, totalValues.total - totalValues.advance))]
        ],
        columnStyles: { 0: { fontStyle: 'bold' }, 2: { fontStyle: 'bold' } }
      });

      y = (doc.lastAutoTable?.finalY || y) + 10;
      addPdfSectionTitle(doc, 'Cliente y proveedor', y, accent);
      const clientPdfLines = [
        ['Nombre', cleanText(els.clientName.value)],
        ['RUC / doc.', cleanText(els.clientRuc.value)],
        ['Contacto', cleanText(els.contactName.value)],
        ['Correo / teléfono', cleanText(els.contactEmail.value)],
        ['Dirección / ciudad', cleanText(els.clientAddress.value)]
      ];
      const providerPdfLines = [
        ['Nombre', cleanText(els.providerName.value || els.providerBrand.value)],
        ['Marca', cleanText(els.providerBrand.value)],
        ['RUC / doc.', cleanText(els.providerRuc.value)],
        ['Correo', cleanText(els.providerEmail.value)],
        ['Teléfono', cleanText(els.providerPhone.value)],
        ['Dirección / ciudad', cleanText(els.providerAddress.value)]
      ];
      const drawLabeledPdfLines = (lines, x, yStart, maxWidth) => {
        let lineY = yStart;
        lines.forEach(([label, value]) => {
          doc.setFontSize(8);
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          const labelText = `${label}: `;
          doc.text(labelText, x, lineY);
          const labelWidth = doc.getTextWidth(labelText);
          doc.setFont('helvetica', 'normal');
          const valueLines = doc.splitTextToSize(cleanText(value), Math.max(28, maxWidth - labelWidth));
          doc.text(valueLines[0] || '—', x + labelWidth, lineY);
          if (valueLines.length > 1) {
            doc.text(valueLines.slice(1), x, lineY + 4);
          }
          lineY += Math.max(4.4, valueLines.length * 4);
        });
      };
      doc.autoTable({
        startY: y + 8,
        theme: 'grid',
        head: [['Cliente', 'Proveedor']],
        body: [
          ['', '']
        ],
        headStyles: { fillColor: [241, 245, 249], textColor: accent, fontStyle: 'bold', lineColor: [203, 213, 225], lineWidth: 0.2 },
        bodyStyles: { minCellHeight: 32 },
        styles: { fontSize: 8, cellPadding: 3, lineColor: [226, 232, 240], lineWidth: 0.2, textColor: [30, 41, 59], valign: 'top' },
        columnStyles: {
          0: { cellWidth: 88 },
          1: { cellWidth: 88 }
        },
        didDrawCell: data => {
          if (data.section !== 'body') return;
          const lines = data.column.index === 0 ? clientPdfLines : providerPdfLines;
          drawLabeledPdfLines(lines, data.cell.x + 3, data.cell.y + 6, data.cell.width - 6);
        }
      });

      y = (doc.lastAutoTable?.finalY || y) + 10;
      addPdfSectionTitle(doc, 'Alcance y condiciones', y, accent);
      const conditionRows = [
        ['Alcance general', cleanText(els.scope.value)],
        ['Condiciones', cleanText(els.terms.value)]
      ];
      doc.autoTable({
        startY: y + 6,
        theme: 'plain',
        styles: { fontSize: 8, cellPadding: 1.8, textColor: [30, 41, 59] },
        body: conditionRows,
        columnStyles: { 0: { cellWidth: 34, fontStyle: 'bold', textColor: accent }, 1: { cellWidth: 144 } }
      });

      y = sectionPage('Ítems cotizados');
      doc.autoTable({
        startY: y,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2.2, lineColor: [226, 232, 240], lineWidth: 0.2, textColor: [30, 41, 59] },
        headStyles: { fillColor: accent, textColor: [255, 255, 255], fontStyle: 'bold' },
        head: [['#', 'Ítem y alcance', 'Tipo', 'Cant.', 'Precio', 'Total']],
        body: (state.items.length ? state.items : [{ name: 'Sin ítems registrados', description: '', qty: 0, price: 0, type: '—' }]).map((item, index) => [
          String(index + 1),
          `${cleanText(item.name)}${item.description ? `\n${item.description}` : ''}`,
          cleanText(item.type),
          String(item.qty || 0),
          pdfMoney(item.price),
          pdfMoney(Number(item.qty || 0) * Number(item.price || 0))
        ]),
        columnStyles: { 0: { cellWidth: 8 }, 1: { cellWidth: 76 }, 2: { cellWidth: 25 }, 3: { cellWidth: 14, halign: 'right' }, 4: { cellWidth: 24, halign: 'right' }, 5: { cellWidth: 26, halign: 'right' } }
      });

      y = sectionPage('Resumen financiero');
      doc.autoTable({
        startY: y,
        theme: 'grid',
        margin: { left: 70, right: 14 },
        styles: { fontSize: 8.5, cellPadding: 2.2, lineColor: [226, 232, 240], lineWidth: 0.2 },
        body: [
          ['Subtotal', pdfMoney(totalValues.subtotal)],
          ['Descuento', pdfMoney(totalValues.discount)],
          ['Base imponible', pdfMoney(totalValues.taxable)],
          [`Impuesto (${els.taxRate.value || 0}%)`, pdfMoney(totalValues.tax)],
          ['Abono inicial opcional', pdfMoney(totalValues.advance)],
          ['Saldo luego del abono inicial', pdfMoney(totalValues.balance)],
          ['Total', pdfMoney(totalValues.total)]
        ],
        columnStyles: { 0: { fontStyle: 'bold' }, 1: { halign: 'right', fontStyle: 'bold' } },
        didParseCell: data => {
          if (data.row.index === 6) {
            data.cell.styles.fillColor = accent;
            data.cell.styles.textColor = [255, 255, 255];
          }
        }
      });

      y = (doc.lastAutoTable?.finalY || y) + 12;
      addPdfSectionTitle(doc, 'Cronograma de pagos por etapas', y, accent);
      doc.autoTable({
        startY: y + 8,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2.1, lineColor: [226, 232, 240], lineWidth: 0.2, textColor: [30, 41, 59] },
        headStyles: { fillColor: [248, 250, 252], textColor: [15, 23, 42], fontStyle: 'bold' },
        head: [['Etapa', 'Fecha estimada', 'Entregable', 'Abono sugerido']],
        body: (state.schedule.length ? state.schedule : [{ week: 1, etapa: 1, date: '', deliverable: 'Sin cronograma definido', amount: 0 }]).map((row, index) => [`Etapa ${row.etapa || row.week || index + 1}`, formatDate(row.date), cleanText(row.deliverable), Number(row.amount || 0) > 0 ? pdfMoney(row.amount) : '—'])
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i += 1) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(`Cotización generada por ${cleanText(els.providerName.value || els.providerBrand.value, 'Proveedor')} · Página ${i} de ${pageCount}`, 14, 291);
      }

      doc.save(`${fileSafeCode}.pdf`);
      els.pdfNotice.classList.remove('hidden');
      window.setTimeout(() => els.pdfNotice.classList.add('hidden'), 2200);
    }
