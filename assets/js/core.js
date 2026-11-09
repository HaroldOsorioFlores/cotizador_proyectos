function defaultItems() {
  return [
    { name: 'Discovery y definición de alcance', description: 'Levantamiento de objetivos, alcance funcional, riesgos y criterios de éxito.', qty: 1, price: 850, type: 'Estrategia' },
    { name: 'Diseño de experiencia', description: 'Flujos, pantallas o arquitectura de la solución según el tipo de proyecto.', qty: 1, price: 1600, type: 'Diseño' },
    { name: 'Desarrollo de la solución', description: 'Construcción, configuración e integraciones principales del proyecto.', qty: 1, price: 2400, type: 'Desarrollo' },
    { name: 'Integraciones, pruebas y entrega', description: 'Pruebas, ajustes, documentación, puesta en marcha y capacitación básica.', qty: 1, price: 950, type: 'Integración' }
  ];
}

const state = {
  items: defaultItems(),
  schedule: [],
  costs: []
};

const els = {};
const currencySymbols = { PEN: 'S/', USD: 'US$', EUR: '€' };
const STORAGE_KEY = 'cotizador-web-pro-cache-v1';
let pendingClearSection = null;
let activeDialog = null;

const sectionLabels = {
  commercial: 'Datos comerciales',
  finance: 'Documento y pago',
  items: 'Ítems cotizados',
  project: 'Proyecto y fechas',
  schedule: 'Cronograma y pagos',
  costs: 'Costos del proveedor'
};

const clearLabels = { ...sectionLabels, all: 'todos los datos' };

const sectionFields = {
  commercial: ['providerName', 'providerBrand', 'providerRuc', 'providerEmail', 'providerPhone', 'providerAddress', 'clientName', 'clientRuc', 'contactName', 'contactEmail', 'clientAddress'],
  finance: ['quoteTitle', 'quoteCode', 'issueDate', 'currency', 'validity', 'taxRate', 'discountRate', 'advanceAmount', 'paymentMode', 'terms'],
  project: ['projectName', 'projectType', 'startDate', 'durationQty', 'durationUnit', 'endDate', 'scope']
};

function readCache() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeCache(cache) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...cache, savedAt: new Date().toISOString() }));
  updateCacheState();
}

function saveAccent(color) {
  if (!/^#[0-9a-f]{6}$/i.test(String(color || ''))) return;
  const cache = readCache();
  cache.accent = color;
  writeCache(cache);
}

function valuesFor(fields) {
  return fields.reduce((data, id) => {
    if (els[id]) data[id] = els[id].value;
    return data;
  }, {});
}

function cloneItems() {
  return state.items.map(item => ({
    name: item.name || '',
    description: item.description || '',
    qty: Number(item.qty || 0),
    price: Number(item.price || 0),
    type: item.type || 'Desarrollo'
  }));
}

function cloneCosts() {
  return state.costs.map(cost => ({
    name: cost.name || '',
    amount: Number(cost.amount || 0),
    period: costPeriodValue(cost.period) || 'monthly'
  }));
}

function cloneSchedule() {
  return state.schedule.map((row, index) => ({
    week: Number(row.week || index + 1),
    etapa: Number(row.etapa || row.week || index + 1),
    date: row.date || '',
    deliverable: row.deliverable || '',
    amount: Number(row.amount || 0),
    manualDate: Boolean(row.manualDate)
  }));
}

function normalizeScheduleRow(row = {}, index = 0) {
  const order = Number(row.etapa ?? row.week ?? row.semana ?? index + 1);
  const date = row.date || row.fecha || '';
  return {
    week: order,
    etapa: order,
    date,
    deliverable: row.deliverable || row.entregable || '',
    amount: Number(row.amount ?? row.abono ?? 0),
    manualDate: Boolean(row.manualDate || date)
  };
}

function normalizeCostRow(row = {}) {
  return {
    name: String(row.name || row.concepto || ''),
    amount: Number(row.amount ?? row.monto ?? 0),
    period: costPeriodValue(row.period || row.periodicidad) || 'monthly'
  };
}

function applyValues(data = {}) {
  Object.entries(data).forEach(([id, value]) => {
    if (els[id] && value !== undefined && value !== null) els[id].value = value;
  });
}

function selectedCacheSections() {
  return [...document.querySelectorAll('.cache-section')].filter(input => input.checked).map(input => input.value);
}

function updateCacheState() {
  if (!els.cacheState) return;
  const cache = readCache();
  const savedSections = Array.isArray(cache.sections)
    ? cache.sections
    : Object.keys(sectionLabels).filter(key => Object.prototype.hasOwnProperty.call(cache, key));
  els.cacheState.textContent = savedSections.length ? `${savedSections.length} secciones` : 'Sin guardar';
}

function updateCacheAllState() {
  const checks = [...document.querySelectorAll('.cache-section')];
  if (!els.cacheAll || !checks.length) return;
  els.cacheAll.checked = checks.every(input => input.checked);
}

function applySavedCacheSelection(sections) {
  if (!Array.isArray(sections)) return;
  document.querySelectorAll('.cache-section').forEach(input => {
    input.checked = sections.includes(input.value);
  });
  updateCacheAllState();
}

function saveSelectedCache() {
  const sections = els.cacheAll?.checked ? Object.keys(sectionLabels) : selectedCacheSections();
  const cache = {
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#1f4d3a',
    sections
  };
  sections.forEach(section => {
    if (sectionFields[section]) cache[section] = valuesFor(sectionFields[section]);
    if (section === 'items') cache.items = cloneItems();
    if (section === 'schedule') cache.schedule = cloneSchedule();
    if (section === 'costs') cache.costs = cloneCosts();
  });
  writeCache(cache);
  showNotice(els.cacheNotice, 'Datos guardados.');
}

function loadSavedCache() {
  const cache = readCache();
  if (cache.accent) updateAccent(cache.accent);
  applySavedCacheSelection(cache.sections);
  Object.keys(sectionFields).forEach(section => applyValues(cache[section]));
  let restoredSchedule = false;
  if (Array.isArray(cache.items)) {
    state.items = cache.items.map(item => ({
      name: item.name || '',
      description: item.description || '',
      qty: Number(item.qty || 0),
      price: Number(item.price || 0),
      type: item.type || 'Desarrollo'
    }));
  }
  if (Array.isArray(cache.schedule)) {
    state.schedule = cache.schedule.map(normalizeScheduleRow);
    restoredSchedule = true;
  }
  if (Array.isArray(cache.costs)) {
    state.costs = cache.costs.map(normalizeCostRow);
  }
  updateCacheState();
  updateQuoteTitle();
  updateAdvanceLabel();
  return restoredSchedule;
}

function resetSection(section) {
  if (sectionFields[section]) {
    sectionFields[section].forEach(id => {
      if (els[id]) els[id].value = '';
    });
  }
  if (section === 'finance') {
    els.currency.value = 'PEN';
    els.taxRate.value = '18';
    els.discountRate.value = '0';
    els.advanceAmount.value = '0';
    els.paymentMode.value = 'advance_balance';
    updateQuoteTitle();
    updateAdvanceLabel();
  }
  if (section === 'items') {
    state.items = [];
    renderItems();
  }
  if (section === 'project') {
    els.durationQty.value = '4';
    els.durationUnit.value = 'weeks';
    updateDates();
  }
  if (section === 'schedule') {
    state.schedule = [];
    renderSchedule();
  }
  if (section === 'costs') {
    state.costs = [];
    renderCosts();
  }
  calculate();
}

function resetAllData() {
  localStorage.removeItem(STORAGE_KEY);
  Object.values(sectionFields).flat().forEach(id => {
    if (els[id] && id !== 'quoteTitle') els[id].value = '';
  });
  els.quoteTitle.value = 'Cotización de proyecto';
  els.issueDate.value = toIsoDate(new Date());
  els.currency.value = 'PEN';
  els.taxRate.value = '18';
  els.discountRate.value = '0';
  els.advanceAmount.value = '0';
  els.paymentMode.value = 'advance_balance';
  els.durationQty.value = '4';
  els.durationUnit.value = 'weeks';
  els.endDate.value = '';
  state.items = [];
  state.schedule = [];
  state.costs = [];
  renderItems();
  renderSchedule();
  renderCosts();
  updateQuoteTitle();
  updateAdvanceLabel();
  updateDeliveryPreview();
  calculate();
  updateCacheState();
}

function openClearModal(section) {
  pendingClearSection = section;
  const label = (clearLabels[section] || 'esta sección').toLowerCase();
  els.modalTitle.textContent = `Limpiar ${label}`;
  els.modalText.textContent = section === 'all'
    ? 'Se borrarán todos los datos visibles y la copia guardada en este equipo. Esta acción no se puede deshacer.'
    : 'Se limpiarán los datos visibles de esta sección y también su copia guardada en este equipo.';
  openDialog({
    shell: els.confirmModal,
    dialog: els.confirmModal.querySelector('.modal'),
    initialFocus: els.cancelClearBtn,
    trigger: document.activeElement,
    onClose: () => {
      pendingClearSection = null;
    }
  });
}

function confirmClearSection() {
  if (!pendingClearSection) {
    closeDialog();
    return;
  }
  const section = pendingClearSection;
  if (section === 'all') {
    resetAllData();
  } else {
    const cache = readCache();
    delete cache[section];
    if (Array.isArray(cache.sections)) cache.sections = cache.sections.filter(item => item !== section);
    writeCache(cache);
    resetSection(section);
    const checkbox = document.querySelector(`.cache-section[value='${section}']`);
    if (checkbox) checkbox.checked = false;
    updateCacheAllState();
    updateCacheState();
  }
  closeDialog();
}

function getFocusable(container) {
  return [...container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])')]
    .filter(element => element.offsetParent !== null);
}

function trapFocus(event, container) {
  const focusable = getFocusable(container);
  if (!focusable.length) {
    event.preventDefault();
    container.focus();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!container.contains(document.activeElement)) {
    event.preventDefault();
    first.focus();
    return;
  }
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function openDialog({ shell, dialog, initialFocus, trigger, onClose }) {
  if (activeDialog) closeDialog();
  const previous = trigger || document.activeElement;
  shell.classList.remove('hidden');
  shell.setAttribute('aria-hidden', 'false');
  document.body.classList.add('dialog-open');
  const onKeydown = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog();
      return;
    }
    if (event.key === 'Tab') trapFocus(event, dialog);
  };
  document.addEventListener('keydown', onKeydown);
  activeDialog = { shell, previous, onKeydown, onClose };
  window.setTimeout(() => {
    const target = initialFocus || getFocusable(dialog)[0] || dialog;
    target.focus();
  }, 0);
}

function closeDialog() {
  if (!activeDialog) return;
  const { shell, previous, onKeydown, onClose } = activeDialog;
  document.removeEventListener('keydown', onKeydown);
  shell.classList.add('hidden');
  shell.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('dialog-open');
  activeDialog = null;
  if (typeof onClose === 'function') onClose();
  if (previous && previous.isConnected && previous.offsetParent !== null) {
    previous.focus();
  } else if (els.importJsonTopBtn) {
    els.importJsonTopBtn.focus();
  }
}

function showNotice(element, message, duration = 2000) {
  if (!element) return;
  if (message) element.textContent = message;
  element.classList.remove('hidden');
  window.clearTimeout(element.noticeTimer);
  if (duration > 0) {
    element.noticeTimer = window.setTimeout(() => element.classList.add('hidden'), duration);
  }
}

function showError(element, message) {
  if (!element) return;
  element.textContent = message;
  element.classList.remove('hidden');
}

function escapeHtml(value) {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', [String.fromCharCode(34)]: '&quot;' };
  return String(value ?? '').replace(/[&<>'\u0022]/g, char => entities[char]);
}

function money(value) {
  const symbol = currencySymbols[els.currency.value] || 'S/';
  return `${symbol} ${Number(value || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function pdfMoney(value) {
  return money(value);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + Number(days || 0));
  return next;
}

function toIsoDate(date) {
  if (!date || Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  if (!value) return '—';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
  if (!match) return '—';
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (Number.isNaN(date.getTime()) || date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return '—';
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function updateAccent(color) {
  if (!/^#[0-9a-f]{6}$/i.test(String(color || ''))) return;
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--accent-soft', `${color}1a`);
  if (els.customColor) els.customColor.value = color;
  document.querySelectorAll('.theme-dot').forEach(btn => {
    const active = btn.dataset.color === color;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

function updateAdvanceLabel() {
  if (!els.advanceLabel) return;
  const symbol = currencySymbols[els.currency.value] || 'S/';
  els.advanceLabel.textContent = `Abono inicial opcional (${symbol})`;
}

function updateQuoteTitle() {
  const title = String(els.quoteTitle?.value || '').trim() || 'Cotización de proyecto';
  document.title = `${title} · Cotizador Pro`;
  if (els.summaryTitle) els.summaryTitle.textContent = title;
}

function effectiveAdvance(totalValues) {
  const mode = els.paymentMode.value;
  if (mode === 'upfront') return totalValues.total;
  if (mode === 'final') return 0;
  return totalValues.advance;
}

function totals() {
  const subtotal = state.items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0);
  const discount = subtotal * (Math.max(0, Number(els.discountRate.value || 0)) / 100);
  const taxable = Math.max(0, subtotal - discount);
  const tax = taxable * (Math.max(0, Number(els.taxRate.value || 0)) / 100);
  const total = taxable + tax;
  const advance = Math.min(total, Math.max(0, Number(els.advanceAmount.value || 0)));
  return { subtotal, discount, taxable, tax, total, advance, balance: total - advance };
}

function projectMonths() {
  const qty = Math.max(1, Number(els.durationQty?.value || 1));
  const days = els.durationUnit?.value === 'days' ? qty : qty * 7;
  // shortcut: mes de 30 días y mínimo 1 mes para no subestimar suscripciones.
  return Math.max(1, Math.round((days / 30) * 100) / 100);
}

function costPeriodValue(value) {
  const normalized = String(value ?? '').trim().toLowerCase();
  const aliases = {
    monthly: 'monthly',
    mensual: 'monthly',
    mes: 'monthly',
    meses: 'monthly',
    annual: 'annual',
    anual: 'annual',
    year: 'annual',
    yearly: 'annual',
    ano: 'annual',
    'año': 'annual',
    one_time: 'one_time',
    'one-time': 'one_time',
    unico: 'one_time',
    'único': 'one_time'
  };
  return aliases[normalized] || '';
}

function costRowTotal(cost, months = projectMonths()) {
  const amount = Math.max(0, Number(cost?.amount || 0));
  if (cost?.period === 'annual') return amount * (months / 12);
  if (cost?.period === 'monthly') return amount * months;
  return amount;
}

function costTotals() {
  const months = projectMonths();
  const total = state.costs.reduce((sum, cost) => sum + costRowTotal(cost, months), 0);
  return { total, months };
}
