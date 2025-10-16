document.addEventListener("DOMContentLoaded", () => {
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const sidebar = document.getElementById("sidebar");

  if (hamburgerMenu && sidebar) {
    hamburgerMenu.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    // Optional: Close sidebar when a nav link is clicked (for better mobile UX)
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // Check if the sidebar is open and on a small screen
        if (window.innerWidth <= 1024 && sidebar.classList.contains("open")) {
          sidebar.classList.remove("open");
        }
      });
    });

    // Optional: Close sidebar if clicking outside of it on mobile
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
});
 document.addEventListener("DOMContentLoaded", () => {
  const bell = document.getElementById("notificationBell");
  const dropdown = document.getElementById("notificationDropdown");
  const countElem = document.getElementById("notificationCount");
  const listElem = document.getElementById("notificationList");
  const noNotif = document.getElementById("noNotifications");

  let notifications = [];

  // 🔘 Toggle dropdown visibility
  bell.addEventListener("click", () => {
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
    countElem.style.display = "none";
  });

  // ❌ Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!bell.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  // 📨 Add new notification
  function addNotification(message) {
    notifications.unshift({
      message,
      time: new Date().toLocaleTimeString(),
    });
    updateNotificationUI();
  }

  // 🔄 Update dropdown + badge
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

  // 🔌 SOCKET.IO connection
  const socket = io("https://techlink-backend.onrender.com", {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("✅ Connected to Socket.IO for announcements");
  });

  socket.on("disconnect", () => {
    console.warn("⚠️ Disconnected from Socket.IO server");
  });

  // 🆕 Receive announcement from backend
  socket.on("announcementCreated", (announcement) => {
    console.log("📢 New announcement received:", announcement);

    // Add to dropdown in real-time
    const title = announcement.title || "New Announcement";
    const message = announcement.message || "Check the latest update.";

    addNotification(`${title}: ${message}`);
  });
});
