document.addEventListener("DOMContentLoaded", function () {
  // Элементы интерфейса
  const chatBtn = document.querySelector(".chat-btn");
  const notification = document.getElementById("notification");
  const notificationClose = document.getElementById("notificationClose");
  const offerForm = document.getElementById("offerForm");
  const formClose = document.getElementById("formClose");
  const chatWindow = document.getElementById("chatWindow");
  const chatClose = document.getElementById("chatClose");
  const contactForm = document.getElementById("contactForm");
  const chatForm = document.getElementById("chatForm");

  // Проверка, было ли уже показано уведомление
  const notificationShown = localStorage.getItem("notificationShown");
  const formShown = localStorage.getItem("formShown");

  // Таймер
  let days = 1;
  let hours = 18;
  let minutes = 15;
  let seconds = 21;
  let timerInterval;

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
    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
  }

  // Показать уведомление через 5 секунд после загрузки страницы
  if (!notificationShown) {
    setTimeout(function () {
      notification.classList.add("show");
      localStorage.setItem("notificationShown", "true");

      // Автоматическое закрытие через 5 секунд
      setTimeout(function () {
        closeNotification();
      }, 5000);
    }, 5000);
  }

  // Закрытие уведомления
  function closeNotification() {
    notification.classList.remove("show");

    // Показать форму через 0.5 секунды после закрытия уведомления
    if (!formShown) {
      setTimeout(function () {
        offerForm.classList.add("show");
        initTimer();
        localStorage.setItem("formShown", "true");

        // Автоматическое закрытие через 5 секунд
        setTimeout(function () {
          closeOfferForm();
        }, 5000);
      }, 500);
    }
  }

  notificationClose.addEventListener("click", closeNotification);

  // Закрытие формы
  function closeOfferForm() {
    offerForm.classList.remove("show");
  }

  formClose.addEventListener("click", closeOfferForm);

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
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const phoneError = document.getElementById("phoneError");
    const submitBtn = document.getElementById("submitBtn");

    let isValid = true;

    if (phone && !validatePhone(phone)) {
      document.getElementById("phone").classList.add("error");
      phoneError.style.display = "block";
      isValid = false;
    } else {
      document.getElementById("phone").classList.remove("error");
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
    const name = document.getElementById("chatName").value.trim();
    const phone = document.getElementById("chatPhone").value.trim();
    const phoneError = document.getElementById("chatPhoneError");
    const submitBtn = document.getElementById("chatSubmitBtn");

    let isValid = true;

    if (phone && !validatePhone(phone)) {
      document.getElementById("chatPhone").classList.add("error");
      phoneError.style.display = "block";
      isValid = false;
    } else {
      document.getElementById("chatPhone").classList.remove("error");
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
  document
    .getElementById("phone")
    .addEventListener("input", validateContactForm);
  document
    .getElementById("name")
    .addEventListener("input", validateContactForm);
  document
    .getElementById("chatPhone")
    .addEventListener("input", validateChatForm);
  document
    .getElementById("chatName")
    .addEventListener("input", validateChatForm);

  // Отправка данных в Telegram
  function sendToTelegram(data, formType) {
    const botToken = "7757545287:AAHNWgBvNyxNfvhfz_ktJ1NCIJJqB5FxV0Y";
    const chatId = "682859146";

    let message = `Новая заявка с сайта TulipHolland!\n\n`;
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
        // Закрываем форму после успешной отправки
        if (formType === "Спецпредложение") {
          closeOfferForm();
        } else {
          closeChat();
        }

        // Показываем сообщение об успехе (можно добавить)
        alert("Спасибо! Ваши данные отправлены. Мы скоро с вами свяжемся.");
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
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
      };

      sendToTelegram(formData, "Спецпредложение");
    }
  });

  // Обработка отправки формы чата
  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateChatForm()) {
      const formData = {
        name: document.getElementById("chatName").value.trim(),
        phone: document.getElementById("chatPhone").value.trim(),
      };

      sendToTelegram(formData, "Чат");
    }
  });
});
