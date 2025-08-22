// ❌ remove this line - not for frontend
// const { send } = require("process");

// Sidebar toggle
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("closeBtn");

hamburger.onclick = () => sidebar.classList.add("active");
closeBtn.onclick = () => sidebar.classList.remove("active");
document.querySelectorAll("#sidebar a").forEach((link) => {
  link.addEventListener("click", () => sidebar.classList.remove("active"));
});

// Feedback form
const sendMessageBtn = document.getElementById("sendMessage");
const feedbackForm = document.getElementById("feedbackForm");

feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await sendFeedback();
});

async function sendFeedback() {
  const payload = {
    email: document.getElementById("email").value.trim(),
    name: document.getElementById("name").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    userMessage: document.getElementById("user_message").value.trim(),
  };

  try {
    sendMessageBtn.disabled = true;
    sendMessageBtn.textContent = "Sending...";

    const baseUrl = "https://techlink-backend.onrender.com";
    const endpoint = `${baseUrl}/api/feedback`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Check if response is JSON
    const contentType = res.headers.get("content-type");
    let result;

    if (contentType && contentType.includes("application/json")) {
      result = await res.json();
    } else {
      const text = await res.text();
      console.error("Non-JSON response from server:", text);
      throw new Error("Server returned non-JSON response");
    }

    if (res.ok) {
      alert("✅ Feedback sent successfully!");
      feedbackForm.reset();
    } else {
      alert(result.message || "❌ Failed to send feedback");
    }
  } catch (error) {
    console.error("Feedback error:", error);
    alert("⚠️ Server error. Please try again later.");
  } finally {
    sendMessageBtn.disabled = false;
    sendMessageBtn.textContent = "Send Message";
  }
};