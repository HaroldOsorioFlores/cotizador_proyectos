function updateScheduleWarning(totalValues) {
  if (!els.scheduleWarning) return;
  const mode = els.paymentMode.value;
  const endDate = els.endDate.value;
  const hasStageAfterEnd = Boolean(endDate) && state.schedule.some(row => row.date && row.date > endDate);
  if (hasStageAfterEnd) {
    els.scheduleWarning.textContent = 'Hay etapas después de la fecha final. Pulsa Sincronizar etapas para alinearlas.';
    els.scheduleWarning.classList.remove('hidden');
    return;
  }
  if (mode !== 'deliverable' && mode !== 'weekly') {
    els.scheduleWarning.classList.add('hidden');
    return;
  }
  const scheduled = state.schedule.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const pending = Math.max(0, totalValues.total - effectiveAdvance(totalValues) - scheduled);
  let message = '';
  if (scheduled <= 0) {
    message = 'Aún no hay abonos en el cronograma. Usa Distribuir pagos.';
  } else if (pending > 0.009) {
    message = `El cronograma suma ${money(scheduled)}; quedan ${money(pending)} por asignar.`;
  } else {
    message = `El cronograma cubre ${money(scheduled)}.`;
  }
  els.scheduleWarning.textContent = message;
  els.scheduleWarning.classList.remove('hidden');
}

function updatePaymentUi(totalValues) {
  const mode = els.paymentMode.value;
  const advance = effectiveAdvance(totalValues);
  let balance = Math.max(0, totalValues.total - advance);
  if (mode === 'upfront') balance = 0;
  if (mode === 'final') balance = totalValues.total;
  if (mode === 'deliverable' || mode === 'weekly') {
    const scheduled = state.schedule.reduce((sum, row) => sum + Number(row.amount || 0), 0);
    balance = Math.max(0, totalValues.total - advance - scheduled);
  }
  els.advance.textContent = money(advance);
  els.balance.textContent = money(balance);

  const disableAdvance = mode === 'upfront' || mode === 'final';
  els.advanceAmount.disabled = disableAdvance;
  els.advanceAmount.classList.toggle('is-disabled', disableAdvance);
  els.advanceAmount.setAttribute('aria-disabled', String(disableAdvance));

  const help = {
    upfront: 'Pago completo al inicio: el abono inicial no aplica. El saldo queda en cero.',
    advance_balance: 'El abono inicial se descuenta del total y el resto queda como saldo final.',
    final: 'Pago completo al final: el abono inicial no aplica.',
    deliverable: 'El abono inicial es opcional; el resto se reparte entre los entregables del cronograma.',
    weekly: 'El abono inicial es opcional; el resto se reparte por etapas en el cronograma.'
  };
  if (els.paymentHelp) els.paymentHelp.textContent = help[mode] || help.advance_balance;
  updateScheduleWarning(totalValues);
}

function updateCompletion() {
  const mode = els.paymentMode.value;
  const scheduled = state.schedule.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const states = {
    client: Boolean(els.clientName.value.trim()),
    items: state.items.length > 0 && state.items.some(item => Number(item.price) > 0),
    dates: Boolean(els.startDate.value) && Number(els.durationQty.value) > 0,
    payment: mode === 'deliverable' || mode === 'weekly' ? scheduled > 0 : true
  };
  if (els.completionList) {
    Object.entries(states).forEach(([key, done]) => {
      const item = els.completionList.querySelector(`[data-check='${key}']`);
      if (!item) return;
      item.classList.toggle('is-done', done);
      item.setAttribute('data-done', String(done));
    });
  }
  const allDone = Object.values(states).every(Boolean);
  if (els.docStatus) {
    els.docStatus.textContent = allDone ? 'Listo para PDF' : 'Borrador';
    els.docStatus.classList.toggle('is-ready', allDone);
  }
  if (els.quoteMeta) {
    els.quoteMeta.textContent = `${state.items.length} ítems · ${state.schedule.length} etapas · ${els.currency.value}`;
  }
}

function calculate() {
  const totalValues = totals();
  els.subtotal.textContent = money(totalValues.subtotal);
  els.discount.textContent = money(totalValues.discount);
  els.taxable.textContent = money(totalValues.taxable);
  els.tax.textContent = money(totalValues.tax);
  els.grandTotal.textContent = money(totalValues.total);
  els.heroTotal.textContent = money(totalValues.total);
  if (els.mobileTotal) els.mobileTotal.textContent = money(totalValues.total);
  els.itemCount.textContent = state.items.length;
  els.weekCount.textContent = state.schedule.length;
  document.querySelectorAll('.item-total').forEach((element, index) => {
    const item = state.items[index];
    if (item) element.textContent = money(Number(item.qty || 0) * Number(item.price || 0));
  });
  els.clientPreview.textContent = els.clientName.value
    ? `${els.clientName.value}${els.clientRuc.value ? ' · RUC ' + els.clientRuc.value : ''}`
    : 'Completa el cliente para personalizar la cotización.';
  updateAdvanceLabel();
  updatePaymentUi(totalValues);
  updateCompletion();
}
