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

// Function to map service types to Font Awesome icons
function getServiceIcon(serviceType) {
  const lowerCaseService = serviceType.toLowerCase();
  if (
    lowerCaseService.includes("electrical") ||
    lowerCaseService.includes("light")
  ) {
    return "fas fa-bolt";
  } else if (
    lowerCaseService.includes("plumbing") ||
    lowerCaseService.includes("water")
  ) {
    return "fas fa-faucet";
  } else if (
    lowerCaseService.includes("hvac") ||
    lowerCaseService.includes("ac") ||
    lowerCaseService.includes("fan")
  ) {
    return "fas fa-fan";
  } else if (
    lowerCaseService.includes("network") ||
    lowerCaseService.includes("internet") ||
    lowerCaseService.includes("wifi")
  ) {
    return "fas fa-globe";
  } else if (
    lowerCaseService.includes("appliance") ||
    lowerCaseService.includes("fridge") ||
    lowerCaseService.includes("cooker")
  ) {
    return "fas fa-blender"; // Generic appliance icon
  } else if (
    lowerCaseService.includes("carpentry") ||
    lowerCaseService.includes("furniture")
  ) {
    return "fas fa-hammer";
  } else if (
    lowerCaseService.includes("painting") ||
    lowerCaseService.includes("paint")
  ) {
    return "fas fa-paint-roller";
  } else if (lowerCaseService.includes("cleaning")) {
    return "fas fa-broom";
  } else {
    return "fas fa-wrench"; // Default service icon
  }
}

async function fetchAndDisplayRequests(token) {
  const requestsContainer = document.getElementById("requestsContainer");
  requestsContainer.innerHTML =
    "<p style='text-align:center; width:100%;'>Loading requests...</p>"; // Show loading

  try {
    const res = await fetch(
      "https://techlink-backend.onrender.com/api/jobs/technician/:id",
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

    requestsContainer.innerHTML = ""; // Clear loading message

    if (!data || data.length === 0) {
      requestsContainer.innerHTML =
        "<p style='text-align:center; width:100%;'>No service requests found.</p>";
      return;
    }

    data.forEach((req, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
      // Add a delay for each card to create a staggered fade-in effect
      card.style.animationDelay = `${index * 0.1}s`;

      const iconClass = getServiceIcon(req.serviceType);

      // Display only the requested fields
      card.innerHTML = `
                        <div class="card-header">
                            <i class="${iconClass}"></i>
                            <div class="service-type">${req.serviceType}</div>
                        </div>
                        <div class="meta"><strong>Customer:</strong> ${
                          req.customerName || "N/A"
                        }</div>
                        <div class="meta"><strong>Phone:</strong> <a href="tel:${
                          req.customerNumber
                        }" style="color: #6d9bff;">${
        req.customerNumber || "N/A"
      }</a></div>
                        <div class="meta"><strong>Location:</strong> ${
                          req.location || "N/A"
                        }</div>
                        <div class="desc"><strong>Description:</strong> ${
                          req.tldescription || "No description provided."
                        }</div>
                        <div class="desc"><strong>Customer Description:</strong> ${
                          req.customerDescription || "No description provided."
                        }</div>
                        <div class="card-footer">
                            <button onclick="alert('Viewing full details for jobs #${
                              req.id || req._id
                            }')">View Full Details</button>
                        </div>
                    `;
      requestsContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching requests:", err);
    requestsContainer.innerHTML =
      "<p style='text-align:center; width:100%;'>Failed to load requests. Please ensure you are logged in and try again.</p>";
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
  await fetchAndDisplayRequests(token);

  const socket = io("https://techlink-backend.onrender.com"); // Change if hosted on a different domain

  const technicianId = "decodedToken"; // Replace with logged-in technician's ID

  // Register this technician
  socket.emit("register", technicianId);

  // Listen for job notifications
  socket.on("new-job", (job) => {
    console.log("New job assigned:", job);

    // Show popup or update the job list
    alert(`New Job Assigned:\n${job.description}`);
  });
});
