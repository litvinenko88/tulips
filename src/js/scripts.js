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

document.addEventListener("DOMContentLoaded", function () {
  // Показ уведомления через 12 секунд
  setTimeout(function () {
    const notification = document.querySelector(".tulip-chat-notification");
    notification.style.display = "block";

    // Автозакрытие через 5 секунд
    const autoCloseTimer = setTimeout(function () {
      notification.style.display = "none";
      showOfferForm();
    }, 8000);

    // Закрытие по клику на крестик
    document
      .querySelector(".tulip-close-notification")
      .addEventListener("click", function () {
        clearTimeout(autoCloseTimer);
        notification.style.display = "none";
        showOfferForm();
      });
  }, 12000);

  // Функция показа формы предложения
  function showOfferForm() {
    setTimeout(function () {
      const form = document.querySelector(".tulip-special-offer-form");
      form.style.display = "block";

      // Закрытие формы по клику на крестик
      document
        .querySelector(".tulip-close-form")
        .addEventListener("click", function () {
          form.style.display = "none";
        });

      // Таймер обратного отсчета (2 дня)
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 2);

      function updateTimer() {
        const now = new Date();
        const diff = endDate - now;

        if (diff <= 0) {
          clearInterval(timerInterval);
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
      const timerInterval = setInterval(updateTimer, 1000);
    }, 5000);
  }

  // Открытие формы по клику на кнопку чата
  document
    .querySelector(".tulip-chat-btn")
    .addEventListener("click", function () {
      const notification = document.querySelector(".tulip-chat-notification");
      const form = document.querySelector(".tulip-special-offer-form");

      if (notification.style.display === "block") {
        notification.style.display = "none";
      }

      form.style.display = form.style.display === "block" ? "none" : "block";
    });
});
