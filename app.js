const API_URL = "https://script.google.com/macros/s/AKfycbxnDAJtMI-PSsaWtUm2QSKoZKuEqRCTXGcYI7ZewtPJCQ-pHlGpdo0QsVV32P2WOdQfsA/exec";

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
  const bulkPriceValue = document.getElementById("bulkPrice").value.trim();

  // 🔒 ВАЛИДАЦИЯ
  if (!competitorValue) {
    alert("Выберите конкурента или укажите вручную");
    return;
  }

  if (!priceValue) {
    alert("Введите цену");
    return;
  }

  // защита от букв и мусора
  if (isNaN(priceValue.replace(",", "."))) {
    alert("Цена должна быть числом. Пример: 8,5");
    return;
  }

  if (bulkPriceValue && isNaN(bulkPriceValue.replace(",", "."))) {
    alert("Оптовая цена должна быть числом. Пример: 7,5");
    return;
  }

  const params = new URLSearchParams({
    competitor: competitorValue,
    age: document.getElementById("age").value,
    quality: document.getElementById("quality").value,
    price: priceValue,          // отправляем как есть: 8,5
    bulkPrice: bulkPriceValue,  // отправляем как есть: 7,5
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

