document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You are not logged in.");
    window.location.href = "signin.html";
    return;
  }
  window.authToken = token;
});

function getUserIdFromToken(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    return JSON.parse(decodedPayload).id;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

// Toggle visual state only (for UI feedback)
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", function (e) {
    const tag = e.target.tagName.toLowerCase();
    if (["input", "select", "textarea", "label"].includes(tag)) return;
    card.classList.toggle("active");
  });
});

// Submit form via JS fetch
document.getElementById("requestForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = window.authToken;

  const formData = {
    serviceType: document.getElementById("serviceType").value,
    location: document.getElementById("location").value,
    urgency: document.getElementById("urgency").value,
    time: document.getElementById("time").value,
    description: document.getElementById("description").value,
  };

  try {
    const res = await fetch(
      "https://techlink-backend.onrender.com/api/request-service",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );
    console.log(formData);
    const data = await res.json();

    if (!res.ok) {
      alert("Failed to submit request: " + (data.message || "Unknown error"));
    } else {
      alert("Request submitted successfully!");
      document.getElementById("requestForm").reset();
    }
  } catch (err) {
    console.error(err);
    alert("Network error. Please try again.");
  }
});
