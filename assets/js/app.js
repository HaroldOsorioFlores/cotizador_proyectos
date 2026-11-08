function resetExample() {
      state.items = [
        { name: 'Discovery y arquitectura de información', description: 'Levantamiento de objetivos, mapa de secciones, definición de alcance funcional y criterios de éxito.', qty: 1, price: 850, type: 'Estrategia' },
        { name: 'Diseño UI responsive', description: 'Diseño visual de interfaz para desktop, tablet y móvil con sistema de componentes base.', qty: 1, price: 1600, type: 'Diseño' },
        { name: 'Desarrollo frontend con Tailwind', description: 'Implementación responsive, componentes reutilizables, estados interactivos y optimización básica.', qty: 1, price: 2400, type: 'Desarrollo' },
        { name: 'Integraciones y QA', description: 'Formulario de contacto, analítica, SEO técnico inicial, pruebas responsive y entrega documentada.', qty: 1, price: 950, type: 'Integración' }
      ];
      renderItems();
      syncSchedule(true);
      calculate();
    }

    function initDefaults() {
      const today = new Date();
      els.issueDate.value = toIsoDate(today);
      els.startDate.value = toIsoDate(addDays(today, 3));
      els.scope.value = 'Desarrollo de una solución web responsive con diseño claro, estructura administrable según alcance definido, entrega documentada, pruebas en navegadores modernos y acompañamiento inicial.';
      updateDates();
    }

    function init() {
      [
        'customColor', 'importJsonTopBtn', 'jsonImportSection', 'aiPromptText', 'jsonInput', 'copyPromptBtn', 'importJsonBtn', 'jsonImportNotice',
        'pdfBtn', 'pdfBtnAside', 'providerName', 'providerBrand', 'providerRuc', 'providerEmail', 'providerPhone', 'providerAddress',
        'clientName', 'clientRuc', 'contactName', 'contactEmail', 'clientAddress', 'quoteCode', 'issueDate', 'currency', 'validity',
        'taxRate', 'discountRate', 'advanceAmount', 'paymentMode', 'terms', 'itemsList', 'projectName', 'projectType',
        'startDate', 'durationQty', 'durationUnit', 'endDate', 'scope', 'scheduleList',
        'itemCount', 'weekCount', 'heroTotal', 'clientPreview', 'subtotal', 'discount', 'taxable', 'tax', 'grandTotal', 'advance',
        'balance', 'deliveryPreview', 'copyNotice', 'pdfNotice', 'cacheState', 'cacheAll', 'saveCacheBtn', 'cacheNotice',
        'confirmModal', 'modalTitle', 'modalText', 'cancelClearBtn', 'confirmClearBtn'
      ].forEach(id => els[id] = document.getElementById(id));

      document.querySelectorAll('button:not([type])').forEach(btn => { btn.type = 'button'; });
      document.querySelectorAll('.theme-dot').forEach(btn => btn.addEventListener('click', () => updateAccent(btn.dataset.color)));
      els.customColor.addEventListener('input', event => updateAccent(event.target.value));
      document.querySelectorAll('input, textarea, select').forEach(input => input.addEventListener('input', calculate));
      ['startDate', 'durationQty', 'durationUnit'].forEach(id => els[id].addEventListener('input', updateDates));
      els.durationUnit.addEventListener('change', () => syncSchedule(true));
      els.paymentMode.addEventListener('change', calculate);
      document.getElementById('addItemBtn').addEventListener('click', () => addItem());
      document.getElementById('duplicateBtn').addEventListener('click', () => addItem({ ...(state.items[state.items.length - 1] || { name: '', description: '', qty: 1, price: 0, type: 'Desarrollo' }) }));
      document.getElementById('copyBtn').addEventListener('click', copySummary);
      document.getElementById('addScheduleStageBtn').addEventListener('click', addScheduleStage);
      document.getElementById('syncScheduleBtn').addEventListener('click', () => syncSchedule(true));
      document.getElementById('distributeScheduleBtn').addEventListener('click', distributeSchedulePayments);
      document.getElementById('resetBtn').addEventListener('click', resetExample);
      els.importJsonTopBtn.addEventListener('click', () => window.scrollTo({ top: els.jsonImportSection.offsetTop - 96, behavior: 'smooth' }));
      els.copyPromptBtn.addEventListener('click', copyImportPrompt);
      els.importJsonBtn.addEventListener('click', importJsonData);
      els.cacheAll.addEventListener('change', event => {
        document.querySelectorAll('.cache-section').forEach(input => { input.checked = event.target.checked; });
      });
      document.querySelectorAll('.cache-section').forEach(input => input.addEventListener('change', updateCacheAllState));
      document.querySelectorAll('.clear-section-btn').forEach(btn => btn.addEventListener('click', () => openClearModal(btn.dataset.section)));
      els.saveCacheBtn.addEventListener('click', saveSelectedCache);
      els.cancelClearBtn.addEventListener('click', closeClearModal);
      els.confirmClearBtn.addEventListener('click', confirmClearSection);
      els.confirmModal.addEventListener('click', event => {
        if (event.target === els.confirmModal) closeClearModal();
      });
      els.pdfBtn.addEventListener('click', generatePdf);
      els.pdfBtnAside.addEventListener('click', generatePdf);
      initDefaults();
      const restoredSchedule = loadSavedCache();
      renderItems();
      renderSchedule();
      if (restoredSchedule) updateDeliveryPreview();
      else updateDates();
      calculate();
    }

    init();
