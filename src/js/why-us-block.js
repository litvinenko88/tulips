document.addEventListener("DOMContentLoaded", function () {
  const modalOverlay = document.getElementById("thModalOverlay");
  const modalForm = document.getElementById("thModalForm");
  const orderForm = document.getElementById("thOrderForm");
  const successNotification = document.getElementById("thSuccessNotification");

  // Открытие модального окна
  document
    .querySelector(".th-advantages-btn")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.body.style.overflow = "hidden";
      modalOverlay.classList.add("active");
    });

  // Закрытие модального окна
  function closeModal() {
    document.body.style.overflow = "";
    modalOverlay.classList.remove("active");
  }

  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay || e.target.closest(".th-modal-close")) {
      closeModal();
    }
  });

  // Валидация телефона
  const phoneInput = document.getElementById("th-modalPhone");
  const phoneError = document.getElementById("thModalPhoneError");
  const nameInput = document.getElementById("th-modalName");

  phoneInput.addEventListener("input", function () {
    const phoneValue = this.value.trim();
    const isValid =
      /^(\+7|8)[\s(]?\d{3}[)\s]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(phoneValue);

    if (!isValid && phoneValue.length > 0) {
      this.classList.add("error");
      phoneError.style.display = "block";
    } else {
      this.classList.remove("error");
      phoneError.style.display = "none";
    }
  });

  // Отправка формы
  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Проверка валидации
    const phoneValue = phoneInput.value.trim();
    const nameValue = nameInput.value.trim();
    const isValidPhone =
      /^(\+7|8)[\s(]?\d{3}[)\s]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(phoneValue);

    if (!isValidPhone) {
      phoneInput.classList.add("error");
      phoneError.style.display = "block";
      return;
    }

    // Отправка данных в Telegram бот
    const botToken = "7757545287:AAHNWgBvNyxNfvhfz_ktJ1NCIJJqB5FxV0Y";
    const chatId = "682859146";
    const message = `Новая заявка 🔥🔥🔥 блок "Почему нас выбирают":\nИмя: ${nameValue}\nТелефон: ${phoneValue}`;

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
        console.log("Сообщение отправлено в Telegram:", data);
        closeModal();
        successNotification.style.display = "block";

        setTimeout(() => {
          successNotification.style.display = "none";
        }, 3000);

        // Очистка формы
        orderForm.reset();
      })
      .catch((error) => {
        console.error("Ошибка при отправке в Telegram:", error);
        // В случае ошибки все равно показываем уведомление пользователю
        closeModal();
        successNotification.style.display = "block";

        setTimeout(() => {
          successNotification.style.display = "none";
        }, 3000);

        orderForm.reset();
      });
  });
});
