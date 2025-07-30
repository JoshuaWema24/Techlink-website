
  const form = document.querySelector("form");
  const button = form.querySelector("button");

  form.addEventListener("submit", (e) => {
    button.classList.add("loading");
  });

