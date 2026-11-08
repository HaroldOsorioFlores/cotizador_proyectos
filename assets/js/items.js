function renderItems() {
  els.itemsList.innerHTML = '';
  state.items.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'item-card';
    row.innerHTML = `
      <div class='item-row'>
        <div class='span-mobile'>
          <label class='label row-label'>Concepto</label>
          <input class='field item-name' maxlength='200' aria-label='Concepto del ítem ${index + 1}' title='${escapeHtml(item.name)}' value='${escapeHtml(item.name)}' placeholder='Concepto o entregable' />
        </div>
        <div>
          <label class='label row-label'>Cantidad</label>
          <input class='field item-qty' type='number' min='0' step='0.01' inputmode='decimal' aria-label='Cantidad del ítem ${index + 1}' value='${Number(item.qty) || 0}' />
        </div>
        <div>
          <label class='label row-label'>Precio</label>
          <input class='field item-price' type='number' min='0' step='0.01' inputmode='decimal' aria-label='Precio del ítem ${index + 1}' value='${Number(item.price) || 0}' />
        </div>
        <div>
          <label class='label row-label'>Tipo</label>
          <input class='field item-type' list='itemTypeOptions' maxlength='60' aria-label='Tipo del ítem ${index + 1}' title='${escapeHtml(item.type)}' value='${escapeHtml(item.type)}' placeholder='Tipo' />
        </div>
        <div>
          <label class='label row-label'>Total</label>
          <div class='item-total number'>${money(Number(item.qty) * Number(item.price))}</div>
        </div>
        <div class='row-actions'>
          <button type='button' class='move-item-up icon-btn' data-tooltip='Subir ítem' title='Subir ítem' aria-label='Subir ítem' ${index === 0 ? 'disabled' : ''}>
            <svg class='icon' viewBox='0 0 20 20' aria-hidden='true'><path d='M10 16V4m0 0 5 5m-5-5-5 5' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/></svg>
          </button>
          <button type='button' class='move-item-down icon-btn' data-tooltip='Bajar ítem' title='Bajar ítem' aria-label='Bajar ítem' ${index === state.items.length - 1 ? 'disabled' : ''}>
            <svg class='icon' viewBox='0 0 20 20' aria-hidden='true'><path d='M10 4v12m0 0 5-5m-5 5-5-5' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/></svg>
          </button>
          <button type='button' class='remove-item icon-btn danger' data-tooltip='Eliminar ítem' title='Eliminar ítem' aria-label='Eliminar ítem'>
            <svg class='icon' viewBox='0 0 20 20' aria-hidden='true'><path d='M4 6h12M8 6V4h4v2m-7 0 1 10h8l1-10' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>
          </button>
        </div>
      </div>
      <div class='item-description'>
        <label class='label'>Descripción / alcance opcional</label>
        <textarea class='field item-description-field' maxlength='1000' aria-label='Descripción del ítem ${index + 1}' placeholder='Qué incluye este ítem, límites, entregables o condiciones específicas.'>${escapeHtml(item.description)}</textarea>
      </div>
    `;

    const updateItemTotal = () => {
      row.querySelector('.item-total').textContent = money(Number(state.items[index].qty || 0) * Number(state.items[index].price || 0));
      calculate();
    };

    row.querySelector('.item-name').addEventListener('input', event => {
      state.items[index].name = event.target.value;
      calculate();
    });
    row.querySelector('.item-description-field').addEventListener('input', event => {
      state.items[index].description = event.target.value;
    });
    row.querySelector('.item-qty').addEventListener('input', event => {
      state.items[index].qty = Number(event.target.value || 0);
      updateItemTotal();
    });
    row.querySelector('.item-price').addEventListener('input', event => {
      state.items[index].price = Number(event.target.value || 0);
      updateItemTotal();
    });
    row.querySelector('.item-type').addEventListener('input', event => {
      state.items[index].type = event.target.value;
    });
    row.querySelector('.move-item-up').addEventListener('click', () => moveItem(index, -1));
    row.querySelector('.move-item-down').addEventListener('click', () => moveItem(index, 1));
    row.querySelector('.remove-item').addEventListener('click', () => {
      state.items.splice(index, 1);
      renderItems();
      calculate();
    });

    els.itemsList.appendChild(row);
  });

  const isEmpty = state.items.length === 0;
  els.itemsList.classList.toggle('hidden', isEmpty);
  if (els.itemsEmpty) els.itemsEmpty.classList.toggle('hidden', !isEmpty);
}

function moveItem(index, direction) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= state.items.length) return;
  const [item] = state.items.splice(index, 1);
  state.items.splice(nextIndex, 0, item);
  renderItems();
  calculate();
}

function addItem(item = { name: '', description: '', qty: 1, price: 0, type: 'Desarrollo' }) {
  state.items.push({
    name: item.name || '',
    description: item.description || '',
    qty: Number(item.qty ?? 1),
    price: Number(item.price ?? 0),
    type: item.type || 'Desarrollo'
  });
  renderItems();
  calculate();
  const lastRow = els.itemsList.querySelector('.item-card:last-child .item-name');
  if (lastRow) lastRow.focus();
}
