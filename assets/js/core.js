const state = {
      items: [
        { name: 'Discovery y arquitectura de información', description: 'Levantamiento de objetivos, mapa de secciones, definición de alcance funcional y criterios de éxito.', qty: 1, price: 850, type: 'Estrategia' },
        { name: 'Diseño UI responsive', description: 'Diseño visual de interfaz para desktop, tablet y móvil con sistema de componentes base.', qty: 1, price: 1600, type: 'Diseño' },
        { name: 'Desarrollo frontend con Tailwind', description: 'Implementación responsive, componentes reutilizables, estados interactivos y optimización básica.', qty: 1, price: 2400, type: 'Desarrollo' },
        { name: 'Integraciones y QA', description: 'Formulario de contacto, analítica, SEO técnico inicial, pruebas responsive y entrega documentada.', qty: 1, price: 950, type: 'Integración' }
      ],
      schedule: []
    };

    const els = {};
    const currencySymbols = { PEN: 'S/', USD: 'US$', EUR: '€' };
    const STORAGE_KEY = 'cotizador-web-pro-cache-v1';
    let pendingClearSection = null;
    const sectionLabels = {
      commercial: 'Datos comerciales',
      finance: 'Divisa, impuestos y documento',
      items: 'Ítems cotizados',
      project: 'Alcance general y fechas',
      schedule: 'Etapas y pagos'
    };
    const sectionFields = {
      commercial: ['providerName', 'providerBrand', 'providerRuc', 'providerEmail', 'providerPhone', 'providerAddress', 'clientName', 'clientRuc', 'contactName', 'contactEmail', 'clientAddress'],
      finance: ['quoteCode', 'issueDate', 'currency', 'validity', 'taxRate', 'discountRate', 'advanceAmount', 'paymentMode', 'terms'],
      project: ['projectName', 'projectType', 'startDate', 'durationQty', 'durationUnit', 'endDate', 'scope']
    };

    function readCache() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      } catch {
        return {};
      }
    }

    function writeCache(cache) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...cache, savedAt: new Date().toISOString() }));
      updateCacheState();
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

    function cloneSchedule() {
      return state.schedule.map((row, index) => ({
        week: Number(row.week || index + 1),
        etapa: Number(row.etapa || row.week || index + 1),
        date: row.date || '',
        deliverable: row.deliverable || '',
        amount: Number(row.amount || 0)
      }));
    }

    function normalizeScheduleRow(row = {}, index = 0) {
      const order = Number(row.etapa ?? row.week ?? row.semana ?? index + 1);
      return {
        week: order,
        etapa: order,
        date: row.date || row.fecha || '',
        deliverable: row.deliverable || row.entregable || '',
        amount: Number(row.amount ?? row.abono ?? 0)
      };
    }

    function applyValues(data = {}) {
      Object.entries(data).forEach(([id, value]) => {
        if (els[id]) els[id].value = value;
      });
    }

    function selectedCacheSections() {
      return [...document.querySelectorAll('.cache-section')].filter(input => input.checked).map(input => input.value);
    }

    function updateCacheState() {
      if (!els.cacheState) return;
      const cache = readCache();
      const savedSections = Array.isArray(cache.sections) ? cache.sections : Object.keys(sectionLabels).filter(key => Object.prototype.hasOwnProperty.call(cache, key));
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
        accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2563eb',
        sections
      };
      sections.forEach(section => {
        if (sectionFields[section]) cache[section] = valuesFor(sectionFields[section]);
        if (section === 'items') cache.items = cloneItems();
        if (section === 'schedule') cache.schedule = cloneSchedule();
      });
      writeCache(cache);
      els.cacheNotice.classList.remove('hidden');
      window.setTimeout(() => els.cacheNotice.classList.add('hidden'), 1800);
    }

    function loadSavedCache() {
      const cache = readCache();
      if (cache.accent) updateAccent(cache.accent);
      applySavedCacheSelection(cache.sections);
      Object.keys(sectionFields).forEach(section => applyValues(cache[section]));
      let restoredSchedule = false;
      if (Array.isArray(cache.items)) state.items = cache.items.map(item => ({
        name: item.name || '',
        description: item.description || '',
        qty: Number(item.qty || 0),
        price: Number(item.price || 0),
        type: item.type || 'Desarrollo'
      }));
      if (Array.isArray(cache.schedule)) {
        state.schedule = cache.schedule.map(normalizeScheduleRow);
        restoredSchedule = true;
      }
      updateCacheState();
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
      calculate();
    }

    function openClearModal(section) {
      pendingClearSection = section;
      els.modalTitle.textContent = `Limpiar ${sectionLabels[section] || 'sección'}`;
      els.modalText.textContent = 'Se limpiarán los datos visibles de esta sección y también su copia guardada en este equipo.';
      els.confirmModal.classList.remove('hidden');
      els.confirmModal.classList.add('flex');
    }

    function closeClearModal() {
      pendingClearSection = null;
      els.confirmModal.classList.add('hidden');
      els.confirmModal.classList.remove('flex');
    }

    function confirmClearSection() {
      if (!pendingClearSection) return;
      const cache = readCache();
      delete cache[pendingClearSection];
      if (Array.isArray(cache.sections)) cache.sections = cache.sections.filter(section => section !== pendingClearSection);
      writeCache(cache);
      resetSection(pendingClearSection);
      closeClearModal();
    }

    function escapeHtml(value) {
      return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
    }

    function money(value) {
      const symbol = currencySymbols[els.currency.value] || 'S/';
      return `${symbol} ${Number(value || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function pdfMoney(value) {
      return money(value).replace('S/', 'S/.');
    }

    function addDays(date, days) {
      const next = new Date(date);
      next.setDate(next.getDate() + Number(days || 0));
      return next;
    }

    function toIsoDate(date) {
      if (!date || Number.isNaN(date.getTime())) return '';
      return date.toISOString().slice(0, 10);
    }

    function formatDate(value) {
      if (!value) return '—';
      const date = new Date(`${value}T00:00:00`);
      return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    function updateAccent(color) {
      document.documentElement.style.setProperty('--accent', color);
      document.documentElement.style.setProperty('--accent-soft', `${color}18`);
      els.customColor.value = color;
      document.querySelectorAll('.theme-dot').forEach(btn => {
        btn.classList.toggle('ring-2', btn.dataset.color === color);
        btn.classList.toggle('ring-offset-2', btn.dataset.color === color);
      });
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
