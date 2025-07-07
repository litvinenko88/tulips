document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  // Обработчик для гамбургер-меню
  hamburger.addEventListener("click", function () {
    this.classList.toggle("open");
    navLinks.classList.toggle("active");

    if (navLinks.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // Закрытие меню при клике на ссылку
  const navItems = document.querySelectorAll(".nav-links a");
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      hamburger.classList.remove("open");
      navLinks.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Обработчик для кнопки "Получить прайс"
  const priceButtons = document.querySelectorAll(".btn-price, .btn-primary");

  priceButtons.forEach((button) => {
    button.addEventListener("click", function () {
      alert("Введите ваш email и телефон, и мы отправим вам прайс-лист");
    });
  });

  // Анимация тюльпанов - случайное движение
  const tulips = document.querySelectorAll(".tulip");
  const heroSection = document.querySelector(".hero");

  function moveTulips() {
    tulips.forEach((tulip) => {
      const randomX = Math.random() * 80;
      const randomY = Math.random() * 80;
      const randomRotate = Math.random() * 360;

      tulip.style.left = `${randomX}%`;
      tulip.style.top = `${randomY}%`;
      tulip.style.transform = `rotate(${randomRotate}deg)`;
    });

    setTimeout(moveTulips, 15000); // Изменяем позицию каждые 15 секунд
  }

  moveTulips();
});

  // Инициализация бегущей строки
  const marqueeContent = document.querySelector('.marquee-content');
  const marqueeText = marqueeContent.textContent;
  // Удваиваем текст для плавного перехода
  marqueeContent.textContent = marqueeText.repeat(3);