function renderCosts() {
  els.costsList.innerHTML = '';
  state.costs.forEach((cost, index) => {
    const row = document.createElement('div');
    row.className = 'cost-card';
    const periods = [
      ['monthly', 'Mensual'],
      ['annual', 'Anual'],
      ['one_time', 'Único']
    ].map(([value, label]) => `<option value='${value}' ${cost.period === value ? 'selected' : ''}>${label}</option>`).join('');
    row.innerHTML = `
      <div class='cost-row'>
        <div class='span-mobile'>
          <label class='label row-label'>Concepto</label>
          <input class='field cost-name' maxlength='200' aria-label='Concepto del costo ${index + 1}' title='${escapeHtml(cost.name)}' value='${escapeHtml(cost.name)}' placeholder='Ej. Hosting, Figma, servidor' />
        </div>
        <div>
          <label class='label row-label'>Monto</label>
          <input class='field cost-amount' type='number' min='0' step='0.01' inputmode='decimal' aria-label='Monto del costo ${index + 1}' value='${Number(cost.amount) || 0}' />
        </div>
        <div>
          <label class='label row-label'>Periodicidad</label>
          <select class='field cost-period' aria-label='Periodicidad del costo ${index + 1}'>${periods}</select>
        </div>
        <div>
          <label class='label row-label'>Total estimado</label>
          <div class='cost-total'>${money(costRowTotal(cost))}</div>
        </div>
        <div class='row-actions'>
          <button type='button' class='remove-cost icon-btn danger' data-tooltip='Eliminar costo' title='Eliminar costo' aria-label='Eliminar costo'>
            <svg class='icon' viewBox='0 0 20 20' aria-hidden='true'><path d='M4 6h12M8 6V4h4v2m-7 0 1 10h8l1-10' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>
          </button>
        </div>
      </div>
    `;
    row.querySelector('.cost-name').addEventListener('input', event => {
      state.costs[index].name = event.target.value;
    });
    row.querySelector('.cost-amount').addEventListener('input', event => {
      state.costs[index].amount = Number(event.target.value || 0);
      calculate();
    });
    row.querySelector('.cost-period').addEventListener('change', event => {
      state.costs[index].period = costPeriodValue(event.target.value) || 'monthly';
      calculate();
    });
    row.querySelector('.remove-cost').addEventListener('click', () => {
      state.costs.splice(index, 1);
      renderCosts();
      calculate();
    });
    els.costsList.appendChild(row);
  });

  const isEmpty = state.costs.length === 0;
  els.costsList.classList.toggle('hidden', isEmpty);
  if (els.costsEmpty) els.costsEmpty.classList.toggle('hidden', !isEmpty);
}

function addCost(cost = { name: '', amount: 0, period: 'monthly' }) {
  state.costs.push({
    name: cost.name || '',
    amount: Number(cost.amount ?? 0),
    period: costPeriodValue(cost.period) || 'monthly'
  });
  renderCosts();
  calculate();
  const lastRow = els.costsList.querySelector('.cost-card:last-child .cost-name');
  if (lastRow) lastRow.focus();
}
