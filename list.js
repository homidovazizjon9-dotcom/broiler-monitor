const API_URL = "https://script.google.com/macros/s/AKfycbzgFLMM7TXsZ3aAwPGF3TXYqhcuc0JE9hDuT8e2er-sMlih8-BPJIHJ1KoYRIY2KWSWGw/exec";

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

async function loadRecords() {
  try {
    const res = await fetch(API_URL + "?action=getRecords");
    const data = await res.json();

    const tbody = document.querySelector("#recordsTable tbody");
    tbody.innerHTML = ""; // очищаем перед загрузкой

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

  } catch (err) {
    console.error(err);
    alert("Ошибка загрузки записей");
  }
}

function showDetails(record) {
  alert(
    `📋 Запись\n\n` +
    `Конкурент: ${record.competitor || "-"}\n` +
    `Цена: ${record.price || "-"}\n` +
    `Возраст: ${record.age || "-"}\n` +
    `Качество: ${record.quality || "-"}\n` +
    `Опт: ${record.bulkPrice || "-"}\n` +
    `Регион: ${record.region || "-"}`
  );
}

loadRecords();
