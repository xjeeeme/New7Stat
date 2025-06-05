let data = JSON.parse(localStorage.getItem("7statData")) || {};

function showTab(id) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function saveWeight() {
  const weight = parseFloat(document.getElementById("todayWeight").value);
  if (!weight) return;
  const date = new Date().toLocaleDateString();
  data[date] = data[date] || { foods: [], calories: 0 };
  data[date].weight = weight;
  document.getElementById("weightInputBlock").style.display = "none";
  save();
  render();
}

function addProduct() {
  const product = document.getElementById("product").value;
  const cal = parseFloat(document.getElementById("calories").value) || 0;
  if (!product) return;
  const date = new Date().toLocaleDateString();
  data[date] = data[date] || { foods: [], calories: 0 };
  data[date].foods.push({ name: product, calories: cal });
  data[date].calories += cal;
  save();
  render();
}

function setGoal() {
  const goal = parseFloat(document.getElementById("goalWeight").value);
  localStorage.setItem("goalWeight", goal);
  render();
}

function save() {
  localStorage.setItem("7statData", JSON.stringify(data));
}

function render() {
  const date = new Date().toLocaleDateString();
  const today = data[date] || { foods: [], calories: 0 };
  const list = today.foods.map(f => `<div>${f.name} — ${f.calories} ккал</div>`).join("");
  document.getElementById("productList").innerHTML = list;
  document.getElementById("caloriesSum").innerText = `Всего: ${today.calories || 0} ккал`;

  const tableBody = document.querySelector("#statsTable tbody");
  tableBody.innerHTML = "";
  Object.keys(data).forEach(d => {
    const row = `<tr><td>${d}</td><td>${data[d].weight || ""}</td><td>${data[d].calories || 0}</td></tr>`;
    tableBody.innerHTML += row;
  });

  const ctx = document.getElementById("weightChart").getContext("2d");
  const dates = Object.keys(data);
  const weights = dates.map(d => data[d].weight || null);
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: "Вес (кг)",
        data: weights,
        borderColor: "#000",
        borderWidth: 2,
        fill: false,
        tension: 0.3
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  const goal = parseFloat(localStorage.getItem("goalWeight")) || 0;
  if (goal && today.weight) {
    const left = (today.weight - goal).toFixed(1);
    document.getElementById("goalLeft").innerText = `Осталось ${left} кг до цели`;
  }
}

render();

setInterval(() => {
  const now = new Date();
  document.getElementById("date-time").innerText = now.toLocaleString();
}, 1000);
