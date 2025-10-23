document.addEventListener("DOMContentLoaded", () => {
  // ===== Sidebar Toggle =====
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const sidebar = document.getElementById("sidebar");

  if (hamburgerMenu && sidebar) {
    hamburgerMenu.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 1024 && sidebar.classList.contains("open")) {
          sidebar.classList.remove("open");
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (
        window.innerWidth <= 1024 &&
        !sidebar.contains(event.target) &&
        !hamburgerMenu.contains(event.target) &&
        sidebar.classList.contains("open")
      ) {
        sidebar.classList.remove("open");
      }
    });
  }

  // ===== Notification Elements =====
  const bell = document.getElementById("notificationBell");
  const dropdown = document.getElementById("notificationDropdown");
  const countElem = document.getElementById("notificationCount");
  const listElem = document.getElementById("notificationList");
  const noNotif = document.getElementById("noNotifications");

  // Sidebar "My Jobs" badge
  const myJobsLink = document.querySelector('a[href="jobsscreen.html"]');
  const jobBadge = document.createElement("span");
  jobBadge.id = "jobCountBadge";
  jobBadge.style.cssText = `
    background-color: red;
    color: white;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: 8px;
    display: none;
  `;
  myJobsLink.appendChild(jobBadge);

  let notifications = [];
  let jobCount = 0;

  // ===== Dropdown Behavior =====
  bell.addEventListener("click", () => {
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
    countElem.style.display = "none";
  });

  document.addEventListener("click", (e) => {
    if (!bell.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  // ===== Notification UI Management =====
  function addNotification(message) {
    notifications.unshift({
      message,
      time: new Date().toLocaleTimeString(),
    });
    updateNotificationUI();
  }

  function updateNotificationUI() {
    listElem.innerHTML = "";
    if (notifications.length === 0) {
      noNotif.style.display = "block";
    } else {
      noNotif.style.display = "none";
      notifications.forEach((n) => {
        const li = document.createElement("li");
        li.textContent = `📢 ${n.message} (${n.time})`;
        listElem.appendChild(li);
      });
      countElem.style.display = "flex";
      countElem.textContent = notifications.length;
    }
  }

  // ===== SOCKET.IO Connection =====
  const token = localStorage.getItem("token");
  let technicianId = null;

  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      technicianId = decoded.id;
    } catch (err) {
      console.error("Error decoding JWT:", err);
    }
  }

  const socket = io("https://techlink-backend.onrender.com", {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("✅ Connected to Socket.IO server");
    if (technicianId) socket.emit("register", technicianId);
  });

  socket.on("disconnect", () => {
    console.warn("⚠️ Disconnected from Socket.IO server");
  });

  // ===== Listen for Announcements =====
  socket.on("announcementCreated", (announcement) => {
    const title = announcement.title || "New Announcement";
    const message = announcement.message || "Check the latest update.";
    addNotification(`${title}: ${message}`);
  });

  // ===== Listen for New Job Assignments =====
  socket.on("new-job", (job) => {
    console.log("🧰 New job assigned:", job);

    jobCount++;
    addNotification(`New Job Assigned: ${job.serviceType || "Job"}`);

    // Update the "My Jobs" badge
    jobBadge.textContent = jobCount;
    jobBadge.style.display = "inline-block";

    // ✨ Show custom popup instead of alert
    showPopupMessage(
      `🔧 New Job Assigned!`,
      `Service: ${job.serviceType || "Unknown"}<br>Location: ${
        job.location || "N/A"
      }`
    );
  });

  // ===== Popup Message Function =====
  function showPopupMessage(title, message) {
    // Create popup container
    const popup = document.createElement("div");
    popup.className = "custom-popup";

    // Inner content
    popup.innerHTML = `
    <div class="popup-content">
      <h3>${title}</h3>
      <p>${message}</p>
      <button id="closePopup">OK</button>
    </div>
  `;

    document.body.appendChild(popup);

    // Add fade-in
    setTimeout(() => popup.classList.add("show"), 10);

    // Close handler
    popup.querySelector("#closePopup").addEventListener("click", () => {
      popup.classList.remove("show");
      setTimeout(() => popup.remove(), 300);
    });

    // Auto-remove after 6 seconds
    setTimeout(() => {
      if (popup.parentNode) {
        popup.classList.remove("show");
        setTimeout(() => popup.remove(), 300);
      }
    }, 6000);
  }
});
