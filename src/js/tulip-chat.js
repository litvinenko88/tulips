document.addEventListener("DOMContentLoaded", function () {
  // Элементы интерфейса
  const chatBtn = document.querySelector(".th-chat-btn");
  const notification = document.getElementById("thNotification");
  const notificationClose = document.getElementById("thNotificationClose");
  const offerForm = document.getElementById("thOfferForm");
  const formClose = document.getElementById("thFormClose");
  const chatWindow = document.getElementById("thChatWindow");
  const chatClose = document.getElementById("thChatClose");
  const contactForm = document.getElementById("thContactForm");
  const chatForm = document.getElementById("thChatForm");
  const successNotification = document.getElementById("thSuccessNotification");

  // Флаги для отслеживания взаимодействия с формой
  let isFormInteracted = false;
  let formAutoCloseTimeout;

  // Проверка, было ли уже показано уведомление
  const notificationShown = localStorage.getItem("notificationShown");
  const formShown = localStorage.getItem("formShown");

  // Таймер
  let days = 1;
  let hours = 18;
  let minutes = 15;
  let seconds = 21;
  let timerInterval;

  //время
  const openingNotification = 17000;
  const closeNotificatio = 12000;
  const openForm = 10000;
  const closeForm = 8000;

  // Инициализация таймера
  function initTimer() {
    // Проверяем, есть ли сохраненное время в localStorage
    const savedTime = localStorage.getItem("offerTimer");
    if (savedTime) {
      const timeArray = savedTime.split(":");
      days = parseInt(timeArray[0]);
      hours = parseInt(timeArray[1]);
      minutes = parseInt(timeArray[2]);
      seconds = parseInt(timeArray[3]);
    }

    updateTimerDisplay();

    timerInterval = setInterval(function () {
      if (seconds > 0) {
        seconds--;
      } else {
        if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else {
          if (hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
          } else {
            if (days > 0) {
              days--;
              hours = 23;
              minutes = 59;
              seconds = 59;
            } else {
              clearInterval(timerInterval);
              return;
            }
          }
        }
      }

      updateTimerDisplay();
      localStorage.setItem(
        "offerTimer",
        `${days}:${hours}:${minutes}:${seconds}`
      );
    }, 1000);
  }

  function updateTimerDisplay() {
    document.getElementById("th-days").textContent = days;
    document.getElementById("th-hours").textContent = hours;
    document.getElementById("th-minutes").textContent = minutes;
    document.getElementById("th-seconds").textContent = seconds;
  }

  // Показать уведомление через 17 секунд после загрузки страницы
  if (!notificationShown) {
    setTimeout(function () {
      notification.classList.add("show");
      localStorage.setItem("notificationShown", "true");

      // Автоматическое закрытие через 5 секунд
      setTimeout(function () {
        if (notification.classList.contains("show")) {
          closeNotification();
        }
      }, closeNotificatio);
    }, openingNotification);
  }

  // Закрытие уведомления
  function closeNotification() {
    notification.classList.remove("show");

    // Показать форму через 12 секунды после закрытия уведомления
    if (!formShown) {
      setTimeout(function () {
        showOfferForm();
        localStorage.setItem("formShown", "true");
      }, openForm);
    }
  }

  notificationClose.addEventListener("click", closeNotification);

  // Показать форму предложения
  function showOfferForm() {
    offerForm.classList.add("show");
    initTimer();

    // Автоматическое закрытие через 5 секунд, если пользователь не взаимодействовал с формой
    if (!isFormInteracted) {
      formAutoCloseTimeout = setTimeout(function () {
        if (offerForm.classList.contains("show") && !isFormInteracted) {
          closeOfferForm();
        }
      }, closeForm);
    }
  }

  // Закрытие формы
  function closeOfferForm() {
    offerForm.classList.remove("show");
    clearTimeout(formAutoCloseTimeout);
  }

  formClose.addEventListener("click", closeOfferForm);

  // Отслеживание взаимодействия с формой
  offerForm.addEventListener("input", function () {
    isFormInteracted = true;
    clearTimeout(formAutoCloseTimeout);
  });

  // Открытие чата по клику на кнопку
  chatBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Если уведомление или форма открыты - закрываем их
    if (notification.classList.contains("show")) {
      notification.classList.remove("show");
    }
    if (offerForm.classList.contains("show")) {
      offerForm.classList.remove("show");
    }

    // Открываем чат
    chatWindow.classList.add("show");
  });

  // Закрытие чата
  function closeChat() {
    chatWindow.classList.remove("show");
  }

  chatClose.addEventListener("click", closeChat);

  // Валидация телефона
  function validatePhone(phone) {
    const phoneRegex =
      /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return phoneRegex.test(phone);
  }

  // Валидация формы контактов
  function validateContactForm() {
    const name = document.getElementById("th-name").value.trim();
    const phone = document.getElementById("th-phone").value.trim();
    const phoneError = document.getElementById("thPhoneError");
    const submitBtn = document.getElementById("thSubmitBtn");

    let isValid = true;

    if (phone && !validatePhone(phone)) {
      document.getElementById("th-phone").classList.add("error");
      phoneError.innerHTML =
        "Некорректный номер телефона. Пример: +7(123)456-78-90 или 81234567890";
      phoneError.style.display = "block";
      isValid = false;
    } else {
      document.getElementById("th-phone").classList.remove("error");
      phoneError.style.display = "none";
    }

    if (name && phone && validatePhone(phone)) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }

    return isValid;
  }

  // Валидация формы чата
  function validateChatForm() {
    const name = document.getElementById("th-chatName").value.trim();
    const phone = document.getElementById("th-chatPhone").value.trim();
    const phoneError = document.getElementById("thChatPhoneError");
    const submitBtn = document.getElementById("thChatSubmitBtn");

    let isValid = true;

    if (phone && !validatePhone(phone)) {
      document.getElementById("th-chatPhone").classList.add("error");
      phoneError.innerHTML =
        "Некорректный номер телефона. Пример: +7(123)456-78-90 или 81234567890";
      phoneError.style.display = "block";
      isValid = false;
    } else {
      document.getElementById("th-chatPhone").classList.remove("error");
      phoneError.style.display = "none";
    }

    if (name && phone && validatePhone(phone)) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }

    return isValid;
  }

  // Слушатели событий для валидации
  document.getElementById("th-phone").addEventListener("input", function () {
    validateContactForm();
    isFormInteracted = true;
    clearTimeout(formAutoCloseTimeout);
  });

  document.getElementById("th-name").addEventListener("input", function () {
    validateContactForm();
    isFormInteracted = true;
    clearTimeout(formAutoCloseTimeout);
  });

  document
    .getElementById("th-chatPhone")
    .addEventListener("input", validateChatForm);
  document
    .getElementById("th-chatName")
    .addEventListener("input", validateChatForm);

  // Показать уведомление об успехе
  function showSuccessNotification() {
    successNotification.style.display = "block";
    setTimeout(function () {
      successNotification.style.display = "none";
    }, 3000);
  }

  // Отправка данных в Telegram
  function sendToTelegram(data, formType) {
    const botToken = "7757545287:AAHNWgBvNyxNfvhfz_ktJ1NCIJJqB5FxV0Y";
    const chatId = "682859146";

    let message = `Новая заявка 🔥🔥🔥 с чата оператора !\n\n`;
    message += `Тип формы: ${formType}\n`;
    message += `Имя: ${data.name}\n`;
    message += `Телефон: ${data.phone}\n`;
    message += `Таймер: ${days} дн ${hours} ч ${minutes} мин ${seconds} сек`;

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
        console.log("Сообщение отправлено:", data);
        // Показываем уведомление об успехе
        showSuccessNotification();

        // Закрываем форму после успешной отправки
        if (formType === "Спецпредложение") {
          closeOfferForm();
        } else {
          closeChat();
        }
      })
      .catch((error) => {
        console.error("Ошибка отправки:", error);
        alert(
          "Произошла ошибка при отправке данных. Пожалуйста, попробуйте еще раз."
        );
      });
  }

  // Обработка отправки формы контактов
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateContactForm()) {
      const formData = {
        name: document.getElementById("th-name").value.trim(),
        phone: document.getElementById("th-phone").value.trim(),
      };

      sendToTelegram(formData, "Спецпредложение");
    }
  });

  // Обработка отправки формы чата
  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateChatForm()) {
      const formData = {
        name: document.getElementById("th-chatName").value.trim(),
        phone: document.getElementById("th-chatPhone").value.trim(),
      };

      sendToTelegram(formData, "Чат");
    }
  });
});
