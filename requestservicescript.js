document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  // ✅ Check authentication
  if (!token) {
    alert("You are not logged in.");
    window.location.href = "signin.html";
    return;
  }

  // Store token globally
  window.authToken = token;
});

// ✅ Decode JWT safely
function getUserIdFromToken(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.id || decodedPayload._id || decodedPayload.userId;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

// --- SERVICE MAP ---
const serviceMap = {
  "Device & PC Repair": [
    "Laptop Screen Repair (KES 5,000 - 15,000)",
    "Software Troubleshooting (KES 1,500 - 5,000)",
    "Virus Removal (KES 2,000 - 5,000)",
    "Hardware Upgrade (KES 4,000 - 10,000)",
    "Data Recovery (Quote required)",
  ],
  "Home Tech & Setup": [
    "Smart Home Installation (KES 4,000 - 8,000)",
    "Wi-Fi Network Setup (KES 3,000 - 6,000)",
    "Printer Configuration (KES 1,500 - 3,000)",
    "TV Mounting & Setup (KES 2,000 - 4,500)",
  ],
  "Plumbing & Water Solutions": [
    "Leaky Faucet Fix (KES 2,500 - 5,000)",
    "Toilet Repair (KES 3,000 - 6,000)",
    "Drain Unclogging (KES 4,000 - 7,000)",
    "Water Heater Service (KES 5,000 - 12,000)",
  ],
  "Electrical Wiring & Lighting": [
    "Socket Installation (KES 2,500 - 4,000 per point)",
    "Lighting Fixture Repair (KES 2,000 - 5,000)",
    "Circuit Breaker Issues (KES 4,000 - 8,000)",
    "Rewiring Service (Quote required)",
  ],
  "Website Development": [
    "Landing Page Design (KES 15,000 - 50,000)",
    "Full E-commerce Site (KES 80,000 - 250,000+)",
    "CMS Integration (WordPress/Other) (KES 25,000 - 70,000)",
    "Website Redesign (KES 30,000 - 90,000)",
  ],
  "Mobile App Development": [
    "iOS App (Swift/Kotlin) (KES 100,000 - 400,000+)",
    "Android App (Java/Kotlin) (KES 80,000 - 350,000+)",
    "Cross-Platform App (React Native/Flutter) (KES 80,000 - 300,000+)",
  ],
  "IT Support & Security": [
    "Cybersecurity Audit (Quote required)",
    "Managed IT Services (KES 5,000 - 20,000 monthly)",
    "Office 365 Setup (KES 2,000 - 5,000 per user)",
    "Cloud Backup Solutions (Quote required)",
  ],
  "Bespoke Software": [
    "Custom CRM/ERP (Quote required)",
    "Database Design (Quote required)",
    "Automation Tools (KES 30,000 - 150,000)",
  ],
};

const subsequentCardIds = [
  "card-location",
  "card-urgency",
  "card-time",
  "card-description",
];

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  const requestForm = document.getElementById("requestForm");
  const submitBtn = document.querySelector(".submit-btn");
  const messageBox = document.getElementById("messageBox");
  const serviceTypeSelect = document.getElementById("serviceType");
  const specificServiceSelect = document.getElementById("specificService");
  const subServiceCard = document.getElementById("card-sub-service");
  const locationCard = document.getElementById("card-location");

  document.getElementById("card-service")?.classList.add("active");

  // --- Card Toggle ---
  cards.forEach((card) => {
    const header = card.querySelector(".card-header");
    if (header) {
      header.addEventListener("click", (e) => {
        e.stopPropagation();
        const isActive = card.classList.contains("active");
        cards.forEach((c) => c.classList.remove("active"));
        if (!isActive) card.classList.add("active");
      });
    }
  });

  // --- When Service Type is Selected ---
  serviceTypeSelect.addEventListener("change", (event) => {
    const selectedType = event.target.value;
    const subServices = serviceMap[selectedType] || [];

    specificServiceSelect.innerHTML =
      '<option value="" disabled selected>Select a specific service...</option>';
    specificServiceSelect.disabled = false;

    subServices.forEach((service) => {
      const option = document.createElement("option");
      option.value = service;
      option.textContent = service;
      specificServiceSelect.appendChild(option);
    });

    document.getElementById("card-service").classList.remove("active");
    subServiceCard.classList.add("active");

    subsequentCardIds.forEach((id) =>
      document.getElementById(id)?.classList.remove("active")
    );

    subServiceCard.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // --- Move to Location After Selecting Sub-Service ---
  specificServiceSelect.addEventListener("change", () => {
    if (specificServiceSelect.value) {
      subServiceCard.classList.remove("active");
      locationCard.classList.add("active");
      locationCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  // --- FORM SUBMISSION ---
  requestForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = window.authToken;
    const userId = getUserIdFromToken(token);

    if (!userId) {
      alert("Invalid or expired token. Please sign in again.");
      localStorage.removeItem("token");
      window.location.href = "signin.html";
      return;
    }

    const formData = new FormData(requestForm);
    const data = Object.fromEntries(formData.entries());

    if (!data.serviceType || !data.specificService) {
      showMessage(
        "Please select both Service Type and Specific Service.",
        "error"
      );
      const cardToActivate = data.serviceType
        ? subServiceCard
        : document.getElementById("card-service");
      cards.forEach((c) => c.classList.remove("active"));
      cardToActivate.classList.add("active");
      cardToActivate.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    submitBtn.disabled = true;

    // ✅ Payload matches backend request structure + userId
    const payload = {
      userId,
      serviceType: data.serviceType,
      specificService: data.specificService,
      location: data.location,
      urgency: data.urgency,
      time: data.time,
      description: data.description,
    };

    const BACKEND_SUBMISSION_URL =
      "https://techlink-backend.onrender.com/api/request-service";

    try {
      const response = await fetch(BACKEND_SUBMISSION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Send token securely
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);

      const cleanService = data.specificService.replace(/\s*\(.*\)$/, "");
      showMessage(
        `✅ "${cleanService}" request submitted successfully for ${data.location}. We'll reach out soon!`,
        "success"
      );

      requestForm.reset();
      specificServiceSelect.disabled = true;
      specificServiceSelect.innerHTML =
        '<option value="" disabled selected>Please select a Service Type first...</option>';
      cards.forEach((c) => c.classList.remove("active"));
      document.getElementById("card-service").classList.add("active");
    } catch (error) {
      console.error(error);
      showMessage(`❌ Submission failed: ${error.message}`, "error");
    } finally {
      submitBtn.disabled = false;
    }
  });

  // --- Helper: Message Display ---
  function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.classList.remove("hidden");
    messageBox.style.backgroundColor =
      type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3";
    messageBox.classList.add("fade-in");

    setTimeout(() => {
      messageBox.classList.remove("fade-in");
      setTimeout(() => messageBox.classList.add("hidden"), 500);
    }, 5000);
  }
});
