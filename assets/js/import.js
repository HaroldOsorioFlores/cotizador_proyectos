const ALLOWED_CURRENCIES = ['PEN', 'USD', 'EUR'];
const ALLOWED_PAYMENTS = ['upfront', 'advance_balance', 'final', 'deliverable', 'weekly'];
const ALLOWED_UNITS = ['days', 'weeks'];

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function pick(source, keys) {
  if (!source) return undefined;
  for (const key of keys) {
    if (source[key] !== undefined) return source[key];
  }
  return undefined;
}

function asObject(value, label, errors) {
  if (value === undefined) return {};
  if (!isPlainObject(value)) {
    errors.push(`${label} debe ser un objeto.`);
    return {};
  }
  return value;
}

function asText(value, label, errors, max = 500) {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' && typeof value !== 'number') {
    errors.push(`${label} debe ser texto.`);
    return '';
  }
  const text = String(value).trim();
  if (text.length > max) {
    errors.push(`${label} no puede superar ${max} caracteres.`);
    return '';
  }
  return text;
}

function asNumber(value, label, errors, { min = 0, max = 100000000, fallback = 0 } = {}) {
  if (value === undefined) return undefined;
  if (value === null) {
    errors.push(`${label} no puede ser null.`);
    return fallback;
  }
  if (value === '') return fallback;
  if (typeof value === 'boolean') {
    errors.push(`${label} debe ser un número.`);
    return fallback;
  }
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) {
    errors.push(`${label} debe ser un número entre ${min} y ${max}.`);
    return fallback;
  }
  return number;
}

function asInt(value, label, errors, { min = 1, max = 520, fallback = 1 } = {}) {
  const number = asNumber(value, label, errors, { min, max, fallback });
  return number === undefined ? undefined : Math.round(number);
}

function asDate(value, label, errors) {
  if (value === undefined) return undefined;
  if (value === null) {
    errors.push(`${label} no puede ser null.`);
    return '';
  }
  if (value === '') return '';
  const text = String(value).trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) {
    errors.push(`${label} debe usar el formato YYYY-MM-DD.`);
    return '';
  }
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (Number.isNaN(date.getTime()) || date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    errors.push(`${label} no es una fecha válida.`);
    return '';
  }
  return text;
}

function asEnum(value, allowed, label, errors, fallback) {
  if (value === undefined) return undefined;
  if (value === null) {
    errors.push(`${label} no puede ser null.`);
    return fallback;
  }
  if (value === '') return fallback;
  if (!allowed.includes(value)) {
    errors.push(`${label} debe ser uno de: ${allowed.join(', ')}.`);
    return fallback;
  }
  return value;
}

function setField(id, value) {
  if (els[id] && value !== undefined && value !== null) els[id].value = value;
}

function allowedValue(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function showImportErrors(errors) {
  if (!els.jsonImportError) return;
  els.jsonImportError.innerHTML = '';
  const title = document.createElement('strong');
  title.textContent = 'Revisa estos datos antes de importar:';
  const list = document.createElement('ul');
  errors.slice(0, 8).forEach(message => {
    const item = document.createElement('li');
    item.textContent = message;
    list.appendChild(item);
  });
  if (errors.length > 8) {
    const item = document.createElement('li');
    item.textContent = `Y ${errors.length - 8} problema(s) más.`;
    list.appendChild(item);
  }
  els.jsonImportError.append(title, list);
  els.jsonImportError.classList.remove('hidden');
  els.jsonImportError.setAttribute('tabindex', '-1');
  els.jsonImportError.focus();
}

function importJsonData() {
  let data;
  try {
    data = JSON.parse(els.jsonInput.value.trim());
  } catch {
    showImportErrors(['El JSON no es válido. Revisa comillas, comas y llaves.']);
    return;
  }

  const errors = [];
  if (!isPlainObject(data)) {
    showImportErrors(['El JSON debe ser un objeto.']);
    return;
  }

  const proveedor = asObject(pick(data, ['proveedor', 'provider']), 'El proveedor', errors);
  const cliente = asObject(pick(data, ['cliente', 'client']), 'El cliente', errors);
  const documento = asObject(pick(data, ['documento', 'finance', 'cotizacion']), 'El documento', errors);
  const proyecto = asObject(pick(data, ['proyecto', 'project']), 'El proyecto', errors);

  const updates = {};
  const set = (id, value) => {
    if (value !== undefined) updates[id] = value;
  };

  const documentTitle = pick(documento, ['titulo', 'title']);
  set('quoteTitle', asText(documentTitle !== undefined ? documentTitle : pick(data, ['titulo', 'title']), 'El título', errors, 160));
  set('quoteCode', asText(pick(documento, ['codigo', 'code']), 'El código', errors, 60));
  set('issueDate', asDate(pick(documento, ['fechaEmision', 'issueDate']), 'La fecha de emisión', errors));
  set('currency', asEnum(pick(documento, ['divisa', 'currency']), ALLOWED_CURRENCIES, 'La divisa', errors, els.currency.value));
  set('validity', asText(pick(documento, ['validez', 'validity']), 'La validez', errors, 80));
  set('taxRate', asNumber(pick(documento, ['impuestoPorcentaje', 'taxRate']), 'El impuesto', errors, { min: 0, max: 100, fallback: 18 }));
  set('discountRate', asNumber(pick(documento, ['descuentoPorcentaje', 'discountRate']), 'El descuento', errors, { min: 0, max: 100, fallback: 0 }));
  set('advanceAmount', asNumber(pick(documento, ['abonoInicial', 'advanceAmount']), 'El abono inicial', errors, { min: 0, max: 100000000, fallback: 0 }));
  set('paymentMode', asEnum(pick(documento, ['formaPago', 'paymentMode']), ALLOWED_PAYMENTS, 'La forma de pago', errors, els.paymentMode.value));
  set('terms', asText(pick(documento, ['condiciones', 'terms']), 'Las condiciones', errors, 5000));

  set('providerName', asText(pick(proveedor, ['nombre', 'name']), 'El nombre del proveedor', errors, 160));
  set('providerBrand', asText(pick(proveedor, ['marca', 'brand']), 'La marca del proveedor', errors, 160));
  set('providerRuc', asText(pick(proveedor, ['ruc', 'documento']), 'El documento del proveedor', errors, 40));
  set('providerEmail', asText(pick(proveedor, ['correo', 'email']), 'El correo del proveedor', errors, 160));
  set('providerPhone', asText(pick(proveedor, ['telefono', 'phone']), 'El teléfono del proveedor', errors, 40));
  set('providerAddress', asText(pick(proveedor, ['direccion', 'address']), 'La dirección del proveedor', errors, 200));

  set('clientName', asText(pick(cliente, ['nombre', 'name']), 'El nombre del cliente', errors, 160));
  set('clientRuc', asText(pick(cliente, ['ruc', 'documento']), 'El documento del cliente', errors, 40));
  set('contactName', asText(pick(cliente, ['contacto', 'contactName']), 'El contacto del cliente', errors, 160));
  set('contactEmail', asText(pick(cliente, ['correoTelefono', 'correo', 'email', 'telefono']), 'El correo o teléfono del cliente', errors, 160));
  set('clientAddress', asText(pick(cliente, ['direccion', 'address']), 'La dirección del cliente', errors, 200));

  set('projectName', asText(pick(proyecto, ['nombre', 'name']), 'El nombre del proyecto', errors, 160));
  set('projectType', asText(pick(proyecto, ['tipo', 'type']), 'El tipo de proyecto', errors, 120));
  set('startDate', asDate(pick(proyecto, ['fechaInicio', 'startDate']), 'La fecha de inicio', errors));
  set('durationQty', asInt(pick(proyecto, ['plazo', 'durationQty']), 'El plazo', errors, { min: 1, max: 520, fallback: 4 }));
  set('durationUnit', asEnum(pick(proyecto, ['unidadPlazo', 'durationUnit']), ALLOWED_UNITS, 'La unidad de plazo', errors, els.durationUnit.value));
  set('scope', asText(pick(proyecto, ['alcanceGeneral', 'scope']), 'El alcance', errors, 5000));

  let normalizedItems = null;
  if (data.items !== undefined) {
    if (!Array.isArray(data.items)) {
      errors.push('Los ítems deben ser una lista.');
    } else {
      normalizedItems = data.items.map((item, index) => {
        const label = `El ítem ${index + 1}`;
        if (!isPlainObject(item)) {
          errors.push(`${label} debe ser un objeto.`);
          return null;
        }
        const name = asText(pick(item, ['concepto', 'name']), `${label}: concepto`, errors, 200);
        const description = asText(pick(item, ['descripcion', 'description']), `${label}: descripción`, errors, 1000);
        const qty = asNumber(pick(item, ['cantidad', 'qty']), `${label}: cantidad`, errors, { min: 0, max: 100000, fallback: 1 });
        const price = asNumber(pick(item, ['precio', 'price']), `${label}: precio`, errors, { min: 0, max: 100000000, fallback: 0 });
        const type = asText(pick(item, ['tipo', 'type']), `${label}: tipo`, errors, 60);
        return {
          name: name || '',
          description: description || '',
          qty: qty ?? 1,
          price: price ?? 0,
          type: type || 'Desarrollo'
        };
      }).filter(Boolean);
    }
  }

  let normalizedSchedule = null;
  if (data.cronograma !== undefined || data.schedule !== undefined) {
    const rawSchedule = pick(data, ['cronograma', 'schedule']);
    if (!Array.isArray(rawSchedule)) {
      errors.push('El cronograma debe ser una lista.');
    } else {
      normalizedSchedule = rawSchedule.map((row, index) => {
        const label = `La etapa ${index + 1}`;
        if (!isPlainObject(row)) {
          errors.push(`${label} debe ser un objeto.`);
          return null;
        }
        const date = asDate(pick(row, ['fecha', 'date']), `${label}: fecha`, errors);
        const deliverable = asText(pick(row, ['entregable', 'deliverable']), `${label}: entregable`, errors, 300);
        const amount = asNumber(pick(row, ['abono', 'amount']), `${label}: abono`, errors, { min: 0, max: 100000000, fallback: 0 });
        const stage = asInt(pick(row, ['etapa', 'week']), `${label}: número`, errors, { min: 1, max: 520, fallback: index + 1 });
        return {
          week: stage ?? index + 1,
          etapa: stage ?? index + 1,
          date: date || '',
          deliverable: deliverable || '',
          amount: amount ?? 0,
          manualDate: Boolean(date)
        };
      }).filter(Boolean);
    }
  }

  if (errors.length) {
    if (els.jsonImportNotice) els.jsonImportNotice.classList.add('hidden');
    showImportErrors(errors);
    return;
  }

  if (els.jsonImportError) els.jsonImportError.classList.add('hidden');
  Object.entries(updates).forEach(([id, value]) => setField(id, value));
  if (normalizedItems !== null) {
    state.items = normalizedItems;
    renderItems();
  }
  if (normalizedSchedule !== null) {
    state.schedule = normalizedSchedule;
    renderSchedule();
    updateDeliveryPreview();
  } else {
    updateDates();
  }
  updateQuoteTitle();
  updateAdvanceLabel();
  calculate();
  showNotice(els.jsonImportNotice, 'JSON importado correctamente.', 2600);
}

function setImportTab(tab) {
  const isPrompt = tab === 'prompt';
  if (!els.promptTab || !els.jsonTab) return;
  els.promptTab.classList.toggle('is-active', isPrompt);
  els.jsonTab.classList.toggle('is-active', !isPrompt);
  els.promptTab.setAttribute('aria-selected', String(isPrompt));
  els.jsonTab.setAttribute('aria-selected', String(!isPrompt));
  els.promptPanel.classList.toggle('hidden', !isPrompt);
  els.jsonPanel.classList.toggle('hidden', isPrompt);
  if (!isPrompt) els.jsonInput.focus();
}

function openImportDrawer(trigger) {
  [els.jsonImportError, els.jsonImportNotice, els.promptNotice, els.promptError].forEach(element => {
    if (element) element.classList.add('hidden');
  });
  openDialog({
    shell: els.importDrawer,
    dialog: els.importDrawer.querySelector('.drawer'),
    initialFocus: els.promptTab,
    trigger: trigger || els.importJsonTopBtn,
    onClose: () => {}
  });
}

function closeImportDrawer() {
  closeDialog();
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('copy failed');
}

async function copyText(text, successElement, errorElement, successMessage) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      fallbackCopy(text);
    }
    if (errorElement) errorElement.classList.add('hidden');
    showNotice(successElement, successMessage);
    return true;
  } catch {
    if (successElement) successElement.classList.add('hidden');
    showError(errorElement, 'No se pudo copiar. Selecciona el texto y copia manualmente.');
    return false;
  }
}

function copyImportPrompt() {
  copyText(els.aiPromptText.value, els.promptNotice, els.promptError, 'Prompt copiado.');
}

function paymentModeText() {
  const selected = els.paymentMode.options[els.paymentMode.selectedIndex];
  return selected ? selected.textContent : '—';
}

function copySummary() {
  const totalValues = totals();
  const advance = effectiveAdvance(totalValues);
  const scheduled = state.schedule.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const mode = els.paymentMode.value;
  const balance = mode === 'deliverable' || mode === 'weekly'
    ? Math.max(0, totalValues.total - advance - scheduled)
    : Math.max(0, totalValues.total - advance);
  const lines = [
    `Título: ${els.quoteTitle.value.trim() || 'Cotización de proyecto'}`,
    `Cotización: ${els.quoteCode.value || 'sin código'}`,
    `Proveedor: ${els.providerName.value || els.providerBrand.value || 'sin proveedor'}`,
    `Cliente: ${els.clientName.value || 'sin cliente'}`,
    `Proyecto: ${els.projectName.value || 'sin nombre'}`,
    `Entrega: ${els.deliveryPreview.textContent}`,
    `Subtotal: ${money(totalValues.subtotal)}`,
    `Descuento: ${money(totalValues.discount)}`,
    `Impuesto: ${money(totalValues.tax)}`,
    `Total: ${money(totalValues.total)}`,
    `Abono inicial: ${money(advance)}`,
    `Saldo: ${money(balance)}`,
    `Forma de pago: ${paymentModeText()}`
  ].join('\n');
  copyText(lines, els.copyNotice, els.copyError, 'Resumen copiado.');
}
