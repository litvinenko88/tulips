// Основные скрипты
document.addEventListener("DOMContentLoaded", function () {
  // Бегущая строка
  const scrollingContent = document.querySelector(".th-scrolling-content");
  if (scrollingContent) {
    scrollingContent.textContent = scrollingContent.textContent.repeat(3);
  }
});
// Плавная прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // Получаем позицию элемента с учетом фиксированного меню
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px - отступ сверху

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Обновляем URL без перезагрузки страницы
      if (history.pushState) {
        history.pushState(null, null, targetId);
      } else {
        window.location.hash = targetId;
      }
    }
  });
});
