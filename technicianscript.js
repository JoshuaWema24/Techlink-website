document.addEventListener("DOMContentLoaded", () => {
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const sidebar = document.getElementById("sidebar");

  if (hamburgerMenu && sidebar) {
    hamburgerMenu.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    // Optional: Close sidebar when a nav link is clicked (for better mobile UX)
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // Check if the sidebar is open and on a small screen
        if (window.innerWidth <= 1024 && sidebar.classList.contains("open")) {
          sidebar.classList.remove("open");
        }
      });
    });

    // Optional: Close sidebar if clicking outside of it on mobile
    document.addEventListener("click", (event) => {
      if (
        window.innerWidth <= 1024 &&
        !sidebar.contains(event.target) &&
        !hamburgerMenu.contains(event.target) &&
        sidebar.classList.contains("open")
      ) {
        sidebar.classList.remove("open");
      }
    });
  }
});
