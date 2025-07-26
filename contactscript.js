const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("closeBtn");

hamburger.onclick = () => sidebar.classList.add("active");
closeBtn.onclick = () => sidebar.classList.remove("active");
document.querySelectorAll("#sidebar a").forEach((link) => {
  link.addEventListener("click", () => sidebar.classList.remove("active"));
});
