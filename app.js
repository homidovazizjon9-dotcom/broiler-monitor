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

// Функция сохранения
async function saveChick() {
  const btn = document.getElementById("saveBtn");

  const competitorSelect = document.getElementById("competitor");
  const competitorValue = competitorSelect.value === "other"
    ? document.getElementById("customCompetitor").value.trim()
    : competitorSelect.value;

  const priceValue = document.getElementById("price").value.trim();

  // 🔒 ВАЛИДАЦИЯ — защита от пустых записей
  if (!competitorValue) {
    alert("Выберите конкурента или укажите вручную");
    return;
  }

  if (!priceValue) {
    alert("Введите цену");
    return;
  }

  const params = new URLSearchParams({
    competitor: competitorValue,
    age: document.getElementById("age").value,
    quality: document.getElementById("quality").value,
    price: priceValue,
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

      // очистка input
      document.querySelectorAll("input").forEach(i => i.value = "");

      // сброс всех select в первое значение
      document.querySelectorAll("select").forEach(s => s.selectedIndex = 0);

      // скрыть поле "Другое"
      const customBlock = document.getElementById("customCompetitorBlock");
      if (customBlock) customBlock.style.display = "none";

      // прокрутка наверх
      window.scrollTo({ top: 0, behavior: "smooth" });

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
