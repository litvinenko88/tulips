document.addEventListener("DOMContentLoaded", function () {
  // Элементы слайдера
  const slider = document.querySelector(".slider");
  const cards = document.querySelectorAll(".card");
  const prevArrow = document.querySelector(".prev-arrow");
  const nextArrow = document.querySelector(".next-arrow");

  // Элементы модального окна
  const orderBtns = document.querySelectorAll(".order-btn");
  const modalOverlay = document.querySelector(".modal-overlay");
  const closeModal = document.querySelector(".close-modal");
  const orderForm = document.getElementById("order-form");
  const cardNameInput = document.getElementById("card-name");

  let currentIndex = 0;
  let autoSlideInterval;
  const slideInterval = 4000; // 4 секунды

  // Инициализация слайдера
  function initSlider() {
    updateCards();
    startAutoSlide();
  }

  // Обновление видимых карточек
  function updateCards() {
    cards.forEach((card, index) => {
      card.classList.remove("active");

      // Определяем позицию карточки относительно текущей
      let position = (index - currentIndex + cards.length) % cards.length;

      // Центральная карточка
      if (position === 0) {
        card.classList.add("active");
      }
    });

    // Плавная прокрутка к активной карточке
    const activeCard = cards[currentIndex];
    slider.scrollTo({
      left:
        activeCard.offsetLeft -
        (slider.offsetWidth - activeCard.offsetWidth) / 2,
      behavior: "smooth",
    });
  }

  // Переход к предыдущей карточке
  function prevSlide() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCards();
    resetAutoSlide();
  }

  // Переход к следующей карточке
  function nextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCards();
    resetAutoSlide();
  }

  // Автоматическая прокрутка
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, slideInterval);
  }

  // Сброс автоматической прокрутки
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Обработчики событий для стрелок
  prevArrow.addEventListener("click", prevSlide);
  nextArrow.addEventListener("click", nextSlide);

  // Остановка автоматической прокрутки при наведении
  slider.addEventListener("mouseenter", () => {
    clearInterval(autoSlideInterval);
  });

  // Возобновление автоматической прокрутки при уходе курсора
  slider.addEventListener("mouseleave", () => {
    resetAutoSlide();
  });

  // Модальное окно
  orderBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const cardName = this.getAttribute("data-card");
      cardNameInput.value = cardName;
      modalOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  closeModal.addEventListener("click", function () {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Валидация формы
  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const nameError = document.getElementById("name-error");
    const phoneError = document.getElementById("phone-error");

    let isValid = true;

    // Валидация имени
    if (name.length < 2) {
      nameError.textContent = "Имя должно содержать минимум 2 символа";
      isValid = false;
    } else {
      nameError.textContent = "";
    }

    // Валидация телефона
    const phoneRegex = /^(\+7|8)[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      phoneError.textContent =
        "Введите телефон в формате +7XXXXXXXXXX или 8XXXXXXXXXX";
      isValid = false;
    } else {
      phoneError.textContent = "";
    }

    if (isValid) {
      sendToTelegram(name, phone, cardNameInput.value);
    }
  });

  // Отправка данных в Telegram
  function sendToTelegram(name, phone, cardName) {
    const botToken = "7757545287:AAHNWgBvNyxNfvhfz_ktJ1NCIJJqB5FxV0Y";
    const chatId = "682859146";
    const message = `Новый заказ:\n\nТовар: ${cardName}\nИмя: ${name}\nТелефон: ${phone}`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(
          "Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время."
        );
        modalOverlay.classList.remove("active");
        document.body.style.overflow = "";
        orderForm.reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(
          "Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз."
        );
      });
  }

  // Инициализация слайдера
  initSlider();
});
