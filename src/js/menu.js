// Меню навигации
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenu = document.getElementById("mobileMenu");
  const navItems = document.getElementById("navItems");

  // Переключение мобильного меню
  mobileMenu.addEventListener("click", function () {
    this.classList.toggle("open");
    navItems.classList.toggle("active");
    document.body.style.overflow = navItems.classList.contains("active")
      ? "hidden"
      : "";
  });

  // Закрытие меню при клике на ссылку
  document.querySelectorAll(".nav-items a").forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
      navItems.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
});
