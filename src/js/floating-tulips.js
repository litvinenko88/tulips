document.addEventListener("DOMContentLoaded", function () {
  // Дополнительная анимация для тюльпанов
  const tulips = document.querySelectorAll(".tulip");

  // Функция для случайного перемещения тюльпанов
  function randomizeTulips() {
    tulips.forEach((tulip) => {
      // Случайная позиция по вертикали (10%-90% высоты экрана)
      const top = Math.random() * 80 + 10;
      // Случайная позиция по горизонтали (5%-85% ширины экрана)
      const left = Math.random() * 80 + 5;
      // Случайный размер (70-130px)
      const size = Math.random() * 60 + 70;
      // Случайное вращение (-15 до 15 градусов)
      const rotation = Math.random() * 30 - 15;
      // Случайная прозрачность (0.5-0.9)
      const opacity = Math.random() * 0.4 + 0.5;

      tulip.style.top = `${top}%`;
      tulip.style.left = `${left}%`;
      tulip.style.width = `${size}px`;
      tulip.style.transform = `rotate(${rotation}deg)`;
      tulip.style.opacity = opacity;

      // Случайная длительность анимации (10-25 секунд)
      const duration = Math.random() * 15 + 10;
      tulip.style.animationDuration = `${duration}s`;
    });
  }

  // Инициализация позиций тюльпанов
  randomizeTulips();

  // Обновление позиций каждые 30 секунд
  setInterval(randomizeTulips, 30000);

  // Плавное появление тюльпанов после загрузки страницы
  setTimeout(() => {
    document.querySelectorAll(".tulip").forEach((tulip) => {
      tulip.style.transition = "opacity 1.5s ease";
      tulip.style.opacity = "0.7";
    });
  }, 500);
});
