function updatePaymentUi(totalValues) {
      const mode = els.paymentMode.value;
      let advance = totalValues.advance;
      let balance = totalValues.total;
      if (mode === 'upfront') {
        advance = totalValues.advance || totalValues.total;
        balance = Math.max(0, totalValues.total - advance);
      } else if (mode === 'advance_balance') {
        advance = totalValues.advance;
        balance = totalValues.balance;
      } else if (mode === 'final') {
        balance = totalValues.balance;
      } else if (mode === 'deliverable' || mode === 'weekly') {
        const scheduled = state.schedule.reduce((sum, row) => sum + Number(row.amount || 0), 0);
        balance = Math.max(0, totalValues.total - advance - scheduled);
      }
      els.advance.textContent = money(advance);
      els.balance.textContent = money(balance);
    }

    function calculate() {
      const totalValues = totals();
      els.subtotal.textContent = money(totalValues.subtotal);
      els.discount.textContent = money(totalValues.discount);
      els.taxable.textContent = money(totalValues.taxable);
      els.tax.textContent = money(totalValues.tax);
      els.grandTotal.textContent = money(totalValues.total);
      els.heroTotal.textContent = money(totalValues.total);
      els.itemCount.textContent = state.items.length;
      els.weekCount.textContent = state.schedule.length;
      els.clientPreview.textContent = els.clientName.value ? `${els.clientName.value}${els.clientRuc.value ? ' · RUC ' + els.clientRuc.value : ''}` : 'Completa el cliente para personalizar la cotización.';
      updatePaymentUi(totalValues);
    }
