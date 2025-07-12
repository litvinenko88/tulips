document.addEventListener("DOMContentLoaded", function () {
  const mobileMenu = document.getElementById("thMobileMenu");
  const navItems = document.getElementById("thNavItems");
  const navOverlay = document.createElement("div");
  navOverlay.className = "th-nav-overlay";
  document.body.appendChild(navOverlay);

  // Устанавливаем индекс для анимации пунктов меню
  document.querySelectorAll(".th-nav-items li").forEach((item, index) => {
    item.style.setProperty("--i", index);
  });

  // Переключение мобильного меню
  mobileMenu.addEventListener("click", function () {
    this.classList.toggle("th-open");
    navItems.classList.toggle("th-active");
    navOverlay.classList.toggle("th-active");
    document.body.style.overflow = navItems.classList.contains("th-active")
      ? "hidden"
      : "";
  });

  // Закрытие меню при клике на оверлей
  navOverlay.addEventListener("click", function () {
    mobileMenu.classList.remove("th-open");
    navItems.classList.remove("th-active");
    this.classList.remove("th-active");
    document.body.style.overflow = "";
  });

  // Закрытие меню при клике на ссылку
  document.querySelectorAll(".th-nav-items a").forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("th-open");
      navItems.classList.remove("th-active");
      navOverlay.classList.remove("th-active");
      document.body.style.overflow = "";
    });
  });
});
