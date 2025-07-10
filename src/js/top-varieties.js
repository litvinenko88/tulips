document.addEventListener("DOMContentLoaded", function () {
  // Инициализация слайдера
  const slider = document.querySelector(".tulip-slider");
  const cards = document.querySelectorAll(".tulip-card");
  const prevArrow = document.querySelector(".tulip-prev-arrow");
  const nextArrow = document.querySelector(".tulip-next-arrow");

  // Устанавливаем начальные позиции для карточек
  function initSlider() {
    cards.forEach((card, index) => {
      const pos = index - 2; // Центрируем среднюю карточку
      card.dataset.pos = pos;

      // Добавляем обработчик клика для карточек
      card.addEventListener("click", function () {
        if (parseInt(this.dataset.pos) !== 0) {
          updateActiveCard(this);
        }
      });
    });
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

  // Обработчики для стрелок
  prevArrow.addEventListener("click", function () {
    const activeCard = document.querySelector('.tulip-card[data-pos="0"]');
    const prevCard =
      activeCard.previousElementSibling || cards[cards.length - 1];
    updateActiveCard(prevCard);
  });

  nextArrow.addEventListener("click", function () {
    const activeCard = document.querySelector('.tulip-card[data-pos="0"]');
    const nextCard = activeCard.nextElementSibling || cards[0];
    updateActiveCard(nextCard);
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

  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    // Валидация имени
    if (nameInput.value.trim() === "") {
      nameError.textContent = "Пожалуйста, введите ваше имя";
      isValid = false;
    } else {
      nameError.textContent = "";
    }

    // Валидация телефона
    const phoneRegex = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
    if (!phoneRegex.test(phoneInput.value)) {
      phoneError.textContent = "Пожалуйста, введите корректный номер телефона";
      isValid = false;
    } else {
      phoneError.textContent = "";
    }

    if (isValid) {
      // Здесь можно добавить отправку формы
      alert(
        `Заказ оформлен!\nСорт: ${cardNameInput.value}\nИмя: ${nameInput.value}\nТелефон: ${phoneInput.value}`
      );
      orderForm.reset();
      modalOverlay.classList.remove("active");
    }
  });

  // Инициализация слайдера
  initSlider();
});
