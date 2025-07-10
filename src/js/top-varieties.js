document.addEventListener("DOMContentLoaded", function () {
  // Инициализация слайдера
  const slider = document.querySelector(".tulip-slider");
  const cards = document.querySelectorAll(".tulip-card");
  const prevArrow = document.querySelector(".tulip-prev-arrow");
  const nextArrow = document.querySelector(".tulip-next-arrow");

  // Таймер для автоматического переключения
  let autoSlideInterval;

  // Устанавливаем начальные позиции для карточек
  function initSlider() {
    cards.forEach((card, index) => {
      const pos = index - 2; // Центрируем среднюю карточку
      card.dataset.pos = pos;

      // Добавляем обработчик клика для карточек
      card.addEventListener("click", function () {
        if (parseInt(this.dataset.pos) !== 0) {
          updateActiveCard(this);
          resetAutoSlide(); // Сброс таймера при ручном переключении
        }
      });
    });

    startAutoSlide(); // Запускаем автоматическое переключение
  }

  // Обновление активной карточки
  function updateActiveCard(newActive) {
    const newActivePos = parseInt(newActive.dataset.pos);

    cards.forEach((card) => {
      const currentPos = parseInt(card.dataset.pos);
      card.dataset.pos = getNewPosition(currentPos, newActivePos);
    });
  }

  // Вычисление новой позиции
  function getNewPosition(currentPos, activePos) {
    const diff = currentPos - activePos;

    // Если разница больше 2 (для циклического слайдера)
    if (Math.abs(diff) > 2) {
      return -currentPos;
    }

    return diff;
  }

  // Функция для автоматического переключения на следующий слайд
  function autoSlideNext() {
    const activeCard = document.querySelector('.tulip-card[data-pos="0"]');
    const nextCard = activeCard.nextElementSibling || cards[0];
    updateActiveCard(nextCard);
  }

  // Запуск автоматического переключения
  function startAutoSlide() {
    autoSlideInterval = setInterval(autoSlideNext, 4000); // 4 секунды
  }

  // Сброс автоматического переключения
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Обработчики для стрелок
  prevArrow.addEventListener("click", function () {
    const activeCard = document.querySelector('.tulip-card[data-pos="0"]');
    const prevCard =
      activeCard.previousElementSibling || cards[cards.length - 1];
    updateActiveCard(prevCard);
    resetAutoSlide(); // Сброс таймера при ручном переключении
  });

  nextArrow.addEventListener("click", function () {
    const activeCard = document.querySelector('.tulip-card[data-pos="0"]');
    const nextCard = activeCard.nextElementSibling || cards[0];
    updateActiveCard(nextCard);
    resetAutoSlide(); // Сброс таймера при ручном переключении
  });

  // Инициализация модального окна
  const orderButtons = document.querySelectorAll(".tulip-order-btn");
  const modalOverlay = document.querySelector(".tulip-modal-overlay");
  const closeModal = document.querySelector(".tulip-close-modal");
  const cardNameInput = document.getElementById("tulip-card-name");

  orderButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();
      const cardName = this.getAttribute("data-card");
      cardNameInput.value = cardName;
      modalOverlay.classList.add("active");
    });
  });

  closeModal.addEventListener("click", function () {
    modalOverlay.classList.remove("active");
  });

  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("active");
    }
  });

  // Валидация формы
  const orderForm = document.getElementById("tulip-order-form");
  const nameInput = document.getElementById("tulip-name");
  const phoneInput = document.getElementById("tulip-phone");
  const nameError = document.getElementById("tulip-name-error");
  const phoneError = document.getElementById("tulip-phone-error");

  // Функция для нормализации телефона
  function normalizePhone(phone) {
    return phone
      .replace(/[^\d+]/g, "")
      .replace(/^8/, "+7")
      .replace(/^\+?7/, "+7");
  }

  // Функция проверки валидности телефона
  function isValidPhone(phone) {
    const normalized = normalizePhone(phone);
    return /^\+7\d{10}$/.test(normalized);
  }

  // Функция отправки данных в Telegram
  async function sendToTelegram(name, phone, cardName) {
    const botToken = "7757545287:AAHNWgBvNyxNfvhfz_ktJ1NCIJJqB5FxV0Y";
    const chatId = "682859146";
    const text = `Топ 6 сортов\n\nСорт: ${cardName}\nИмя: ${name}\nТелефон: ${phone}`;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error("Ошибка отправки:", error);
      return false;
    }
  }

  orderForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    let isValid = true;

    // Валидация имени
    if (nameInput.value.trim() === "") {
      nameError.textContent = "Пожалуйста, введите ваше имя";
      nameError.style.display = "block";
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      nameError.textContent = "Имя должно содержать минимум 2 символа";
      nameError.style.display = "block";
      isValid = false;
    } else {
      nameError.style.display = "none";
    }

    // Валидация телефона
    if (!isValidPhone(phoneInput.value)) {
      phoneError.textContent =
        "Введите корректный номер телефона (например: +79991234567 или 89991234567)";
      phoneError.style.display = "block";
      isValid = false;
    } else {
      phoneError.style.display = "none";
    }

    if (isValid) {
      const normalizedPhone = normalizePhone(phoneInput.value);
      const cardName = cardNameInput.value;
      const name = nameInput.value.trim();

      // Отправка в Telegram
      const isSent = await sendToTelegram(name, normalizedPhone, cardName);

      if (isSent) {
        // Успешная отправка
        orderForm.reset();
        modalOverlay.classList.remove("active");

        // Можно добавить уведомление об успешной отправке
        const successMessage = document.createElement("div");
        successMessage.textContent = "Ваша заявка успешно отправлена!";
        successMessage.style.position = "fixed";
        successMessage.style.bottom = "20px";
        successMessage.style.right = "20px";
        successMessage.style.padding = "15px";
        successMessage.style.backgroundColor = "#4CAF50";
        successMessage.style.color = "white";
        successMessage.style.borderRadius = "5px";
        successMessage.style.zIndex = "1000";
        document.body.appendChild(successMessage);

        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 3000);
      } else {
        // Ошибка отправки
        const errorMessage = document.createElement("div");
        errorMessage.textContent =
          "Ошибка при отправке заявки. Пожалуйста, попробуйте позже.";
        errorMessage.style.position = "fixed";
        errorMessage.style.bottom = "20px";
        errorMessage.style.right = "20px";
        errorMessage.style.padding = "15px";
        errorMessage.style.backgroundColor = "#f44336";
        errorMessage.style.color = "white";
        errorMessage.style.borderRadius = "5px";
        errorMessage.style.zIndex = "1000";
        document.body.appendChild(errorMessage);

        setTimeout(() => {
          document.body.removeChild(errorMessage);
        }, 3000);
      }
    }
  });

  // Инициализация слайдера
  initSlider();
});
