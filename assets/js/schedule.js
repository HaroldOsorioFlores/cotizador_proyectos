function requiredWeeks() {
      const qty = Math.max(1, Math.round(Number(els.durationQty.value || 1)));
      return els.durationUnit.value === 'weeks' ? qty : Math.max(1, Math.ceil(qty / 7));
    }

    function syncSchedule(force = false) {
      const weeks = requiredWeeks();
      while (state.schedule.length < weeks) {
        const index = state.schedule.length + 1;
        state.schedule.push({ week: index, etapa: index, date: '', deliverable: defaultDeliverable(index), amount: 0 });
      }
      if (force || state.schedule.length > weeks) state.schedule = state.schedule.slice(0, weeks);
      state.schedule.forEach((row, index) => {
        row.week = index + 1;
        row.etapa = index + 1;
        const start = els.startDate.value ? new Date(`${els.startDate.value}T00:00:00`) : null;
        const computedDate = start ? toIsoDate(addDays(start, index * 7)) : '';
        row.date = force ? computedDate : (row.date || computedDate);
      });
      renderSchedule();
      calculate();
    }

    function estimateNextStageDate() {
      const lastDate = [...state.schedule].reverse().find(row => row.date)?.date;
      if (lastDate) return toIsoDate(addDays(new Date(`${lastDate}T00:00:00`), 7));
      if (els.startDate.value) return toIsoDate(addDays(new Date(`${els.startDate.value}T00:00:00`), state.schedule.length * 7));
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
        amount: 0
      });
      renderSchedule();
      calculate();
    }

    function defaultDeliverable(index) {
      const defaults = [
        'Inicio, definición de alcance y arquitectura',
        'Diseño visual y validación de pantallas principales',
        'Desarrollo de interfaz y componentes base',
        'Integraciones, QA, ajustes y entrega final'
      ];
      return defaults[index - 1] || `Entregable de la etapa ${index}`;
    }

    function renderSchedule() {
      els.scheduleList.innerHTML = '';
      state.schedule.forEach((rowData, index) => {
        const row = document.createElement('div');
        row.className = 'schedule-row rounded-2xl border border-slate-200 bg-white p-3';
        row.innerHTML = `
          <div>
            <label class="label lg:hidden">Etapa</label>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-black text-slate-950">Etapa ${rowData.etapa || rowData.week || index + 1}</div>
          </div>
          <div>
            <label class="label lg:hidden">Fecha</label>
            <input class="field schedule-date" type="date" value="${rowData.date}" />
          </div>
          <div class="span-mobile">
            <label class="label lg:hidden">Entregable</label>
            <input class="field schedule-deliverable" value="${escapeHtml(rowData.deliverable)}" placeholder="Qué se entrega en esta etapa" />
          </div>
          <div>
            <label class="label lg:hidden">Abono</label>
            <input class="field schedule-amount" type="number" min="0" step="0.01" value="${rowData.amount}" />
          </div>
          <button type="button" class="remove-schedule icon-btn danger" data-tooltip="Eliminar etapa" title="Eliminar etapa" aria-label="Eliminar etapa">×</button>
        `;
        row.querySelector('.schedule-date').addEventListener('input', event => { state.schedule[index].date = event.target.value; });
        row.querySelector('.schedule-deliverable').addEventListener('input', event => { state.schedule[index].deliverable = event.target.value; });
        row.querySelector('.schedule-amount').addEventListener('input', event => { state.schedule[index].amount = Number(event.target.value || 0); calculate(); });
        row.querySelector('.remove-schedule').addEventListener('click', () => {
          state.schedule.splice(index, 1);
          renumberScheduleStages();
          renderSchedule();
          calculate();
        });
        els.scheduleList.appendChild(row);
      });
    }

    function updateDeliveryPreview() {
      if (!els.startDate.value) {
        els.endDate.value = '';
        els.deliveryPreview.textContent = 'Define fecha de inicio y plazo.';
        return;
      }
      const start = new Date(`${els.startDate.value}T00:00:00`);
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
      const amountToDistribute = Math.max(0, totalValues.total - totalValues.advance);
      const baseAmount = Math.floor((amountToDistribute / rows) * 100) / 100;
      let assigned = 0;
      state.schedule.forEach((row, index) => {
        row.amount = index === rows - 1 ? Number((amountToDistribute - assigned).toFixed(2)) : baseAmount;
        assigned += row.amount;
      });
      renderSchedule();
      calculate();
    }
