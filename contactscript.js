const { send } = require("process");

const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("closeBtn");

hamburger.onclick = () => sidebar.classList.add("active");
closeBtn.onclick = () => sidebar.classList.remove("active");
document.querySelectorAll("#sidebar a").forEach((link) => {
  link.addEventListener("click", () => sidebar.classList.remove("active"));
});
const sendMessageBtn = document.getElementById("sendMessage");

sendMessageBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await sendFeedback();
});

async function sendFeedback() {
  // Collect form values INSIDE the function so they’re fresh on each click
  const payload = {
    email: document.getElementById('email').value,
    name: document.getElementById('name').value,
    subject: document.getElementById('subject').value,
    userMessage: document.getElementById('user_message').value,
  };

  try {
    const baseUrl = "https://techlink-backend.onrender.com";
    const endpoint = `${baseUrl}/api/feedback`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok) {
      alert("Feedback sent successfully ✅");

      // Clear form after success
      document.getElementById('email').value = "";
      document.getElementById('name').value = "";
      document.getElementById('subject').value = "";
      document.getElementById('user_message').value = "";
    } else {
      alert(result.message || "❌ Failed to send feedback");
    }
  } catch (error) {
    console.error("Feedback error:", error);
    alert("⚠️ Server error. Please try again later.");
  }
}
