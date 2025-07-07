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

  // Адаптация изображений для мобильных устройств
  function adjustHeroImage() {
    const heroImage = document.querySelector(".hero-image");
    if (window.innerWidth < 992) {
      heroImage.style.height = "300px";
    } else {
      heroImage.style.height = "400px";
    }
  }

  window.addEventListener("resize", adjustHeroImage);
  adjustHeroImage();
});
