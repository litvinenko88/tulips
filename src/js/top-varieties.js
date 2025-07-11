document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".tulip-slider");
  const cards = Array.from(document.querySelectorAll(".tulip-card"));
  const prevArrow = document.querySelector(".tulip-prev-arrow");
  const nextArrow = document.querySelector(".tulip-next-arrow");

  // Таймер для автоматического переключения
  let autoSlideInterval;
  let isUserInteracting = false;
  let interactionTimeout;
  let touchStartX = 0;
  let touchEndX = 0;
  let isAnimating = false;

  // Инициализация слайдера
  function initSlider() {
    // Устанавливаем начальные позиции
    cards.forEach((card, index) => {
      const pos = index - Math.floor(cards.length / 2);
      card.dataset.pos = pos;
    });

    // Добавляем обработчики событий
    addEventListeners();
    startAutoSlide();
  }

  // Добавление обработчиков событий
  function addEventListeners() {
    // Обработчики для карточек
    cards.forEach((card) => {
      card.addEventListener("click", handleCardClick);
      card.addEventListener("touchstart", handleTouchStart, { passive: true });
      card.addEventListener("touchend", handleTouchEnd, { passive: true });
    });

    // Обработчики для слайдера
    slider.addEventListener("touchstart", handleTouchStart, { passive: true });
    slider.addEventListener("touchend", handleTouchEnd, { passive: true });
    slider.addEventListener("mousedown", handleMouseDown);

    // Обработчики для стрелок
    prevArrow.addEventListener("click", goToPrevCard);
    nextArrow.addEventListener("click", goToNextCard);
  }

  // Обработчик клика по карточке
  function handleCardClick(e) {
    if (isAnimating) return;

    const newActive = e.currentTarget;
    if (parseInt(newActive.dataset.pos) === 0) return;

    updateActiveCard(newActive);
    resetAutoSlide();
  }

  // Обработчик начала касания
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    setUserInteracting(true);
  }

  // Обработчик окончания касания
  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    setUserInteracting(false);
  }

  // Обработчик нажатия кнопки мыши
  function handleMouseDown() {
    setUserInteracting(true);
    document.addEventListener("mouseup", handleMouseUp);
  }

  // Обработчик отпускания кнопки мыши
  function handleMouseUp() {
    setUserInteracting(false);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  // Обработка свайпа
  function handleSwipe() {
    if (isAnimating) return;

    const threshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNextCard();
      } else {
        goToPrevCard();
      }
    }
  }

  // Переход к предыдущей карточке
  function goToPrevCard() {
    if (isAnimating) return;

    const activeCard = document.querySelector('.tulip-card[data-pos="0"]');
    const activeIndex = cards.indexOf(activeCard);
    const prevIndex = (activeIndex - 1 + cards.length) % cards.length;
    updateActiveCard(cards[prevIndex]);
    resetAutoSlide();
  }

  // Переход к следующей карточке
  function goToNextCard() {
    if (isAnimating) return;

    const activeCard = document.querySelector('.tulip-card[data-pos="0"]');
    const activeIndex = cards.indexOf(activeCard);
    const nextIndex = (activeIndex + 1) % cards.length;
    updateActiveCard(cards[nextIndex]);
    resetAutoSlide();
  }

  // Обновление активной карточки
  function updateActiveCard(newActive) {
    if (isAnimating) return;
    isAnimating = true;

    const newActivePos = parseInt(newActive.dataset.pos);

    cards.forEach((card) => {
      const currentPos = parseInt(card.dataset.pos);
      card.dataset.pos = getNewPosition(currentPos, newActivePos);
    });

    // Завершаем анимацию после небольшой задержки
    setTimeout(() => {
      isAnimating = false;
    }, 300);
  }

  // Вычисление новой позиции (исправленная версия)
  function getNewPosition(currentPos, activePos) {
    const diff = currentPos - activePos;
    const numCards = cards.length;
    const half = Math.floor(numCards / 2);

    // Если разница больше половины количества карточек, корректируем позицию
    if (Math.abs(diff) > half) {
      return diff > 0 ? diff - numCards : diff + numCards;
    }

    return diff;
  }

  // Установка состояния взаимодействия пользователя
  function setUserInteracting(interacting) {
    isUserInteracting = interacting;

    if (interactionTimeout) {
      clearTimeout(interactionTimeout);
    }

    if (!interacting) {
      interactionTimeout = setTimeout(() => {
        resetAutoSlide();
      }, 2000);
    } else {
      clearInterval(autoSlideInterval);
    }
  }

  // Автоматическое переключение на следующий слайд
  function autoSlideNext() {
    if (!isUserInteracting && !isAnimating) {
      goToNextCard();
    }
  }

  // Запуск автоматического переключения
  function startAutoSlide() {
    if (!isUserInteracting) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(autoSlideNext, 4000);
    }
  }

  // Сброс автоматического переключения
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Инициализация слайдера
  initSlider();
});
