// Чат и уведомления
document.addEventListener("DOMContentLoaded", function () {
  const chatBtn = document.querySelector(".chat-btn");
  const notification = document.querySelector(".chat-notification");
  const closeNotificationBtn = document.querySelector(".close-notification");
  const offerForm = document.querySelector(".special-offer-form");
  const closeFormBtn = document.querySelector(".close-form");

  // Таймеры
  let notificationTimer, autoCloseTimer, formTimer;

  // Показать уведомление через 17 секунд
  notificationTimer = setTimeout(showNotification, 17000);

  // Обработчики событий
  chatBtn.addEventListener("click", toggleOfferForm);
  closeNotificationBtn.addEventListener("click", closeNotification);
  closeFormBtn.addEventListener("click", closeOfferForm);

  function showNotification() {
    notification.style.display = "block";
    positionElements();

    // Автозакрытие через 10 секунд
    autoCloseTimer = setTimeout(() => {
      closeNotification();
      showOfferFormWithDelay();
    }, 10000);
  }

  function closeNotification() {
    clearTimeout(autoCloseTimer);
    notification.style.display = "none";
  }

  function showOfferFormWithDelay() {
    formTimer = setTimeout(showOfferForm, 5000);
  }

  function showOfferForm() {
    offerForm.style.display = "block";
    positionElements();
    startCountdownTimer();
  }

  function closeOfferForm() {
    offerForm.style.display = "none";
    clearInterval(countdownTimer);
  }

  function toggleOfferForm() {
    if (notification.style.display === "block") closeNotification();
    offerForm.style.display === "block" ? closeOfferForm() : showOfferForm();
  }

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
      notification.style.right = "20px";
      notification.style.bottom = "70px";
      offerForm.style.right = "20px";
      offerForm.style.bottom = "70px";
    }
  }

  function startCountdownTimer() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 2); // +2 дня

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

  // Очистка при закрытии страницы
  window.addEventListener("beforeunload", function () {
    clearTimeout(notificationTimer);
    clearTimeout(autoCloseTimer);
    clearTimeout(formTimer);
    clearInterval(countdownTimer);
  });
});
