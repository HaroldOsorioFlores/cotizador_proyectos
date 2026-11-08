function resetExample() {
  state.items = defaultItems();
  renderItems();
  syncSchedule(true);
  calculate();
}

function initDefaults() {
  const today = new Date();
  els.issueDate.value = toIsoDate(today);
  els.startDate.value = toIsoDate(addDays(today, 3));
  els.quoteTitle.value = els.quoteTitle.value || 'Cotización de proyecto';
  els.quoteCode.value = els.quoteCode.value || 'COT-001';
  els.projectType.value = els.projectType.value || 'Proyecto digital';
  els.scope.value = els.scope.value || 'Desarrollo de una solución digital a medida con alcance definido, entregables claros, pruebas, puesta en marcha y acompañamiento inicial.';
  updateQuoteTitle();
  updateAdvanceLabel();
}

function init() {
  [
    'customColor', 'importJsonTopBtn', 'saveCacheTopBtn', 'pdfBtn', 'quoteTitle', 'docStatus', 'quoteMeta',
    'providerName', 'providerBrand', 'providerRuc', 'providerEmail', 'providerPhone', 'providerAddress',
    'clientName', 'clientRuc', 'contactName', 'contactEmail', 'clientAddress',
    'quoteCode', 'issueDate', 'currency', 'validity', 'taxRate', 'discountRate', 'advanceAmount', 'paymentMode', 'terms',
    'advanceLabel', 'paymentHelp', 'addItemBtn', 'duplicateBtn', 'itemsList', 'itemsEmpty',
    'projectName', 'projectType', 'startDate', 'durationQty', 'durationUnit', 'endDate', 'scope',
    'addScheduleStageBtn', 'distributeScheduleBtn', 'syncScheduleBtn', 'scheduleWarning', 'scheduleList', 'scheduleEmpty',
    'summaryPanel', 'summaryTitle', 'itemCount', 'weekCount', 'clientPreview', 'heroTotal', 'subtotal', 'discount',
    'taxable', 'tax', 'grandTotal', 'advance', 'balance', 'deliveryPreview', 'completionList',
    'copyBtn', 'pdfBtnAside', 'copyNotice', 'copyError', 'pdfNotice', 'cacheState', 'cacheAll', 'saveCacheBtn',
    'clearAllCacheBtn', 'cacheNotice', 'mobileTotal', 'mobileSummaryBtn', 'mobilePdfBtn',
    'importDrawer', 'closeImportDrawerBtn', 'promptTab', 'jsonTab', 'promptPanel', 'jsonPanel', 'aiPromptText',
    'copyPromptBtn', 'promptNotice', 'promptError', 'jsonInput', 'jsonImportError', 'jsonImportNotice', 'importJsonBtn',
    'confirmModal', 'modalTitle', 'modalText', 'cancelClearBtn', 'confirmClearBtn', 'resetBtn'
  ].forEach(id => {
    els[id] = document.getElementById(id);
  });

  document.querySelectorAll('button:not([type])').forEach(btn => {
    btn.type = 'button';
  });

  document.querySelectorAll('.theme-dot').forEach(btn => {
    btn.addEventListener('click', () => {
      updateAccent(btn.dataset.color);
      saveAccent(btn.dataset.color);
    });
  });
  els.customColor.addEventListener('input', event => updateAccent(event.target.value));
  els.customColor.addEventListener('change', event => {
    updateAccent(event.target.value);
    saveAccent(event.target.value);
  });

  document.querySelectorAll('input, textarea, select').forEach(input => {
    if (input.id === 'quoteTitle') return;
    input.addEventListener('input', calculate);
  });
  els.quoteTitle.addEventListener('input', () => {
    updateQuoteTitle();
    calculate();
  });
  ['startDate', 'durationQty', 'durationUnit'].forEach(id => {
    els[id].addEventListener('input', updateDates);
  });

  document.getElementById('addItemBtn').addEventListener('click', () => addItem());
  document.getElementById('duplicateBtn').addEventListener('click', () => {
    const last = state.items[state.items.length - 1] || { name: '', description: '', qty: 1, price: 0, type: 'Desarrollo' };
    addItem({ ...last });
  });
  document.getElementById('copyBtn').addEventListener('click', copySummary);
  document.getElementById('addScheduleStageBtn').addEventListener('click', addScheduleStage);
  document.getElementById('syncScheduleBtn').addEventListener('click', () => syncSchedule(true));
  document.getElementById('distributeScheduleBtn').addEventListener('click', distributeSchedulePayments);
  document.getElementById('resetBtn').addEventListener('click', resetExample);

  els.importJsonTopBtn.addEventListener('click', () => openImportDrawer(els.importJsonTopBtn));
  els.saveCacheTopBtn.addEventListener('click', saveSelectedCache);
  els.copyPromptBtn.addEventListener('click', copyImportPrompt);
  els.importJsonBtn.addEventListener('click', importJsonData);
  els.closeImportDrawerBtn.addEventListener('click', closeDialog);
  els.promptTab.addEventListener('click', () => setImportTab('prompt'));
  els.jsonTab.addEventListener('click', () => setImportTab('json'));
  els.importDrawer.querySelector('[data-close-drawer]').addEventListener('click', closeDialog);

  els.cacheAll.addEventListener('change', event => {
    document.querySelectorAll('.cache-section').forEach(input => {
      input.checked = event.target.checked;
    });
  });
  document.querySelectorAll('.cache-section').forEach(input => input.addEventListener('change', updateCacheAllState));
  document.querySelectorAll('.clear-section-btn').forEach(btn => {
    btn.addEventListener('click', () => openClearModal(btn.dataset.section));
  });
  els.saveCacheBtn.addEventListener('click', saveSelectedCache);
  els.clearAllCacheBtn.addEventListener('click', () => openClearModal('all'));
  els.cancelClearBtn.addEventListener('click', closeDialog);
  els.confirmClearBtn.addEventListener('click', confirmClearSection);
  els.confirmModal.querySelector('[data-close-modal]').addEventListener('click', closeDialog);

  els.pdfBtn.addEventListener('click', generatePdf);
  els.pdfBtnAside.addEventListener('click', generatePdf);
  els.mobilePdfBtn.addEventListener('click', generatePdf);
  els.mobileSummaryBtn.addEventListener('click', () => {
    els.summaryPanel.setAttribute('tabindex', '-1');
    els.summaryPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    els.summaryPanel.focus({ preventScroll: true });
  });

  document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', event => {
      const action = event.currentTarget.dataset.action;
      if (action === 'add-item') addItem();
      if (action === 'open-import') openImportDrawer(event.currentTarget);
      if (action === 'sync-schedule') syncSchedule(true);
      if (action === 'add-stage') addScheduleStage();
    });
  });

  initDefaults();
  const restoredSchedule = loadSavedCache();
  renderItems();
  renderSchedule();
  if (restoredSchedule) {
    updateDeliveryPreview();
  } else {
    updateDates();
  }
  updateQuoteTitle();
  updateAdvanceLabel();
  calculate();
}

init();
