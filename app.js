// DEMO MODE ONLY: Static showcase with in-memory transactions.
// Remove the /demo folder when publishing a real deployment.

const CATEGORIES = ['Food', 'Transport', 'Rent', 'Entertainment', 'Utilities', 'Other'];

const DEFAULT_TX = [
  { id: 't1', type: 'income', category: 'Other', amount: 1500, note: 'Demo salary' },
  { id: 't2', type: 'expense', category: 'Rent', amount: 650, note: 'Demo rent' },
  { id: 't3', type: 'expense', category: 'Food', amount: 120, note: 'Groceries' },
  { id: 't4', type: 'expense', category: 'Transport', amount: 55, note: 'Fuel' },
];

const state = {
  tx: [...DEFAULT_TX],
  next: 5,
};

const els = {
  balancePill: document.getElementById('balancePill'),
  typeSelect: document.getElementById('typeSelect'),
  categorySelect: document.getElementById('categorySelect'),
  amountInput: document.getElementById('amountInput'),
  addBtn: document.getElementById('addBtn'),
  resetBtn: document.getElementById('resetBtn'),
  list: document.getElementById('list'),
  hint: document.getElementById('hint'),
  pie: document.getElementById('pie'),
};

function formatUSD(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function totals() {
  const income = state.tx.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expense = state.tx.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  return { income, expense, balance: income - expense };
}

function renderCategoryOptions() {
  els.categorySelect.innerHTML = '';
  for (const c of CATEGORIES) {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    els.categorySelect.appendChild(opt);
  }
}

function renderList() {
  els.list.innerHTML = '';
  if (!state.tx.length) {
    const empty = document.createElement('div');
    empty.className = 'muted';
    empty.textContent = 'No transactions yet.';
    els.list.appendChild(empty);
    return;
  }

  for (const t of [...state.tx].reverse()) {
    const item = document.createElement('div');
    item.className = 'cart-item';
    const sign = t.type === 'income' ? '+' : '−';
    const badge = t.type === 'income' ? 'Income' : 'Expense';

    item.innerHTML = `
      <div>
        <div class="name">${t.category}</div>
        <div class="line">${badge} • ${t.note ?? '—'}</div>
      </div>
      <div style="text-align:right;">
        <div class="name">${sign} ${formatUSD(t.amount)}</div>
        <div class="pill">${badge}</div>
      </div>
    `;

    els.list.appendChild(item);
  }
}

function drawPie() {
  const ctx = els.pie.getContext('2d');
  const w = els.pie.width;
  const h = els.pie.height;
  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, 0, w, h);

  const byCat = new Map();
  for (const t of state.tx) {
    if (t.type !== 'expense') continue;
    byCat.set(t.category, (byCat.get(t.category) ?? 0) + t.amount);
  }

  const entries = Array.from(byCat.entries());
  const total = entries.reduce((a, [, v]) => a + v, 0);

  if (!total) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '16px ui-sans-serif, system-ui';
    ctx.fillText('No expenses to chart yet.', 20, 40);
    return;
  }

  const colors = ['#ff6b6b', '#feca57', '#667eea', '#22c55e', '#a855f7', '#38bdf8'];
  const cx = w * 0.32;
  const cy = h * 0.5;
  const r = Math.min(w, h) * 0.28;

  let start = -Math.PI / 2;
  entries.forEach(([cat, value], i) => {
    const slice = (value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + slice);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    start += slice;
  });

  // legend
  ctx.font = '14px ui-sans-serif, system-ui';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';

  const lx = w * 0.62;
  let ly = h * 0.25;

  entries.forEach(([cat, value], i) => {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(lx, ly - 12, 12, 12);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(`${cat}: ${formatUSD(value)}`, lx + 18, ly);
    ly += 24;
  });
}

function renderBalance() {
  const { income, expense, balance } = totals();
  const sign = balance >= 0 ? '+' : '−';
  els.balancePill.textContent = `Balance: ${sign} ${formatUSD(Math.abs(balance))}`;
  els.hint.textContent = `Income: ${formatUSD(income)} • Expenses: ${formatUSD(expense)}`;
}

function addTransaction() {
  const type = els.typeSelect.value;
  const category = els.categorySelect.value;
  const amount = Number(els.amountInput.value);

  if (!amount || amount <= 0) {
    els.hint.textContent = 'Enter a positive amount.';
    return;
  }

  state.tx.push({
    id: `t${state.next++}`,
    type,
    category,
    amount,
    note: 'Added in demo',
  });

  els.amountInput.value = '';
  render();
}

function reset() {
  state.tx = [...DEFAULT_TX];
  state.next = 5;
  render();
}

function render() {
  renderBalance();
  renderList();
  drawPie();
}

els.addBtn.addEventListener('click', addTransaction);
els.resetBtn.addEventListener('click', reset);

renderCategoryOptions();
render();
