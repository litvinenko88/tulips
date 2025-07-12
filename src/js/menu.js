// Меню навигации
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenu = document.getElementById("thMobileMenu");
  const navItems = document.getElementById("thNavItems");

  // Переключение мобильного меню
  mobileMenu.addEventListener("click", function () {
    this.classList.toggle("th-open");
    navItems.classList.toggle("th-active");
    document.body.style.overflow = navItems.classList.contains("th-active")
      ? "hidden"
      : "";
  });

  // Закрытие меню при клике на ссылку
  document.querySelectorAll(".th-nav-items a").forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("th-open");
      navItems.classList.remove("th-active");
      document.body.style.overflow = "";
    });
  });
});
