document.addEventListener("DOMContentLoaded", function () {
  // Элементы квиза
  const quizSplash = document.querySelector(".quiz-splash");
  const quizWrapper = document.querySelector(".quiz-wrapper");
  const startQuizBtn = document.querySelector(".btn-start-quiz");
  const quizQuestions = document.querySelector(".quiz-questions");
  const questions = document.querySelectorAll(".quiz-question");
  const answerButtons = document.querySelectorAll(".quiz-answer");
  const progressBar = document.querySelector(".progress-bar");
  const progressText = document.querySelector(".progress-text");
  const quizForm = document.getElementById("quiz-form");
  const quizThankYou = document.querySelector(".quiz-thankyou");
  const takeGiftBtn = document.querySelector(".btn-take-gift");

  // Переменные состояния
  let currentQuestion = 0;
  let answers = [];
  const totalQuestions = questions.length - 1; // -1 потому что последний "вопрос" - это форма

  // Начало квиза
  startQuizBtn.addEventListener("click", function () {
    quizSplash.classList.remove("active");
    setTimeout(() => {
      quizWrapper.classList.add("active");
      showQuestion(currentQuestion);
      updateProgress();
    }, 500);
  });

  // Показ вопроса
  function showQuestion(index) {
    questions.forEach((question, i) => {
      question.classList.toggle("active", i === index);
    });
  }

  // Обработка ответов
  answerButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const questionIndex = parseInt(
        this.closest(".quiz-question").dataset.question
      );
      const answerValue = this.dataset.value;

      // Сохраняем ответ
      answers[questionIndex - 1] = {
        question:
          this.closest(".quiz-question").querySelector("h3").textContent,
        answer: answerValue,
      };

      // Плавный переход к следующему вопросу
      setTimeout(() => {
        currentQuestion++;
        if (currentQuestion <= totalQuestions) {
          showQuestion(currentQuestion);
          updateProgress();
        }
      }, 300);
    });
  });

  // Обновление прогресс бара
  function updateProgress() {
    const progress = Math.round((currentQuestion / totalQuestions) * 100);
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;
  }

  // Валидация формы
  quizForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("quiz-name");
    const phoneInput = document.getElementById("quiz-phone");
    let isValid = true;

    // Валидация имени
    if (nameInput.value.trim() === "") {
      showError(nameInput, "Пожалуйста, введите ваше имя");
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Валидация телефона
    const phoneRegex =
      /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    if (!phoneRegex.test(phoneInput.value.trim())) {
      showError(phoneInput, "Пожалуйста, введите корректный номер телефона");
      isValid = false;
    } else {
      clearError(phoneInput);
    }

    if (isValid) {
      // Сохраняем данные формы
      answers.push({
        question: "Имя",
        answer: nameInput.value.trim(),
      });

      answers.push({
        question: "Телефон",
        answer: phoneInput.value.trim(),
      });

      // Отправляем данные в Telegram
      sendToTelegram(answers);

      // Показываем страницу благодарности
      quizWrapper.classList.remove("active");
      setTimeout(() => {
        quizThankYou.classList.add("active");

        // Возвращаем квиз в исходное состояние через 10 секунд
        setTimeout(resetQuiz, 10000);
      }, 500);
    }
  });

  // Функция показа ошибки
  function showError(input, message) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector(".error-message");
    input.style.borderColor = "var(--color-accent)";
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }

  // Функция очистки ошибки
  function clearError(input) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector(".error-message");
    input.style.borderColor = "";
    errorMessage.style.display = "none";
  }

  // Отправка данных в Telegram
  function sendToTelegram(data) {
    const botToken = "7757545287:AAHNWgBvNyxNfvhfz_ktJ1NCIJJqB5FxV0Y";
    const chatId = "682859146";

    let message = "Новая заявка 🔥🔥🔥\n\n";
    data.forEach((item) => {
      message += `<b>${item.question}:</b> ${item.answer}\n`;
    });
    message += "\n<b>Отправлено из:</b> квиза на сайте";

    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
      message
    )}&parse_mode=HTML`;

    fetch(url)
      .then((response) => response.json())
      .catch((error) => console.error("Ошибка отправки в данных:", error));
  }

  // Кнопка "Забрать подарок"
  takeGiftBtn.addEventListener("click", function () {
    window.open("https://вашсайт.ру/pdf-guide", "_blank");
    resetQuiz();
  });

  // Сброс квиза
  function resetQuiz() {
    quizThankYou.classList.remove("active");
    quizWrapper.classList.remove("active");
    quizSplash.classList.add("active");

    // Сброс состояния
    currentQuestion = 0;
    answers = [];
    progressBar.style.width = "0%";
    progressText.textContent = "0%";

    // Сброс формы
    quizForm.reset();
    document.querySelectorAll(".error-message").forEach((el) => {
      el.style.display = "none";
    });

    // Сброс активных вопросов
    questions.forEach((question, index) => {
      question.classList.toggle("active", index === 0);
    });
  }

  // Анимация при наведении на ответы
  answerButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px)";
      this.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "";
      this.style.boxShadow = "";
    });
  });
});
