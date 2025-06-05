let currentTab = 'home';
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.style.display = 'none');
  document.getElementById(tab).style.display = 'block';
}
function saveWeight() {
  const weight = document.getElementById('today-weight').value;
  if (!weight) return;
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem('weight_' + today, weight);
  document.getElementById('weight-input-container').style.display = 'none';
  document.getElementById('food-input-container').style.display = 'block';
  updateStats();
}
function addFood() {
  const name = document.getElementById('food-name').value;
  const cal = parseInt(document.getElementById('food-calories').value) || 0;
  const today = new Date().toISOString().slice(0, 10);
  let list = JSON.parse(localStorage.getItem('food_' + today) || '[]');
  list.push({ name, cal });
  localStorage.setItem('food_' + today, JSON.stringify(list));
  updateFoodList();
  updateStats();
}
function updateFoodList() {
  const today = new Date().toISOString().slice(0, 10);
  const list = JSON.parse(localStorage.getItem('food_' + today) || '[]');
  const container = document.getElementById('food-list');
  const summary = document.getElementById('daily-summary');
  container.innerHTML = '';
  let total = 0;
  list.forEach((item, i) => {
    total += item.cal;
    const div = document.createElement('div');
    div.textContent = `${item.name} — ${item.cal} ккал`;
    div.onclick = () => { list.splice(i, 1); localStorage.setItem('food_' + today, JSON.stringify(list)); updateFoodList(); };
    container.appendChild(div);
  });
  summary.textContent = `Всего за ${today}: ${total} ккал`;
}
function updateStats() {
  const tbody = document.getElementById('stats-table');
  tbody.innerHTML = '';
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.startsWith('weight_')) {
      const date = k.slice(7);
      const weight = localStorage.getItem(k);
      const food = JSON.parse(localStorage.getItem('food_' + date) || '[]');
      const kcal = food.reduce((a, b) => a + b.cal, 0);
      const row = `<tr><td>${date}</td><td>${kcal}</td><td>${weight}</td></tr>`;
      tbody.innerHTML += row;
    }
  }
  updateChart();
}
function updateChart() {
  const labels = [], data = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.startsWith('weight_')) {
      const date = k.slice(7);
      labels.push(date);
      data.push(parseFloat(localStorage.getItem(k)));
    }
  }
  const ctx = document.getElementById('weight-chart').getContext('2d');
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels, datasets: [{ label: 'Вес', data, borderColor: '#007aff', tension: 0.3 }]
    },
    options: { responsive: true }
  });
}
function toggleTheme() {
  document.body.classList.toggle('dark');
}
function updateGoal() {
  const now = parseFloat(document.getElementById('current-weight').value);
  const goal = parseFloat(document.getElementById('goal-weight').value);
  if (!isNaN(now) && !isNaN(goal)) {
    const diff = now - goal;
    document.getElementById('weight-diff').textContent = `До цели: ${diff.toFixed(1)} кг`;
  }
}
setInterval(() => {
  const now = new Date();
  document.getElementById('current-date').textContent = now.toLocaleDateString();
  document.getElementById('current-time').textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}, 1000);
document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  updateFoodList();
});
