function renderItems() {
      els.itemsList.innerHTML = '';
      state.items.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'rounded-2xl border border-slate-200 bg-white p-3';
        row.innerHTML = `
          <div class="item-row">
            <div class="span-mobile">
              <label class="label lg:hidden">Concepto</label>
              <input class="field item-name" value="${escapeHtml(item.name)}" placeholder="Concepto o entregable" />
            </div>
            <div>
              <label class="label lg:hidden">Cantidad</label>
              <input class="field item-qty" type="number" min="0" step="0.01" value="${item.qty}" />
            </div>
            <div>
              <label class="label lg:hidden">Precio</label>
              <input class="field item-price" type="number" min="0" step="0.01" value="${item.price}" />
            </div>
            <div>
              <label class="label lg:hidden">Tipo</label>
              <select class="field item-type">
                ${['Estrategia', 'Diseño', 'Desarrollo', 'Integración', 'Licencia', 'Contenido'].map(type => `<option ${type === item.type ? 'selected' : ''}>${type}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="label lg:hidden">Total</label>
              <div class="item-total number rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-black text-slate-950">${money(item.qty * item.price)}</div>
            </div>
            <div class="row-actions">
              <button type="button" class="move-item-up icon-btn" data-tooltip="Subir ítem" title="Subir ítem" aria-label="Subir ítem" ${index === 0 ? 'disabled' : ''}>↑</button>
              <button type="button" class="move-item-down icon-btn" data-tooltip="Bajar ítem" title="Bajar ítem" aria-label="Bajar ítem" ${index === state.items.length - 1 ? 'disabled' : ''}>↓</button>
              <button type="button" class="remove-item icon-btn danger" data-tooltip="Eliminar ítem" title="Eliminar ítem" aria-label="Eliminar ítem">×</button>
            </div>
          </div>
          <div class="mt-3">
            <label class="label">Descripción / alcance opcional del ítem</label>
            <textarea class="field item-description min-h-[74px]" placeholder="Qué incluye este ítem, límites, entregables o condiciones específicas.">${escapeHtml(item.description)}</textarea>
          </div>
        `;

        const updateItemTotal = () => {
          row.querySelector('.item-total').textContent = money(state.items[index].qty * state.items[index].price);
          calculate();
        };

        row.querySelector('.item-name').addEventListener('input', event => { state.items[index].name = event.target.value; calculate(); });
        row.querySelector('.item-description').addEventListener('input', event => { state.items[index].description = event.target.value; });
        row.querySelector('.item-qty').addEventListener('input', event => { state.items[index].qty = Number(event.target.value || 0); updateItemTotal(); });
        row.querySelector('.item-price').addEventListener('input', event => { state.items[index].price = Number(event.target.value || 0); updateItemTotal(); });
        row.querySelector('.item-type').addEventListener('change', event => { state.items[index].type = event.target.value; calculate(); });
        row.querySelector('.move-item-up').addEventListener('click', () => moveItem(index, -1));
        row.querySelector('.move-item-down').addEventListener('click', () => moveItem(index, 1));
        row.querySelector('.remove-item').addEventListener('click', () => {
          state.items.splice(index, 1);
          renderItems();
          calculate();
        });
        els.itemsList.appendChild(row);
      });
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
      state.items.push(item);
      renderItems();
      calculate();
    }
