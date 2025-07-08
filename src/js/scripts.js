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
