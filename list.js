const API_URL = "https://script.google.com/macros/s/AKfycbxggozSR5PYM7h4ph1eYQafcxhDwJZq8QfQl2rNu7d2LZf65x_KY2jEzYrJEmQb1F1QiQ/exec";

let allRecords = []; // все записи в памяти

// Форматируем дату красиво
function formatDate(dateStr) {
  if (!dateStr) return "—";

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";

  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Дата в формате YYYY-MM-DD (для фильтра)
function formatISODate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

// Рендер таблицы
function renderTable(data) {
  const tbody = document.querySelector("#recordsTable tbody");
  tbody.innerHTML = "";

  data.forEach(record => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${formatDate(record.date)}</td>
      <td>${record.competitor || "-"}</td>
      <td>${record.price || "-"}</td>
    `;

    tr.onclick = () => showDetails(record);
    tbody.appendChild(tr);
  });
}

// Заполнение списка конкурентов
function fillCompetitors(data) {
  const select = document.getElementById("filterCompetitor");

  const competitors = [...new Set(
    data.map(r => r.competitor).filter(Boolean)
  )];

  competitors.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

// Применение фильтров
function applyFilters() {
  const competitor = document.getElementById("filterCompetitor").value;
  const date = document.getElementById("filterDate").value;

  let filtered = allRecords;

  if (competitor) {
    filtered = filtered.filter(r => r.competitor === competitor);
  }

  if (date) {
    filtered = filtered.filter(r => formatISODate(r.date) === date);
  }

  renderTable(filtered);
}

// Детали записи
function showDetails(record) {
  alert(
    `📋 Запись\n\n` +
    `Дата: ${formatDate(record.date)}\n` +
    `Конкурент: ${record.competitor || "-"}\n` +
    `Цена: ${record.price || "-"}\n` +
    `Возраст: ${record.age || "-"}\n` +
    `Качество: ${record.quality || "-"}\n` +
    `Опт: ${record.bulkPrice || "-"}\n` +
    `Регион: ${record.region || "-"}`
  );
}

// Загрузка записей
async function loadRecords() {
  try {
    const res = await fetch(API_URL + "?action=getRecords");
    const data = await res.json();

    allRecords = data || [];

    renderTable(allRecords);
    fillCompetitors(allRecords);

  } catch (err) {
    console.error(err);
    alert("Ошибка загрузки записей");
  }
}

// Старт
loadRec

