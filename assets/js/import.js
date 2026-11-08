function setField(id, value) {
      if (els[id] && value !== undefined && value !== null) els[id].value = value;
    }

    function allowedValue(value, allowed, fallback) {
      return allowed.includes(value) ? value : fallback;
    }

    function importJsonData() {
      let data;
      try {
        data = JSON.parse(els.jsonInput.value.trim());
      } catch {
        alert('El JSON no es válido. Revisa comillas, comas y llaves antes de importar.');
        return;
      }

      const proveedor = data.proveedor || data.provider || {};
      const cliente = data.cliente || data.client || {};
      const documento = data.documento || data.finance || data.cotizacion || {};
      const proyecto = data.proyecto || data.project || {};

      setField('providerName', proveedor.nombre || proveedor.name);
      setField('providerBrand', proveedor.marca || proveedor.brand);
      setField('providerRuc', proveedor.ruc || proveedor.documento);
      setField('providerEmail', proveedor.correo || proveedor.email);
      setField('providerPhone', proveedor.telefono || proveedor.phone);
      setField('providerAddress', proveedor.direccion || proveedor.address);

      setField('clientName', cliente.nombre || cliente.name);
      setField('clientRuc', cliente.ruc || cliente.documento);
      setField('contactName', cliente.contacto || cliente.contactName);
      setField('contactEmail', cliente.correoTelefono || cliente.correo || cliente.email || cliente.telefono);
      setField('clientAddress', cliente.direccion || cliente.address);

      setField('quoteCode', documento.codigo || documento.code);
      setField('issueDate', documento.fechaEmision || documento.issueDate);
      setField('currency', allowedValue(documento.divisa || documento.currency, ['PEN', 'USD', 'EUR'], els.currency.value));
      setField('validity', documento.validez || documento.validity);
      setField('taxRate', documento.impuestoPorcentaje ?? documento.taxRate);
      setField('discountRate', documento.descuentoPorcentaje ?? documento.discountRate);
      setField('advanceAmount', documento.abonoInicial ?? documento.advanceAmount);
      setField('paymentMode', allowedValue(documento.formaPago || documento.paymentMode, ['upfront', 'advance_balance', 'final', 'deliverable', 'weekly'], els.paymentMode.value));
      setField('terms', documento.condiciones || documento.terms);

      setField('projectName', proyecto.nombre || proyecto.name);
      setField('projectType', proyecto.tipo || proyecto.type);
      setField('startDate', proyecto.fechaInicio || proyecto.startDate);
      setField('durationQty', proyecto.plazo ?? proyecto.durationQty);
      setField('durationUnit', allowedValue(proyecto.unidadPlazo || proyecto.durationUnit, ['days', 'weeks'], els.durationUnit.value));
      setField('scope', proyecto.alcanceGeneral || proyecto.scope);

      if (Array.isArray(data.items)) {
        state.items = data.items.map(item => ({
          name: item.concepto || item.name || '',
          description: item.descripcion || item.description || '',
          qty: Number(item.cantidad ?? item.qty ?? 1),
          price: Number(item.precio ?? item.price ?? 0),
          type: item.tipo || item.type || 'Desarrollo'
        }));
      }

      const importedSchedule = data.cronograma || data.schedule;
      const hasImportedSchedule = Array.isArray(importedSchedule);
      if (hasImportedSchedule) {
        state.schedule = importedSchedule.map(normalizeScheduleRow);
        renderSchedule();
      } else {
        updateDates();
      }

      renderItems();
      if (hasImportedSchedule && els.startDate.value) {
        const start = new Date(`${els.startDate.value}T00:00:00`);
        const qty = Math.max(1, Number(els.durationQty.value || 1));
        const days = els.durationUnit.value === 'weeks' ? qty * 7 : qty;
        els.endDate.value = toIsoDate(addDays(start, days));
        const unitLabel = els.durationUnit.value === 'weeks' ? (qty === 1 ? 'semana' : 'semanas') : (qty === 1 ? 'día' : 'días');
        els.deliveryPreview.textContent = `${formatDate(els.startDate.value)} al ${formatDate(els.endDate.value)} · ${qty} ${unitLabel}`;
      }
      calculate();
      els.jsonImportNotice.classList.remove('hidden');
      window.setTimeout(() => els.jsonImportNotice.classList.add('hidden'), 2200);
    }

    function copyImportPrompt() {
      navigator.clipboard?.writeText(els.aiPromptText.value).then(() => {
        els.jsonImportNotice.textContent = 'Prompt copiado.';
        els.jsonImportNotice.classList.remove('hidden');
        window.setTimeout(() => {
          els.jsonImportNotice.classList.add('hidden');
          els.jsonImportNotice.textContent = 'JSON importado correctamente.';
        }, 1800);
      });
    }

    

function paymentModeText() {
      const selected = els.paymentMode.options[els.paymentMode.selectedIndex];
      return selected ? selected.textContent : '—';
    }

    

function copySummary() {
      const totalValues = totals();
      const lines = [
        `Cotización: ${els.quoteCode.value || 'sin código'}`,
        `Proveedor: ${els.providerName.value || els.providerBrand.value || 'sin proveedor'}`,
        `Cliente: ${els.clientName.value || 'sin cliente'}`,
        `Proyecto: ${els.projectName.value || 'sin nombre'}`,
        `Entrega: ${els.deliveryPreview.textContent}`,
        `Subtotal: ${money(totalValues.subtotal)}`,
        `Impuesto: ${money(totalValues.tax)}`,
        `Total: ${money(totalValues.total)}`,
        `Abono inicial: ${money(totalValues.advance)}`,
        `Forma de pago: ${paymentModeText()}`
      ].join('\n');
      navigator.clipboard?.writeText(lines).then(() => {
        els.copyNotice.classList.remove('hidden');
        window.setTimeout(() => els.copyNotice.classList.add('hidden'), 1800);
      });
    }
