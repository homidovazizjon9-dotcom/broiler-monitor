const API_URL = "https://script.google.com/macros/s/AKfycbxggozSR5PYM7h4ph1eYQafcxhDwJZq8QfQl2rNu7d2LZf65x_KY2jEzYrJEmQb1F1QiQ/exec";

// Функция для показа поля "Другое"
function toggleCustomCompetitor() {
  const select = document.getElementById("competitor");
  const block = document.getElementById("customCompetitorBlock");

  if (select.value === "other") {
    block.style.display = "block";
  } else {
    block.style.display = "none";
  }
}

function toggleReport() {
  const block = document.getElementById("reportBlock");

  if (block.style.display === "none") {
    block.style.display = "block";
  } else {
    block.style.display = "none";
  }
}


// Функция сохранения
async function saveChick() {
  const btn = document.getElementById("saveBtn");

  const competitorSelect = document.getElementById("competitor");
  const competitorValue = competitorSelect.value === "other"
    ? document.getElementById("customCompetitor").value
    : competitorSelect.value;

  const params = new URLSearchParams({
    competitor: competitorValue,
    age: document.getElementById("age").value,
    quality: document.getElementById("quality").value,
    price: document.getElementById("price").value,
    bulkPrice: document.getElementById("bulkPrice").value,
    credit: document.getElementById("credit").value,
    creditDays: document.getElementById("creditDays").value,
    delivery: document.getElementById("delivery").value,
    region: document.getElementById("region").value
  });

  const url = API_URL + "?" + params.toString();

  btn.disabled = true;
  btn.textContent = "Сохраняю...";

  try {
    const res = await fetch(url);
    const result = await res.json();

    if (result.status === "ok") {
      alert("Данные сохранены ✅");
      document.querySelectorAll("input").forEach(i => i.value = "");
      document.getElementById("customCompetitor").value = "";
      toggleCustomCompetitor();
    } else {
      alert("Ошибка: " + result.message);
    }

  } catch (err) {
    console.error(err);
    alert("Ошибка соединения с сервером");
  }

  btn.disabled = false;
  btn.textContent = "Сохранить данные";
}
