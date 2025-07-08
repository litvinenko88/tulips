document.addEventListener("DOMContentLoaded", function () {
  const tulipMobileMenu = document.getElementById("tulipMobileMenu");
  const tulipNavItems = document.getElementById("tulipNavItems");
  const tulipPriceBtn = document.querySelector(".tulip-btn-price-list");

  // Обработчик для гамбургер-меню
  tulipMobileMenu.addEventListener("click", function () {
    this.classList.toggle("open");
    tulipNavItems.classList.toggle("active");

    if (tulipNavItems.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // Закрытие меню при клике на ссылку
  const tulipNavLinks = document.querySelectorAll(".tulip-nav-items a");
  tulipNavLinks.forEach((item) => {
    item.addEventListener("click", function () {
      tulipMobileMenu.classList.remove("open");
      tulipNavItems.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Обработчик для кнопки "Получить прайс"
  const tulipPriceButtons = document.querySelectorAll(
    ".tulip-btn-price-list, .tulip-btn-main"
  );
  tulipPriceButtons.forEach((button) => {
    button.addEventListener("click", function () {
      alert("Введите ваш email и телефон, и мы отправим вам прайс-лист");
    });
  });

  // Анимация тюльпанов
  const tulipFlowers = document.querySelectorAll(".tulip-bg-flower");
  function moveTulipFlowers() {
    tulipFlowers.forEach((flower) => {
      const randomX = Math.random() * 80;
      const randomY = Math.random() * 80;
      const randomRotate = Math.random() * 360;
      flower.style.left = `${randomX}%`;
      flower.style.top = `${randomY}%`;
      flower.style.transform = `rotate(${randomRotate}deg)`;
    });
    setTimeout(moveTulipFlowers, 15000);
  }
  moveTulipFlowers();
});

// Бегущая строка
const tulipScrollingContent = document.querySelector(
  ".tulip-scrolling-content"
);
const tulipMarqueeText = tulipScrollingContent.textContent;
tulipScrollingContent.textContent = tulipMarqueeText.repeat(3);

//Чат онлайн
document.addEventListener("DOMContentLoaded", function () {
  // Элементы DOM
  const chatBtn = document.querySelector(".tulip-chat-btn");
  const notification = document.querySelector(".tulip-chat-notification");
  const closeNotificationBtn = document.querySelector(
    ".tulip-close-notification"
  );
  const offerForm = document.querySelector(".tulip-special-offer-form");
  const closeFormBtn = document.querySelector(".tulip-close-form");
  const submitBtn = document.querySelector(".tulip-get-offer-btn");
  const confirmation = document.querySelector(
    ".tulip-confirmation-notification"
  );
  const nameInput = document.querySelector(".tulip-input-name");
  const phoneInput = document.querySelector(".tulip-input-phone");

  // Аудио элементы
  const notificationSound = new Audio("sound/notification.mp3");
  const offerSound = new Audio("sound/offer.mp3");

  // Таймеры
  let notificationTimer;
  let autoCloseTimer;
  let formTimer;
  let confirmationTimer;
  let countdownTimer;

  // Настройки времени (в миллисекундах)
  const TIMING = {
    NOTIFICATION_DELAY: 17000, // 12 сек до показа уведомления
    NOTIFICATION_AUTO_CLOSE: 10000, // 5 сек до автозакрытия уведомления
    FORM_DELAY: 12000, // 5 сек до показа формы после уведомления
    CONFIRMATION_AUTO_CLOSE: 5000, // 5 сек до автозакрытия подтверждения
    OFFER_DAYS: 2, // 2 дня для таймера
  };

  // Инициализация
  initChatFunctionality();

  function initChatFunctionality() {
    // Позиционирование элементов при загрузке
    positionElements();
    window.addEventListener("resize", positionElements);

    // Показ уведомления через заданное время
    notificationTimer = setTimeout(showNotification, TIMING.NOTIFICATION_DELAY);

    // Обработчики событий
    chatBtn.addEventListener("click", toggleOfferForm);
    closeNotificationBtn.addEventListener("click", closeNotification);
    closeFormBtn.addEventListener("click", closeOfferForm);
    submitBtn.addEventListener("click", handleFormSubmit);
  }

  // Позиционирование уведомлений относительно кнопки чата
  function positionElements() {
    const chatBtnRect = chatBtn.getBoundingClientRect();
    const offset = 20;

    if (window.innerWidth > 768) {
      notification.style.right = `${
        window.innerWidth - chatBtnRect.right + offset
      }px`;
      notification.style.bottom = `${
        window.innerHeight - chatBtnRect.top + offset
      }px`;

      offerForm.style.right = `${
        window.innerWidth - chatBtnRect.right + offset
      }px`;
      offerForm.style.bottom = `${
        window.innerHeight - chatBtnRect.top + offset
      }px`;
    } else {
      // Для мобильных устройств
      notification.style.right = "20px";
      notification.style.bottom = "70px";
      offerForm.style.right = "20px";
      offerForm.style.bottom = "70px";
    }
  }

  function showNotification() {
    notification.style.display = "block";
    playSound(notificationSound);
    positionElements();

    // Автозакрытие уведомления через заданное время
    autoCloseTimer = setTimeout(() => {
      closeNotification();
      showOfferFormWithDelay();
    }, TIMING.NOTIFICATION_AUTO_CLOSE);
  }

  function closeNotification() {
    clearTimeout(autoCloseTimer);
    notification.style.display = "none";
  }

  function showOfferFormWithDelay() {
    formTimer = setTimeout(showOfferForm, TIMING.FORM_DELAY);
  }

  function showOfferForm() {
    offerForm.style.display = "block";
    playSound(offerSound);
    positionElements();
    startCountdownTimer();
  }

  function closeOfferForm() {
    offerForm.style.display = "none";
    clearInterval(countdownTimer);
  }

  function toggleOfferForm() {
    if (notification.style.display === "block") {
      closeNotification();
    }

    if (offerForm.style.display === "block") {
      closeOfferForm();
    } else {
      showOfferForm();
    }
  }

  function startCountdownTimer() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + TIMING.OFFER_DAYS);

    function updateTimer() {
      const now = new Date();
      const diff = endDate - now;

      if (diff <= 0) {
        clearInterval(countdownTimer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById("tulip-days").textContent = days
        .toString()
        .padStart(2, "0");
      document.getElementById("tulip-hours").textContent = hours
        .toString()
        .padStart(2, "0");
      document.getElementById("tulip-minutes").textContent = minutes
        .toString()
        .padStart(2, "0");
      document.getElementById("tulip-seconds").textContent = seconds
        .toString()
        .padStart(2, "0");
    }

    updateTimer();
    countdownTimer = setInterval(updateTimer, 1000);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    sendFormData()
      .then(() => {
        showConfirmation();
        closeOfferForm();
        resetForm();
      })
      .catch((error) => {
        console.error("Ошибка отправки формы:", error);
        alert("Произошла ошибка при отправке. Пожалуйста, попробуйте позже.");
      });
  }

  function validateForm() {
    if (nameInput.value.trim() === "") {
      alert("Пожалуйста, введите ваше имя");
      nameInput.focus();
      return false;
    }

    if (phoneInput.value.trim() === "") {
      alert("Пожалуйста, введите ваш телефон");
      phoneInput.focus();
      return false;
    }

    return true;
  }

  function sendFormData() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  function showConfirmation() {
    confirmation.style.display = "block";
    positionElements();

    confirmationTimer = setTimeout(() => {
      confirmation.style.display = "none";
    }, TIMING.CONFIRMATION_AUTO_CLOSE);
  }

  function resetForm() {
    nameInput.value = "";
    phoneInput.value = "";
  }

  // Воспроизведение звука с обработкой ошибок
  function playSound(audioElement) {
    audioElement
      .play()
      .catch((e) => console.log("Автовоспроизведение звука заблокировано:", e));
  }

  window.addEventListener("beforeunload", function () {
    clearTimeout(notificationTimer);
    clearTimeout(autoCloseTimer);
    clearTimeout(formTimer);
    clearTimeout(confirmationTimer);
    clearInterval(countdownTimer);
  });
});
