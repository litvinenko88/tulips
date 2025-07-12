// Обработка форм
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("thConsultationForm");
  const notification = document.getElementById("thFormNotification");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      notification.style.display = "none";

      // Валидация
      const name = form.querySelector('input[name="name"]');
      const phone = form.querySelector('input[name="phone"]');

      if (!name.value.trim()) {
        showError("Пожалуйста, введите ваше имя", name);
        return;
      }

      const phoneValue = phone.value.replace(/\D/g, "");
      if (!phoneValue || phoneValue.length < 11) {
        showError("Введите корректный номер телефона", phone);
        return;
      }

      // Отправка данных
      sendFormData({
        name: name.value.trim(),
        phone: phoneValue.startsWith("7") ? phoneValue : "7" + phoneValue,
        source: "Главная форма",
      });
    });

    // Маска для телефона
    const phoneInput = form.querySelector('input[name="phone"]');
    phoneInput.addEventListener("input", function (e) {
      let value = this.value.replace(/\D/g, "");
      if (value.length > 11) value = value.substring(0, 11);

      let formattedValue = "";
      if (value.length > 0) {
        formattedValue = "+7 ";
        if (value.length > 1) formattedValue += "(" + value.substring(1, 4);
        if (value.length > 4) formattedValue += ") " + value.substring(4, 7);
        if (value.length > 7) formattedValue += "-" + value.substring(7, 9);
        if (value.length > 9) formattedValue += "-" + value.substring(9, 11);
      }

      this.value = formattedValue;
    });
  }

  function showError(message, input = null) {
    notification.textContent = message;
    notification.style.display = "block";
    notification.style.color = "red";

    if (input) {
      input.classList.add("th-error");
      input.focus();
    }
  }

  function sendFormData(data) {
    const botToken = "7757545287:AAHNWgBvNyxNfvhfz_ktJ1NCIJJqB5FxV0Y";
    const chatId = "682859146";
    const message = `📌 Новая заявка с сайта (${data.source}):
👤 Имя: ${data.name}
📞 Телефон: +${data.phone}`;

    fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
        message
      )}`
    )
      .then((response) => {
        if (response.ok) {
          showSuccess(
            "Форма отправлена! Мы свяжемся с вами в ближайшее время."
          );
          form.reset();
        } else {
          throw new Error("Ошибка отправки");
        }
      })
      .catch((error) => {
        showError("Ошибка отправки формы. Пожалуйста, попробуйте позже.");
      });
  }

  function showSuccess(message) {
    notification.textContent = message;
    notification.style.display = "block";
    notification.style.color = "green";

    setTimeout(() => {
      notification.style.display = "none";
    }, 5000);
  }
});
