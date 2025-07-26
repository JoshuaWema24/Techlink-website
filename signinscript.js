const form = document.getElementById("loginForm");
const errorDiv = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!role) {
    errorDiv.textContent = "Please select a role.";
    return;
  }

  try {
    const res = await fetch("https://techlink-backend.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (res.ok) {
      // Save token to localStorage (optional)
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === "customer") {
        window.location.href = "homepage.html";
      } else {
        window.location.href = "technicianshomepage.html";
      }
    } else {
      errorDiv.textContent = data.message || "Login failed. Check credentials.";
    }
  } catch (err) {
    console.error(err);
    errorDiv.textContent = "Something went wrong. Try again later.";
  }
});
function handleImageError() {
  document.getElementById("loader-image").style.display = "none";
  document.getElementById("fallback-spinner").classList.add("show-spinner");
}
// Show loader
document.getElementById("global-loader").style.display = "flex";

// Hide loader
document.getElementById("global-loader").style.display = "none";
