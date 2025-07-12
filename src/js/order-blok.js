document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".th-step");

  steps.forEach((step) => {
    step.addEventListener("click", function () {
      // Добавляем/убираем класс активного состояния
      this.classList.toggle("th-active");

      // Плавная прокрутка к секции при клике (для мобильных)
      if (window.innerWidth < 768) {
        this.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  });

  // Анимация при скролле
  function animateOnScroll() {
    steps.forEach((step) => {
      const stepPosition = step.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (stepPosition < screenPosition) {
        step.style.animationPlayState = "running";
      }
    });
  }

  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll(); // Инициализация при загрузке
});
