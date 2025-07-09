// Основные скрипты
document.addEventListener("DOMContentLoaded", function () {
  // Бегущая строка
  const scrollingContent = document.querySelector(".scrolling-content");
  if (scrollingContent) {
    scrollingContent.textContent = scrollingContent.textContent.repeat(3);
  }
});
