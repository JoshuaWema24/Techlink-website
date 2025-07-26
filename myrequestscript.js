function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding JWT:", e);
    return null;
  }
}

async function fetchRequests(token) {
  try {
    const res = await fetch(
      "https://techlink-backend.onrender.com/api/my-requests",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch service requests");
    }

    const data = await res.json();
    const container = document.getElementById("requestsContainer");

    if (!data || data.length === 0) {
      container.innerHTML =
        "<p style='text-align:center;'>No requests found.</p>";
      return;
    }

    data.forEach((req) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const customerName = req.customerId?.name || "Unknown";
      const customerPhone = req.customerId?.phonenumber || "Not provided";

      card.innerHTML = `
    <div class="card-header">
      <i class="fas fa-wrench"></i>
      <div class="service-type">${req.serviceType}</div>
    </div>
    <div class="meta">📍 ${req.location}</div>
    <div class="meta">⏰ ${req.time || "Not specified"}</div>
    <div class="meta">⚡ Urgency: ${req.urgency}</div>
    <div class="desc">${req.description}</div>
    <div class="meta">👤 Customer: ${customerName}</div>
    <div class="meta">📞 Phone: ${customerPhone}</div>
  `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching requests:", err);
    document.getElementById("requestsContainer").innerHTML =
      "<p style='text-align:center;'>Failed to load requests.</p>";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found, redirecting to login.");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    return (window.location.href = "signin.html");
  }

  const decodedToken = decodeJwt(token);

  if (!decodedToken || !decodedToken.id) {
    console.error("Invalid token or missing user ID in token payload.");
    alert("Authentication failed. Please log in again.");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    return (window.location.href = "signin.html");
  }

  // Token is valid, fetch user requests
  await fetchRequests(token);
});
