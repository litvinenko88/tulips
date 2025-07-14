document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".tho-process-step");

  steps.forEach((step) => {
    step.addEventListener("click", function () {
      this.classList.toggle("tho-step-active");

      if (window.innerWidth < 768) {
        this.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  });

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
  animateOnScroll();
});
