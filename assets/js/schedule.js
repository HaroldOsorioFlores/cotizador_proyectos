function durationTotalDays() {
  const qty = Math.max(1, Number(els.durationQty.value || 1));
  return els.durationUnit.value === 'weeks' ? qty * 7 : qty;
}

function requiredStages() {
  const qty = Math.max(1, Math.round(Number(els.durationQty.value || 1)));
  const stages = els.durationUnit.value === 'weeks' ? qty : Math.max(1, Math.ceil(qty / 7));
  // shortcut: máximo 52 etapas para no bloquear la interfaz con plazos largos.
  return Math.min(52, stages);
}

function requiredWeeks() {
  return requiredStages();
}

function stageIntervalDays() {
  return Math.max(1, Math.round(durationTotalDays() / requiredStages()));
}

function syncSchedule(force = false) {
  const stages = requiredStages();
  while (state.schedule.length < stages) {
    const index = state.schedule.length + 1;
    state.schedule.push({ week: index, etapa: index, date: '', deliverable: defaultDeliverable(index), amount: 0, manualDate: false });
  }
  if (force || state.schedule.length > stages) {
    state.schedule = state.schedule.slice(0, stages);
  }
  const start = els.startDate.value ? new Date(`${els.startDate.value}T00:00:00`) : null;
  const totalDays = durationTotalDays();
  state.schedule.forEach((row, index) => {
    row.week = index + 1;
    row.etapa = index + 1;
    if (force) row.manualDate = false;
    if (row.manualDate && row.date) return;
    row.date = start ? toIsoDate(addDays(start, Math.round(totalDays * (index + 1) / stages))) : '';
  });
  renderSchedule();
  calculate();
}

function estimateNextStageDate() {
  const interval = stageIntervalDays();
  const lastDate = [...state.schedule].reverse().find(row => row.date)?.date;
  if (lastDate) {
    const last = new Date(`${lastDate}T00:00:00`);
    if (!Number.isNaN(last.getTime())) return toIsoDate(addDays(last, interval));
  }
  if (els.startDate.value) {
    const start = new Date(`${els.startDate.value}T00:00:00`);
    if (!Number.isNaN(start.getTime())) return toIsoDate(addDays(start, interval * (state.schedule.length + 1)));
  }
  return '';
}

function renumberScheduleStages() {
  state.schedule.forEach((row, index) => {
    row.week = index + 1;
    row.etapa = index + 1;
  });
}

function addScheduleStage() {
  const index = state.schedule.length + 1;
  state.schedule.push({
    week: index,
    etapa: index,
    date: estimateNextStageDate(),
    deliverable: defaultDeliverable(index),
    amount: 0,
    manualDate: false
  });
  renderSchedule();
  calculate();
}

function defaultDeliverable(index) {
  const defaults = [
    'Inicio, definición de alcance y acuerdos',
    'Diseño, arquitectura o configuración inicial',
    'Desarrollo, integración o automatización',
    'Pruebas, ajustes y entrega final'
  ];
  return defaults[index - 1] || `Avance de la etapa ${index}`;
}

function renderSchedule() {
  els.scheduleList.innerHTML = '';
  state.schedule.forEach((rowData, index) => {
    const safeDate = /^\d{4}-\d{2}-\d{2}$/.test(String(rowData.date || '')) ? rowData.date : '';
    const row = document.createElement('div');
    row.className = 'schedule-card';
    row.innerHTML = `
      <div class='schedule-row'>
        <div>
          <label class='label row-label'>Etapa</label>
          <div class='stage-badge'>Etapa ${rowData.etapa || rowData.week || index + 1}</div>
        </div>
        <div>
          <label class='label row-label'>Fecha</label>
          <input class='field schedule-date' type='date' aria-label='Fecha de la etapa ${index + 1}' value='${escapeHtml(safeDate)}' />
        </div>
        <div class='span-mobile'>
          <label class='label row-label'>Entregable</label>
          <input class='field schedule-deliverable' maxlength='300' aria-label='Entregable de la etapa ${index + 1}' title='${escapeHtml(rowData.deliverable)}' value='${escapeHtml(rowData.deliverable)}' placeholder='Qué se entrega en esta etapa' />
        </div>
        <div>
          <label class='label row-label'>Abono</label>
          <input class='field schedule-amount' type='number' min='0' step='0.01' inputmode='decimal' aria-label='Abono de la etapa ${index + 1}' value='${Number(rowData.amount) || 0}' />
        </div>
        <div class='row-actions'>
          <button type='button' class='remove-schedule icon-btn danger' data-tooltip='Eliminar etapa' title='Eliminar etapa' aria-label='Eliminar etapa'>
            <svg class='icon' viewBox='0 0 20 20' aria-hidden='true'><path d='M4 6h12M8 6V4h4v2m-7 0 1 10h8l1-10' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>
          </button>
        </div>
      </div>
    `;
    row.querySelector('.schedule-date').addEventListener('input', event => {
      state.schedule[index].date = event.target.value;
      state.schedule[index].manualDate = Boolean(event.target.value);
      calculate();
    });
    row.querySelector('.schedule-deliverable').addEventListener('input', event => {
      state.schedule[index].deliverable = event.target.value;
    });
    row.querySelector('.schedule-amount').addEventListener('input', event => {
      state.schedule[index].amount = Number(event.target.value || 0);
      calculate();
    });
    row.querySelector('.remove-schedule').addEventListener('click', () => {
      state.schedule.splice(index, 1);
      renumberScheduleStages();
      renderSchedule();
      calculate();
    });
    els.scheduleList.appendChild(row);
  });

  const isEmpty = state.schedule.length === 0;
  els.scheduleList.classList.toggle('hidden', isEmpty);
  if (els.scheduleEmpty) els.scheduleEmpty.classList.toggle('hidden', !isEmpty);
}

function updateDeliveryPreview() {
  if (!els.startDate.value) {
    els.endDate.value = '';
    els.deliveryPreview.textContent = 'Define fecha de inicio y plazo.';
    return;
  }
  const start = new Date(`${els.startDate.value}T00:00:00`);
  if (Number.isNaN(start.getTime())) {
    els.endDate.value = '';
    els.deliveryPreview.textContent = 'Revisa la fecha de inicio.';
    return;
  }
  const qty = Math.max(1, Number(els.durationQty.value || 1));
  const days = els.durationUnit.value === 'weeks' ? qty * 7 : qty;
  els.endDate.value = toIsoDate(addDays(start, days));
  const unitLabel = els.durationUnit.value === 'weeks' ? (qty === 1 ? 'semana' : 'semanas') : (qty === 1 ? 'día' : 'días');
  els.deliveryPreview.textContent = `${formatDate(els.startDate.value)} al ${formatDate(els.endDate.value)} · ${qty} ${unitLabel}`;
}

function updateDates() {
  updateDeliveryPreview();
  syncSchedule();
}

function distributeSchedulePayments() {
  const totalValues = totals();
  if (!state.schedule.length) syncSchedule(true);
  const rows = Math.max(1, state.schedule.length);
  const amountToDistribute = Math.max(0, totalValues.total - effectiveAdvance(totalValues));
  const baseAmount = Math.floor((amountToDistribute / rows) * 100) / 100;
  let assigned = 0;
  state.schedule.forEach((row, index) => {
    row.amount = index === rows - 1 ? Number((amountToDistribute - assigned).toFixed(2)) : baseAmount;
    assigned += row.amount;
  });
  renderSchedule();
  calculate();
}
