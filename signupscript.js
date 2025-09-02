let selectedRole = "";

function selectRole(role) {
  selectedRole = role;
  const dynamicFields = document.getElementById("dynamicFields");
  const nextBtn = document.getElementById("nextBtnContainer");
  let fields = "";
  const common = [
    "Name",
    "Email",
    "Phone Number",
    "Country",
    "County",
    "Subcounty",
    "Estate",
    "Password",
    "Confirm Password",
  ];
  fields = common
    .map(
      (label) => `
        <div class="form-group">
          <label>${label}</label>
          <input type="${
            label.toLowerCase().includes("password") ? "password" : "text"
          }"
                 name="${label.toLowerCase().replace(/ /g, "_")}" required />
        </div>
      `
    )
    .join("");

  if (role === "technician") {
    fields += `
          <div class="form-group">
            <label>Job Type</label>
            <select name="job_type" required>
              <option value="">Select a Job Type</option>
              <option value="electrical_work">Electrical Work</option>
              <option value="mobile_app_dev">Mobile App Development</option>
              <option value="web_dev">Web Development</option>
              <option value="networking">Networking</option>
              <option value="mobile_phone_repair">Mobile Phone Repair</option>
            </select>
          </div>
        `;
  }

  dynamicFields.innerHTML = fields;
  nextBtn.style.display = "block";
}

document
  .getElementById("roleForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!selectedRole) {
      alert("Please select a role before submitting.");
      return;
    }

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirm_password) {
      alert("Passwords do not match.");
      return;
    }

    const payload = {
      name: data.name,
      email: data.email,
      phonenumber: data.phone_number,
      country: data.country,
      county: data.county,
      subcounty: data.subcounty,
      estate: data.estate,
      password: data.password,
      ...(selectedRole === "technician" && { jobtype: data.job_type }),
    };

    try {
      const baseUrl = "https://techlink-backend.onrender.com";
      const endpoint =
        selectedRole === "technician"
          ? `${baseUrl}/technicianSignUp`
          : `${baseUrl}/customerSignUp`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Sign-up successful!");

        if (selectedRole === "customer") {
          alert("Welcome to Termyte, we are here to bring the service to you!");
          window.location.href = "signin.html";
        } else {
          alert("Welcome to Termyte, let's put a price to your skill");
          window.location.href = "signin.html";
        }
      } else {
        alert("Error: " + (result.message || "Unknown error occurred"));
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Server error. Please try again later.");
    }
  });
