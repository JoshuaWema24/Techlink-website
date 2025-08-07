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
 const serviceGrid = document.getElementById("serviceGrid");

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


// Example service data (will be replaced by actual API fetch if successful)
const exampleServices = [
  {
    _id: "6543210001",
    serviceName: "Mobile Phone Repair",
    serviceInfo:
      "Experiencing issues with your smartphone, from cracked screens to battery problems? With Termyte, simply submit a detailed repair request through the app, specifying your device model and the issue. Our certified technicians will review your request and contact you directly via the app's chat or your provided phone number to confirm details, offer an estimated quote, and arrange a convenient time for pickup or on-site repair. We prioritize quick, reliable fixes to get your mobile device back in your hands.",
    isAvailable: true,
  },
  {
    _id: "6543210002",
    serviceName: "Laptop Repair",
    serviceInfo:
      "Is your laptop running slow, not turning on, or facing software glitches? Termyte connects you with expert technicians for all laptop repair needs. Just describe your laptop's make, model, and the problem through the app. A specialist will reach out to you to diagnose the issue, provide a transparent quote, and schedule a repair. Our goal is to minimize your downtime with efficient and effective solutions.",
    isAvailable: true,
  },
  {
    _id: "6543210003",
    serviceName: "TV Repair",
    serviceInfo:
      "Having trouble with your television's display, sound, or connectivity? Termyte's TV repair specialists are here to help. Submit a service request via the app, detailing your TV's brand, model, and the symptoms. A qualified technician will contact you to discuss the issue, provide an assessment, and arrange a home visit or pickup for repair, ensuring your entertainment is back on track.",
    isAvailable: true,
  },
  {
    _id: "6543210004",
    serviceName: "Networking",
    serviceInfo:
      "Need help setting up a new home network, troubleshooting Wi-Fi issues, or optimizing your office connectivity? Termyte connects you with networking experts. Use the app to describe your networking challenge or project. A technician will contact you to understand your setup, offer solutions, and schedule an on-site visit to ensure seamless and secure internet access for all your devices.",
    isAvailable: true,
  },
  {
    _id: "6543210005",
    serviceName: "Home Appliance Repair",
    serviceInfo:
      "Is your refrigerator, washing machine, oven, or other home appliance malfunctioning? Termyte provides access to skilled technicians for all major appliance repairs. Simply log a service request in the app, detailing the appliance type, brand, and the issue. An appliance repair specialist will contact you to gather more information, provide a preliminary diagnosis, and arrange a convenient time for an inspection and repair at your home.",
    isAvailable: true,
  },
  {
    _id: "6543210006",
    serviceName: "Web Design and Maintenance",
    serviceInfo:
      "Looking to build a new website, redesign an existing one, or need ongoing maintenance? Termyte connects you with professional web designers and developers. Submit your project brief through the app, outlining your vision and requirements. A web specialist will contact you to discuss your project in detail, provide a custom proposal, and guide you through the entire process from concept to launch and continuous support.",
    isAvailable: true,
  },
  {
    _id: "6543210007",
    serviceName: "Mobile App Design and Development",
    serviceInfo:
      "Have an innovative app idea you want to bring to life, or need to enhance an existing mobile application? Termyte links you with experienced mobile app designers and developers for both iOS and Android platforms. Describe your app concept or development needs via the app. Our team will connect with you to refine your idea, outline the development stages, and ensure your app is functional, user-friendly, and visually appealing.",
    isAvailable: false,
  },
  {
    _id: "6543210008",
    serviceName: "Electrical Work and Repairs",
    serviceInfo:
      "For any electrical installations, repairs, or safety checks in your home or business, Termyte connects you with certified electricians. Simply describe your electrical needs or the problem you're facing through the app. A qualified electrician will contact you to assess the situation, provide a transparent quote, and schedule a safe and efficient service, adhering to all safety standards.",
    isAvailable: true,
  },
  {
    _id: "6543210009",
    serviceName: "Graphic Design",
    serviceInfo:
      "Need professional graphic design for your brand, marketing materials, or personal projects? Termyte connects you with talented graphic designers. Submit your design brief through the app, explaining your vision and requirements. A designer will contact you to discuss your creative needs, provide design concepts, and collaborate with you to deliver high-quality visuals that bring your ideas to life.",
    isAvailable: true,
  },
  {
    _id: "6543210010",
    serviceName: "CCTV Installation",
    serviceInfo:
      "Enhance your security with our professional CCTV installation services. We design and install surveillance systems tailored to your property's needs, providing peace of mind. To arrange an installation, submit a service request outlining your requirements through the Termyte app. A security technician will contact you to conduct a site assessment, recommend the best system, and schedule the installation at your convenience. We ensure discreet and effective camera placement.",
    isAvailable: true,
  },
];

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
    return "fas fa-blender"; // Or another suitable appliance icon
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
    return "fas fa-mobile-alt"; // Reusing mobile icon for app development
  }
  if (
    lowerCaseName.includes("electrical work") ||
    lowerCaseName.includes("repairs")
  ) {
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

async function fetchServices() {
  try {
    // Attempt to fetch from the backend API first
    const response = await fetch(
      "https://techlink-backend.onrender.com/api/getServices"
    );
    if (!response.ok) {
      console.warn(
        `Backend fetch failed with status: ${response.status}. Falling back to example data.`
      );
      // If backend fails, use example data
      renderServices(exampleServices);
      return;
    }
    const servicesData = await response.json();
    renderServices(servicesData);
  } catch (error) {
    console.error("Error fetching services from backend:", error);
    // If any error occurs during fetch, use example data
    renderServices(exampleServices);
  }
}

function renderServices(servicesData) {
  serviceGrid.innerHTML = ""; // Clear existing cards
  if (servicesData && servicesData.length > 0) {
    servicesData.forEach((service, index) => {
      const serviceCard = document.createElement("div");
      serviceCard.classList.add("service-card");
      // Add animation delay for staggered effect
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
