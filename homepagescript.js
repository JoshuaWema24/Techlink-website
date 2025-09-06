const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const hamburgerMenu = document.getElementById("hamburgerMenu");
const availabilitySwitch = document.getElementById("availabilitySwitch");
const availabilityLabel = document.querySelector(".availability-label");
const techAvailabilityToggle = document.getElementById(
  "techAvailabilityToggle"
); // New
const toggleRoleButton = document.getElementById("toggleRoleButton"); // New

const customerNav = document.getElementById("customerNav");
const technicianNav = document.getElementById("technicianNav");
const customerDashboard = document.getElementById("customerDashboard");
const technicianDashboard = document.getElementById("technicianDashboard");
const welcomeMessageCustomer = document.getElementById(
  "welcomeMessageCustomer"
);
const welcomeMessageTechnician = document.getElementById(
  "welcomeMessageTechnician"
);
const techOnlineStatus = document.getElementById("techOnlineStatus");

let isTechnician = false; // Initial role

// Function to toggle sidebar visibility on mobile
hamburgerMenu.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("active");
});

// Function to handle availability switch for technicians
availabilitySwitch.addEventListener("change", function () {
  if (this.checked) {
    availabilityLabel.textContent = "Online";
    availabilityLabel.style.color = "var(--success-green)";
    if (isTechnician) {
      techOnlineStatus.textContent = "ONLINE";
      techOnlineStatus.style.color = "var(--success-green)";
    }
  } else {
    availabilityLabel.textContent = "Offline";
    availabilityLabel.style.color = "var(--text-muted)";
    if (isTechnician) {
      techOnlineStatus.textContent = "OFFLINE";
      techOnlineStatus.style.color = "var(--text-muted)";
    }
  }
});

// Function to toggle user role (Customer/Technician)
function toggleUserRole() {
  isTechnician = !isTechnician; // Toggle the role

  // Update sidebar navigation visibility
  customerNav.style.display = isTechnician ? "none" : "block";
  technicianNav.style.display = isTechnician ? "block" : "none";

  // Update dashboard content visibility
  customerDashboard.style.display = isTechnician ? "none" : "block";
  technicianDashboard.style.display = isTechnician ? "block" : "none";

  // Update top bar availability toggle visibility
  techAvailabilityToggle.style.display = isTechnician ? "flex" : "none";

  // Update welcome message and role toggle button text
  if (isTechnician) {
    welcomeMessageCustomer.style.display = "none";
    welcomeMessageTechnician.style.display = "block";
    toggleRoleButton.textContent = "Switch to Customer Role";
    // Reset availability switch to offline when switching to technician role
    availabilitySwitch.checked = false;
    availabilityLabel.textContent = "Offline";
    availabilityLabel.style.color = "var(--text-muted)";
    techOnlineStatus.textContent = "OFFLINE";
    techOnlineStatus.style.color = "var(--text-muted)";
  } else {
    welcomeMessageCustomer.style.display = "block";
    welcomeMessageTechnician.style.display = "none";
    toggleRoleButton.textContent = "Switch to Technician Role";
  }
}

// Add event listener to the role toggle button
toggleRoleButton.addEventListener("click", toggleUserRole);

// Initial setup for the dashboard based on the default role (customer)
document.addEventListener("DOMContentLoaded", () => {
  // Ensure technician elements are hidden initially if default is customer
  technicianNav.style.display = "none";
  technicianDashboard.style.display = "none";
  techAvailabilityToggle.style.display = "none"; // Hide availability toggle initially for customer
  welcomeMessageTechnician.style.display = "none";
});

// Example service data (fallback if API fetch fails)
const exampleServices = [
  {
    _id: "6543210001",
    serviceName: "Mobile Phone Repair",
    serviceInfo:
      "Experiencing issues with your smartphone, from cracked screens to battery problems? With Termyte, simply submit a detailed repair request through the app, specifying your device model and the issue.",
    isAvailable: true,
  },
  {
    _id: "6543210002",
    serviceName: "Laptop Repair",
    serviceInfo:
      "Is your laptop running slow, not turning on, or facing software glitches? Termyte connects you with expert technicians for all laptop repair needs.",
    isAvailable: true,
  },
  {
    _id: "6543210003",
    serviceName: "TV Repair",
    serviceInfo:
      "Having trouble with your television's display, sound, or connectivity? Termyte's TV repair specialists are here to help.",
    isAvailable: true,
  },
  // ... keep your other services here
];

// DOM elements
const serviceGrid = document.getElementById("serviceGrid");
const serviceCountBadge = document.getElementById("serviceCountBadge");

// Get correct icon based on service name
function getServiceIcon(serviceName) {
  const lowerCaseName = serviceName.toLowerCase();
  if (
    lowerCaseName.includes("phone repair") ||
    lowerCaseName.includes("mobile")
  ) {
    return "fas fa-mobile-alt";
  }
  if (lowerCaseName.includes("laptop repair")) {
    return "fas fa-laptop";
  }
  if (lowerCaseName.includes("tv repair")) {
    return "fas fa-tv";
  }
  if (lowerCaseName.includes("networking")) {
    return "fas fa-network-wired";
  }
  if (lowerCaseName.includes("home appliance")) {
    return "fas fa-blender";
  }
  if (
    lowerCaseName.includes("web design") ||
    lowerCaseName.includes("website")
  ) {
    return "fas fa-globe";
  }
  if (
    lowerCaseName.includes("mobile app design") ||
    lowerCaseName.includes("app development")
  ) {
    return "fas fa-mobile-alt";
  }
  if (lowerCaseName.includes("electrical work")) {
    return "fas fa-bolt";
  }
  if (lowerCaseName.includes("graphic design")) {
    return "fas fa-paint-brush";
  }
  if (
    lowerCaseName.includes("cctv installation") ||
    lowerCaseName.includes("security")
  ) {
    return "fas fa-video";
  }
  return "fas fa-tools"; // Default icon
}

// Fetch services from backend or fallback
async function fetchServices() {
  try {
    const response = await fetch(
      "https://techlink-backend.onrender.com/api/getServices"
    );
    if (!response.ok) {
      console.warn(
        `Backend fetch failed with status: ${response.status}. Falling back to example data.`
      );
      renderServices(exampleServices);
      return;
    }
    const servicesData = await response.json();
    renderServices(servicesData);
  } catch (error) {
    console.error("Error fetching services from backend:", error);
    renderServices(exampleServices);
  }
}

// Render all services
function renderServices(servicesData) {
  serviceGrid.innerHTML = ""; // Clear existing
  if (servicesData && servicesData.length > 0) {
    servicesData.forEach((service, index) => {
      const serviceCard = document.createElement("div");
      serviceCard.classList.add("service-card");
      serviceCard.style.animationDelay = `${index * 0.1}s`;

      const serviceIconClass = getServiceIcon(service.serviceName);
      const availabilityClass = service.isAvailable ? "active" : "inactive";
      const availabilityText = service.isAvailable
        ? "Available"
        : "Unavailable";
      const availabilityIcon = service.isAvailable
        ? "fas fa-check-circle"
        : "fas fa-times-circle";

      serviceCard.innerHTML = `
        <div class="service-header">
          <div class="service-icon"><i class="${serviceIconClass}"></i></div>
          <div class="service-name">${service.serviceName}</div>
        </div>
        <div class="service-info">${service.serviceInfo}</div>
        <div class="card-actions">
          <button class="action-btn toggle-capability ${availabilityClass}"
                  data-id="${service._id}"
                  data-available="${service.isAvailable}">
            <i class="${availabilityIcon}"></i> ${availabilityText}
          </button>
          <button class="action-btn delete-btn" data-id="${service._id}">
            <i class="fas fa-trash-alt"></i> Delete
          </button>
        </div>
      `;

      // Add event listeners
      serviceCard
        .querySelector(".toggle-capability")
        .addEventListener("click", (e) => {
          const id = e.target.closest("button").dataset.id;
          const currentAvailable =
            e.target.closest("button").dataset.available === "true";
          toggleTechnicianCapability(id, currentAvailable);
        });

      serviceCard
        .querySelector(".delete-btn")
        .addEventListener("click", (e) => {
          const id = e.target.closest("button").dataset.id;
          deleteService(id);
        });

      serviceGrid.appendChild(serviceCard);
    });
  } else {
    serviceGrid.innerHTML = "<p>No services found.</p>";
  }
  serviceCountBadge.textContent = servicesData.length;
}

// Toggle availability (API + UI update)
async function toggleTechnicianCapability(serviceId, isAvailable) {
  const newStatus = !isAvailable;
  try {
    const response = await fetch(
      `https://techlink-backend.onrender.com/api/updateService/${serviceId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: newStatus }),
      }
    );

    if (!response.ok) throw new Error(`Failed with status ${response.status}`);
    console.log(`Service ${serviceId} availability updated to ${newStatus}`);

    // Refresh services after update
    fetchServices();
  } catch (error) {
    console.error("Error updating service availability:", error);
  }
}

// Delete service (API + UI update)
async function deleteService(serviceId) {
  if (!confirm("Are you sure you want to delete this service?")) return;
  try {
    const response = await fetch(
      `https://techlink-backend.onrender.com/api/deleteService/${serviceId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) throw new Error(`Failed with status ${response.status}`);
    console.log(`Service ${serviceId} deleted successfully`);

    // Refresh services after delete
    fetchServices();
  } catch (error) {
    console.error("Error deleting service:", error);
  }
}

// Load services on page load
fetchServices();
