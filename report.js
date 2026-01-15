const API_URL = "https://script.google.com/macros/s/AKfycbxnDAJtMI-PSsaWtUm2QSKoZKuEqRCTXGcYI7ZewtPJCQ-pHlGpdo0QsVV32P2WOdQfsA/exec";

let weekChartInstance = null;
let competitorChartInstance = null;

// Загрузка данных
async function loadData() {
  try {
    const res = await fetch(API_URL + "?action=getRecords", {
      cache: "no-store"
    });

    const data = await res.json();

    console.log("Ответ API:", data);

    if (!Array.isArray(data)) {
      throw new Error("API вернул не массив");
    }

    if (data.length === 0) {
      console.warn("Данных пока нет");
      return;
    }

    buildWeekChart(data);
    buildCompetitorChart(data);

  } catch (err) {
    console.error("Ошибка загрузки отчёта:", err);
  }
}


// ===== График по неделям =====
function buildWeekChart(data) {
  const map = {};

  data.forEach(r => {
    if (!r.price || !r.date) return;

    const d = new Date(r.date);
    if (isNaN(d)) return;

    const week = `${d.getFullYear()}-${String(getWeekNumber(d)).padStart(2, "0")}`;

    if (!map[week]) map[week] = [];
    map[week].push(Number(r.price));
  });

  const labels = Object.keys(map).sort();
  const values = labels.map(w => {
    const arr = map[w];
    return +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
  });

  const ctx = document.getElementById("weekChart");
  if (!ctx) return;

  // 💣 Уничтожаем старый график
  if (weekChartInstance) {
    weekChartInstance.destroy();
  }

  weekChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: "#1976d2"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}



// ===== График по конкурентам =====
function buildCompetitorChart(data) {
  const map = {};

  data.forEach(r => {
    if (!r.price || !r.competitor) return;

    if (!map[r.competitor]) map[r.competitor] = [];
    map[r.competitor].push(Number(r.price));
  });

  const labels = Object.keys(map);
  const values = labels.map(c => {
    const arr = map[c];
    return +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
  });

  const ctx = document.getElementById("competitorChart");
  if (!ctx) return;

  // 💣 Уничтожаем старый график
  if (competitorChartInstance) {
    competitorChartInstance.destroy();
  }

  competitorChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: "#43a047"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}


// ===== Получение номера недели =====
function getWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays = (date - firstDay) / 86400000;
  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
}


// Старт
loadData();


