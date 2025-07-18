// Скрипт для аккордеона FAQ
document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll(".thfr-faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".thfr-question");

    question.addEventListener("click", () => {
      // Закрываем все открытые элементы
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active");
          otherItem.querySelector(".thfr-answer").style.maxHeight = "0";
          otherItem.querySelector(".thfr-answer").style.padding = "0";
        }
      });

      // Открываем/закрываем текущий элемент
      item.classList.toggle("active");
      const answer = item.querySelector(".thfr-answer");

      if (item.classList.contains("active")) {
        answer.style.maxHeight = answer.scrollHeight + "px";
        answer.style.padding = "20px";
      } else {
        answer.style.maxHeight = "0";
        answer.style.padding = "0";
      }
    });
  });

  // Скрипт для карусели отзывов
  const reviews = document.querySelectorAll(".thfr-review");
  const dotsContainer = document.querySelector(".thfr-dots");
  const prevBtn = document.querySelector(".thfr-prev");
  const nextBtn = document.querySelector(".thfr-next");
  let currentIndex = 0;

  // Создаем точки навигации
  reviews.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("thfr-dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToReview(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".thfr-dot");

  function showReview(index) {
    reviews.forEach((review, i) => {
      review.classList.toggle("active", i === index);
      review.style.opacity = i === index ? "1" : "0";
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    currentIndex = index;
  }

  function goToReview(index) {
    if (index < 0) index = reviews.length - 1;
    if (index >= reviews.length) index = 0;
    showReview(index);
  }

  function nextReview() {
    goToReview(currentIndex + 1);
  }

  function prevReview() {
    goToReview(currentIndex - 1);
  }

  nextBtn.addEventListener("click", nextReview);
  prevBtn.addEventListener("click", prevReview);

  // Автопрокрутка каждые 5 секунд
  let interval = setInterval(nextReview, 3000);

  // Останавливаем автопрокрутку при наведении
  const carousel = document.querySelector(".thfr-carousel");
  carousel.addEventListener("mouseenter", () => clearInterval(interval));
  carousel.addEventListener("mouseleave", () => {
    interval = setInterval(nextReview, 5000);
  });

  // Показываем первый отзыв при загрузке
  showReview(0);
});
