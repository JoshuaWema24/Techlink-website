// Function to decode a JWT token (client-side) - DEFINED ONCE AND CORRECTLY
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

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Get the token from local storage using the correct key 'token'.
  const token = localStorage.getItem("token");

  // 2. If no token, the user isn't logged in. Redirect to the sign-in page.
  if (!token) {
    console.log("No token found, redirecting to login.");
    // Clear any potentially stale data if we're redirecting
    localStorage.removeItem("user");
    localStorage.removeItem("role"); // Also clear the 'role' if you store it
    return (window.location.href = "signin.html");
  }

  // 3. Decode the token to get its payload.
  // This is the ONLY place you should call decodeJwt(token)
  const decodedToken = decodeJwt(token);

  // 4. Validate the decoded token and check for the user ID.
  // IMPORTANT: Your token payload uses 'id', not 'userId'.
  if (!decodedToken || !decodedToken.id) {
    // CORRECTED from !decodedToken.userId
    console.error("Invalid token or missing user ID in token payload.");
    alert("Authentication failed. Please log in again.");
    // Clear all relevant local storage items on authentication failure.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role"); // Clear role too
    return (window.location.href = "signin.html");
  }

  // Get the user ID from the decoded token.
  const userId = decodedToken.id; // CORRECTED from decodedToken.userId

  // --- OPTIONAL: Immediately populate from local storage for a faster initial display ---
  const storedUserDataString = localStorage.getItem("user");
  if (storedUserDataString) {
    try {
      const storedUser = JSON.parse(storedUserDataString);
      document.getElementById("name").value = storedUser.name || "";
      document.getElementById("email").value = storedUser.email || "";
      // Handle potential key difference for phone number ('phonenumber' vs 'phone')
      document.getElementById("phone").value =
        storedUser.phonenumber || storedUser.phone || "";
      document.getElementById("country").value = storedUser.country || "";
      // Map 'county' from stored data to 'city' input, or use 'city' if available
      document.getElementById("city").value =
        storedUser.county || storedUser.city || "";
      if (storedUser.profilePicture) {
        document.getElementById("profilePic").src = storedUser.profilePicture;
      }
      console.log("Profile data loaded from local storage (cached).");
    } catch (e) {
      console.error(
        "Error parsing stored user data, will attempt to fetch from server:",
        e
      );
      localStorage.removeItem("user"); // Clear corrupted local data
    }
  }

  // --- Fetch the latest user data from the backend ---
  try {
    // Use the extracted userId in your fetch request URL
    const res = await fetch(`https://techlink-backend.onrender.com/profile`, {
      headers: {
        Authorization: "Bearer " + token, // Send the JWT for authentication
      },
    });

    if (!res.ok) {
      // Handle cases where the server returns an error even with a valid token
      if (res.status === 401 || res.status === 403) {
        alert("Unauthorized access or token expired. Please log in again.");
        localStorage.removeItem("token"); // Clear token
        localStorage.removeItem("user"); // Clear user data
        localStorage.removeItem("role"); // Clear role
        return (window.location.href = "signin.html");
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const userProfileData = await res.json(); // Renamed to userProfileData to avoid confusion with `decodedToken`
    console.log("User profile data loaded from backend:", userProfileData);

    // Update local storage with the fresh data from the server.
    localStorage.setItem("user", JSON.stringify(userProfileData));

    // Populate your HTML input fields with the fetched data.
    document.getElementById("name").value = userProfileData.name || "";
    document.getElementById("email").value = userProfileData.email || "";
    document.getElementById("phone").value =
      userProfileData.phonenumber || userProfileData.phone || ""; // Handle both 'phonenumber' and 'phone'
    document.getElementById("country").value = userProfileData.country || "";
    document.getElementById("city").value =
      userProfileData.county || userProfileData.city || ""; // Map 'county' to 'city'
    if (userProfileData.profilePicture) {
      document.getElementById("profilePic").src =
        userProfileData.profilePicture;
    }

    // Disable inputs initially after loading data.
    document
      .querySelectorAll(".form-grid input")
      .forEach((input) => input.setAttribute("disabled", true));
  } catch (err) {
    console.error("Failed to load profile from backend:", err);
    // If backend fetch fails and no valid cached data was available, prompt to log in.
    if (!storedUserDataString || localStorage.getItem("user") === null) {
      alert("Failed to load profile. Please try again or log in.");
      window.location.href = "signin.html";
    } else {
      // If cached data exists, inform the user that refresh failed but display cached.
      alert(
        "Failed to refresh profile data from the server. Displaying cached information."
      );
    }
  }
});

// --- Profile Picture Preview ---
function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("profilePic").src = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

// --- Edit Profile Functionality ---
function editProfile() {
  document
    .querySelectorAll(".form-grid input")
    .forEach((input) => input.removeAttribute("disabled"));
}

// --- Save Profile Functionality ---
async function saveProfile() {
  // Basic client-side validation
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const country = document.getElementById("country").value.trim();
  const city = document.getElementById("city").value.trim();

  if (!name || !email || !phone || !country || !city) {
    alert("All profile fields are required.");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  const userData = {
    name: name,
    email: email,
    phone: phone, // This maps to the 'phone' input, ensure your backend expects 'phone' or adjust
    country: country,
    city: city, // This maps to the 'city' input, ensure your backend expects 'city' or adjust
  };

  const imageFile = document.getElementById("fileUpload").files[0];
  const formData = new FormData();
  formData.append("profileData", JSON.stringify(userData));
  if (imageFile) {
    formData.append("profilePicture", imageFile);
  }

  try {
    // Retrieve the current token again for the save operation.
    const currentToken = localStorage.getItem("token"); // Uses the correct 'token' key
    if (!currentToken) {
      alert("Authentication token missing. Please log in.");
      window.location.href = "signin.html";
      return;
    }

    // Send the update request to your backend.
    // Using PUT method for updates is generally better for RESTful APIs (idempotent).
    const res = await fetch(
      "https://Termyte-backend.onrender.com/profile/update",
      {
        method: "PUT", // Changed to PUT as discussed for updates
        headers: {
          Authorization: "Bearer " + currentToken,
          // IMPORTANT: Do NOT set 'Content-Type': 'application/json' when using FormData.
          // The browser automatically sets 'multipart/form-data' for FormData.
        },
        body: formData,
      }
    );

    const result = await res.json();
    if (res.ok) {
      alert("Profile updated successfully!");
      // Reload the page to ensure fresh data is displayed and inputs are disabled again.
      window.location.reload();
    } else {
      // Handle specific error responses from the backend.
      if (res.status === 401 || res.status === 403) {
        alert(
          "Unauthorized to update profile. Your session might have expired. Please log in again."
        );
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role"); // Clear role
        window.location.href = "signin.html";
      } else if (res.status === 400) {
        alert("Invalid data provided: " + (result.message || ""));
      } else {
        alert(
          "Update failed: " +
            (result.message || "An unexpected error occurred.")
        );
      }
    }
  } catch (err) {
    console.error("Error saving profile:", err);
    alert("Error saving profile. Please check your network connection.");
  }
}
