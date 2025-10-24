// ====== JWT Decoder ======
function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding JWT:", e);
    return null;
  }
}

// ====== Fetch and Display Requests ======
async function fetchRequests(token) {
  try {
    const res = await fetch(
      "https://techlink-backend.onrender.com/api/my-requests",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch service requests");

    const data = await res.json();
    const container = document.getElementById("requestsContainer");
    container.innerHTML = "";

    if (!data || data.length === 0) {
      container.innerHTML =
        "<p class='text-center text-gray-500'>No requests found.</p>";
      return;
    }

    data.forEach((req) => {
      const card = document.createElement("div");
      card.className =
        "bg-white shadow-lg rounded-2xl p-4 mb-6 transition hover:shadow-xl";

      const customerName = req.customerId?.name || "Unknown";
      const customerPhone = req.customerId?.phonenumber || "Not provided";

      const summary = req.summary
        ? `
          <div class="mt-3 border-t pt-3 text-sm">
            <div>👷 <b>Technician:</b> ${req.summary.technicianName}</div>
            <div>🧰 <b>Service Done:</b> ${req.summary.serviceDone}</div>
            <div>💰 <b>Amount:</b> KES ${req.summary.amount}</div>
            <div>📊 <b>Status:</b> ${req.summary.status}</div>
          </div>
        `
        : `<p class="text-gray-500 mt-2 text-sm italic">No summary added yet.</p>`;

      card.innerHTML = `
        <div class="flex items-center mb-2">
          <i class="fas fa-wrench text-blue-600 mr-2"></i>
          <h2 class="font-semibold text-lg">${req.serviceType}</h2>
        </div>
        <div class="text-sm text-gray-600 space-y-1">
          <div>📍 <b>Location:</b> ${req.location}</div>
          <div>⏰ <b>Time:</b> ${req.time || "Not specified"}</div>
          <div>⚡ <b>Urgency:</b> ${req.urgency}</div>
          <div>🧾 <b>Description:</b> ${req.description}</div>
          <div>👤 <b>Customer:</b> ${customerName}</div>
          <div>📞 <b>Phone:</b> ${customerPhone}</div>
        </div>
        ${summary}
        <button class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm summary-btn">
          📝 Add Summary
        </button>
      `;

      const btn = card.querySelector(".summary-btn");
      btn.addEventListener("click", () => openSummaryForm(req._id));

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching requests:", err);
    document.getElementById("requestsContainer").innerHTML =
      "<p class='text-center text-red-500'>Failed to load requests.</p>";
  }
}

// ====== Summary Form Logic ======
let currentRequestId = null;

function openSummaryForm(requestId) {
  currentRequestId = requestId;
  document.getElementById("summaryFormModal").classList.add("active");
}

document.getElementById("closeModalBtn").addEventListener("click", () => {
  document.getElementById("summaryFormModal").classList.remove("active");
});


document.getElementById("summaryForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `https://techlink-backend.onrender.com/api/request-summary/${currentRequestId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) throw new Error("Failed to submit summary");

    alert("✅ Summary saved successfully!");
    document.getElementById("summaryFormModal").classList.add("hidden");
    e.target.reset();
    await fetchRequests(token); // refresh list
  } catch (err) {
    console.error("Error saving summary:", err);
    alert("❌ Failed to save summary");
  }
});

// ====== Auth + Initialization ======
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
    alert("Authentication failed. Please log in again.");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    return (window.location.href = "signin.html");
  }

  await fetchRequests(token);
});
