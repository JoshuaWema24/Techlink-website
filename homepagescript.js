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
