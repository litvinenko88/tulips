document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".tulip-slider");
  const cards = Array.from(document.querySelectorAll(".tulip-card"));
  const prevArrow = document.querySelector(".tulip-prev-arrow");
  const nextArrow = document.querySelector(".tulip-next-arrow");
  const modalOverlay = document.querySelector(".tulip-modal-overlay");
  const closeModalBtn = document.querySelector(".tulip-close-modal");
  const orderForm = document.getElementById("tulip-order-form");
  const phoneInput = document.getElementById("tulip-phone");
  const nameInput = document.getElementById("tulip-name");
  const cardNameInput = document.getElementById("tulip-card-name");

  // Таймер для автоматического переключения
  let autoSlideInterval;
  let isUserInteracting = false;
  let interactionTimeout;
  let touchStartX = 0;
  let touchEndX = 0;
  let isAnimating = false;

  // Инициализация слайдера
  function initSlider() {
    // Устанавливаем начальные позиции
    cards.forEach((card, index) => {
      const pos = index - Math.floor(cards.length / 2);
      card.dataset.pos = pos;

      // Добавляем обработчик для кнопки заказа в карточке
      const orderBtn = card.querySelector(".tulip-order-btn");
      if (orderBtn) {
        orderBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          const cardTitle = card.querySelector(".tulip-card-title").textContent;
          cardNameInput.value = cardTitle;

          // Сохраняем и фиксируем позицию скролла
          scrollPosition = window.pageYOffset;
          document.body.classList.add("tulip-modal-open");
          document.body.style.setProperty(
            "--scroll-top",
            `-${scrollPosition}px`
          );
          document.body.style.top = `-${scrollPosition}px`;
          document.body.style.position = "fixed";
          document.body.style.width = "100%";

          modalOverlay.style.display = "flex";
          setTimeout(() => {
            modalOverlay.classList.add("active");
          }, 10);
        });
      }
    });

    // Добавляем обработчики событий
    addEventListeners();
    startAutoSlide();
  }

  // Добавление обработчиков событий
  function addEventListeners() {
    // Обработчики для карточек
    cards.forEach((card) => {
      card.addEventListener("click", handleCardClick);
      card.addEventListener("touchstart", handleTouchStart, { passive: true });
      card.addEventListener("touchend", handleTouchEnd, { passive: true });
    });

    // Обработчики для слайдера
    slider.addEventListener("touchstart", handleTouchStart, { passive: true });
    slider.addEventListener("touchend", handleTouchEnd, { passive: true });
    slider.addEventListener("mousedown", handleMouseDown);

    // Обработчики для стрелок
    prevArrow.addEventListener("click", goToPrevCard);
    nextArrow.addEventListener("click", goToNextCard);

    // Обработчики для модального окна
    closeModalBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    // Обработчики для формы
    orderForm.addEventListener("submit", handleFormSubmit);
    phoneInput.addEventListener("input", formatPhoneNumber);
  }

  // Обработчик клика по карточке
  function handleCardClick(e) {
    if (isAnimating) return;

    const newActive = e.currentTarget;
    if (parseInt(newActive.dataset.pos) === 0) return;

    updateActiveCard(newActive);
    resetAutoSlide();
  }

  // Обработчик начала касания
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    setUserInteracting(true);
  }

  // Обработчик окончания касания
  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    setUserInteracting(false);
  }

  // Обработчик нажатия кнопки мыши
  function handleMouseDown() {
    setUserInteracting(true);
    document.addEventListener("mouseup", handleMouseUp);
  }

  // Обработчик отпускания кнопки мыши
  function handleMouseUp() {
    setUserInteracting(false);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  // Обработка свайпа
  function handleSwipe() {
    if (isAnimating) return;

    const threshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNextCard();
      } else {
        goToPrevCard();
      }
    }
  }

  // Переход к предыдущей карточке
  function goToPrevCard() {
    if (isAnimating) return;

    const activeCard = document.querySelector('.tulip-card[data-pos="0"]');
    const activeIndex = cards.indexOf(activeCard);
    const prevIndex = (activeIndex - 1 + cards.length) % cards.length;
    updateActiveCard(cards[prevIndex]);
    resetAutoSlide();
  }

  // Переход к следующей карточке
  function goToNextCard() {
    if (isAnimating) return;

    const activeCard = document.querySelector('.tulip-card[data-pos="0"]');
    const activeIndex = cards.indexOf(activeCard);
    const nextIndex = (activeIndex + 1) % cards.length;
    updateActiveCard(cards[nextIndex]);
    resetAutoSlide();
  }

  // Обновление активной карточки
  function updateActiveCard(newActive) {
    if (isAnimating) return;
    isAnimating = true;

    const newActivePos = parseInt(newActive.dataset.pos);

    cards.forEach((card) => {
      const currentPos = parseInt(card.dataset.pos);
      card.dataset.pos = getNewPosition(currentPos, newActivePos);
    });

    // Завершаем анимацию после небольшой задержки
    setTimeout(() => {
      isAnimating = false;
    }, 300);
  }

  // Вычисление новой позиции (исправленная версия)
  function getNewPosition(currentPos, activePos) {
    const diff = currentPos - activePos;
    const numCards = cards.length;
    const half = Math.floor(numCards / 2);

    // Если разница больше половины количества карточек, корректируем позицию
    if (Math.abs(diff) > half) {
      return diff > 0 ? diff - numCards : diff + numCards;
    }

    return diff;
  }

  // Установка состояния взаимодействия пользователя
  function setUserInteracting(interacting) {
    isUserInteracting = interacting;

    if (interactionTimeout) {
      clearTimeout(interactionTimeout);
    }

    if (!interacting) {
      interactionTimeout = setTimeout(() => {
        resetAutoSlide();
      }, 2000);
    } else {
      clearInterval(autoSlideInterval);
    }
  }

  // Автоматическое переключение на следующий слайд
  function autoSlideNext() {
    if (!isUserInteracting && !isAnimating) {
      goToNextCard();
    }
  }

  // Запуск автоматического переключения
  function startAutoSlide() {
    if (!isUserInteracting) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(autoSlideNext, 4000);
    }
  }

  // Сброс автоматического переключения
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Закрытие модального окна
  function closeModal() {
    modalOverlay.classList.remove("active");
    setTimeout(() => {
      // Восстанавливаем скролл
      const scrollY = document.body.style.top;
      modalOverlay.style.display = "none";
      document.body.classList.remove("tulip-modal-open");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("width");
      window.scrollTo(0, parseInt(scrollY || "0") * -1);

      orderForm.reset();
      document.getElementById("tulip-name-error").textContent = "";
      document.getElementById("tulip-phone-error").textContent = "";
    }, 300);
  }

  // Форматирование номера телефона
  function formatPhoneNumber() {
    let value = phoneInput.value.replace(/\D/g, "");

    if (value.startsWith("7") || value.startsWith("8")) {
      value = value.substring(1);
    }

    let formattedValue = "+7 (" + value.substring(0, 3);
    if (value.length > 3) {
      formattedValue += ") " + value.substring(3, 6);
    }
    if (value.length > 6) {
      formattedValue += "-" + value.substring(6, 8);
    }
    if (value.length > 8) {
      formattedValue += "-" + value.substring(8, 10);
    }

    phoneInput.value = formattedValue;
  }

  // Валидация формы
  function validateForm() {
    let isValid = true;
    const nameError = document.getElementById("tulip-name-error");
    const phoneError = document.getElementById("tulip-phone-error");

    // Валидация имени
    if (nameInput.value.trim() === "") {
      nameError.textContent = "Пожалуйста, введите ваше имя";
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      nameError.textContent = "Имя должно содержать минимум 2 символа";
      isValid = false;
    } else {
      nameError.textContent = "";
    }

    // Валидация телефона
    const phoneValue = phoneInput.value.replace(/\D/g, "");
    if (phoneValue === "") {
      phoneError.textContent = "Пожалуйста, введите номер телефона";
      isValid = false;
    } else if (phoneValue.startsWith("7") || phoneValue.startsWith("8")) {
      if (phoneValue.length !== 11) {
        phoneError.textContent = "Номер должен содержать 11 цифр";
        isValid = false;
      } else {
        phoneError.textContent = "";
      }
    } else if (phoneValue.startsWith("+7")) {
      if (phoneValue.length !== 12) {
        phoneError.textContent = "Номер должен содержать 12 цифр";
        isValid = false;
      } else {
        phoneError.textContent = "";
      }
    } else {
      phoneError.textContent =
        "Введите номер в формате +7 (XXX) XXX-XX-XX или 8 (XXX) XXX-XX-XX";
      isValid = false;
    }

    return isValid;
  }

  // Обработчик отправки формы
  function handleFormSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
      const formData = {
        name: nameInput.value.trim(),
        phone: phoneInput.value,
        card: cardNameInput.value,
        source: "блок топ 6 сортов",
      };

      sendToTelegram(formData);
    }
  }

  // Отправка данных в Telegram
  function sendToTelegram(data) {
    const botToken = "7757545287:AAHNWgBvNyxNfvhfz_ktJ1NCIJJqB5FxV0Y";
    const chatId = "682859146";

    const message =
      `Новая заявка:\n\n` +
      `Откуда: ${data.source}\n` +
      `Карточка: ${data.card}\n` +
      `Имя: ${data.name}\n` +
      `Телефон: ${data.phone}`;

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
        if (data.ok) {
          showTulipNotification(
            "Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
            "success"
          );
          closeModal();
        } else {
          showTulipNotification(
            "Произошла ошибка при отправке данных. Попробуйте еще раз или используйте другую форму заказа",
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showTulipNotification(
          "Произошла ошибка при отправке данных. Попробуйте еще раз или используйте другую форму заказа",
          "error"
        );
      });
  }

  // Функция для показа уведомлений (с уникальными классами)
  function showTulipNotification(message, type) {
    // Создаем элемент уведомления
    const notification = document.createElement("div");
    notification.className = `tulip-notification tulip-notification-${type}`;
    notification.textContent = message;

    // Добавляем уведомление в body
    document.body.appendChild(notification);

    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
      notification.classList.add("tulip-notification-hide");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }

  // Инициализация слайдера
  initSlider();
});
