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

const serviceGrid = document.getElementById("serviceGrid");
const serviceCountBadge = document.getElementById("serviceCountBadge");

// Example services (your original full list)
const exampleServices = [
  {
    _id: "6543210001",
    serviceName: "Mobile Phone Repair",
    serviceInfo:
      "Experiencing issues with your smartphone, from cracked screens to battery problems? With Termyte, simply submit a detailed repair request through the app...",
    isAvailable: true,
  },
  {
    _id: "6543210002",
    serviceName: "Laptop Repair",
    serviceInfo:
      "Is your laptop running slow, not turning on, or facing software glitches? Termyte connects you with expert technicians...",
    isAvailable: true,
  },
  {
    _id: "6543210003",
    serviceName: "TV Repair",
    serviceInfo:
      "Having trouble with your television's display, sound, or connectivity? Termyte's TV repair specialists are here to help...",
    isAvailable: true,
  },
  {
    _id: "6543210004",
    serviceName: "Networking",
    serviceInfo:
      "Need help setting up a new home network, troubleshooting Wi-Fi issues, or optimizing your office connectivity? Termyte connects you with networking experts...",
    isAvailable: true,
  },
  {
    _id: "6543210005",
    serviceName: "Home Appliance Repair",
    serviceInfo:
      "Is your refrigerator, washing machine, oven, or other home appliance malfunctioning? Termyte provides access to skilled technicians...",
    isAvailable: true,
  },
  {
    _id: "6543210006",
    serviceName: "Web Design and Maintenance",
    serviceInfo:
      "Looking to build a new website, redesign an existing one, or need ongoing maintenance? Termyte connects you with professional web designers and developers...",
    isAvailable: true,
  },
  {
    _id: "6543210007",
    serviceName: "Mobile App Design and Development",
    serviceInfo:
      "Have an innovative app idea you want to bring to life, or need to enhance an existing mobile application? Termyte links you with experienced developers...",
    isAvailable: false,
  },
  {
    _id: "6543210008",
    serviceName: "Electrical Work and Repairs",
    serviceInfo:
      "For any electrical installations, repairs, or safety checks in your home or business, Termyte connects you with certified electricians...",
    isAvailable: true,
  },
  {
    _id: "6543210009",
    serviceName: "Graphic Design",
    serviceInfo:
      "Need professional graphic design for your brand, marketing materials, or personal projects? Termyte connects you with talented designers...",
    isAvailable: true,
  },
  {
    _id: "6543210010",
    serviceName: "CCTV Installation",
    serviceInfo:
      "Enhance your security with our professional CCTV installation services. We design and install surveillance systems tailored to your property...",
    isAvailable: true,
  },
];

function getServiceIcon(serviceName) {
  const lowerCaseName = serviceName.toLowerCase();
  if (
    lowerCaseName.includes("phone repair") ||
    lowerCaseName.includes("mobile")
  )
    return "fas fa-mobile-alt";
  if (lowerCaseName.includes("laptop repair")) return "fas fa-laptop";
  if (lowerCaseName.includes("tv repair")) return "fas fa-tv";
  if (lowerCaseName.includes("networking")) return "fas fa-network-wired";
  if (lowerCaseName.includes("home appliance")) return "fas fa-blender";
  if (lowerCaseName.includes("web design") || lowerCaseName.includes("website"))
    return "fas fa-globe";
  if (
    lowerCaseName.includes("mobile app design") ||
    lowerCaseName.includes("app development")
  )
    return "fas fa-mobile-alt";
  if (
    lowerCaseName.includes("electrical work") ||
    lowerCaseName.includes("repairs")
  )
    return "fas fa-bolt";
  if (lowerCaseName.includes("graphic design")) return "fas fa-paint-brush";
  if (
    lowerCaseName.includes("cctv installation") ||
    lowerCaseName.includes("security")
  )
    return "fas fa-video";
  return "fas fa-tools";
}

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

function renderServices(servicesData) {
  serviceGrid.innerHTML = "";
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
                      onclick="toggleTechnicianCapability('${service._id}', ${service.isAvailable})">
                <i class="${availabilityIcon}"></i> ${availabilityText}
              </button>
              <button class="action-btn delete-btn" onclick="deleteService('${service._id}')">
                <i class="fas fa-trash-alt"></i> Delete
              </button>
            </div>
          `;
      serviceGrid.appendChild(serviceCard);
    });
  } else {
    serviceGrid.innerHTML = "<p>No services found.</p>";
  }
  serviceCountBadge.textContent = servicesData.length;
}

// Dummy implementations for now
function toggleTechnicianCapability(id, currentState) {
  alert(`Toggle service ${id} to ${!currentState}`);
}
function deleteService(id) {
  alert(`Delete service ${id}`);
}

document.addEventListener("DOMContentLoaded", fetchServices);
