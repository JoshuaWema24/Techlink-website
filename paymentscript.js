const payMethods = document.querySelectorAll(".method-option");
const payNowBtn = document.getElementById("payNowBtn");
const mpesaOptionCard = document.getElementById("mpesa-option");
const mpesaPhoneInputContainer = document.getElementById(
  "mpesa-phone-input-container"
);
const mpesaPhoneInput = document.getElementById("mpesa-phone");
const mpesaAmountInput = document.getElementById("mpesa-amount");
const initiateMpesaPayBtn = document.getElementById("initiateMpesaPayBtn");
const paypal = document.getElementById("paypal-option");
const visa = document.getElementById("visa-option");
const mastercard = document.getElementById("mastercard-option");

paypal
  .Buttons({
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: "45.00", // Or make this dynamic
            },
            description: "Electrical Fault Diagnosis by Frank",
          },
        ],
      });
    },

    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        // Notify user
        alert("Payment completed by " + details.payer.name.given_name);

        // Prepare data to send to server
        const paymentData = {
          orderID: data.orderID,
          payerID: data.payerID,
          paymentID: details.id,
          payerName:
            details.payer.name.given_name + " " + details.payer.name.surname,
          payerEmail: details.payer.email_address,
          amount: details.purchase_units[0].amount.value,
          currency: details.purchase_units[0].amount.currency_code,
          status: details.status,
          description: details.purchase_units[0].description,
        };

        // Send to backend
        fetch("https://techlink-backend.onrender.com/api/payments/paypal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to post payment to server");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Server response:", data);
            // Redirect or show success screen if needed
          })
          .catch((error) => {
            console.error("Error posting to server:", error);
            alert("Payment succeeded but we couldn’t notify the server.");
          });
      });
    },

    onError: function (err) {
      console.error(err);
      alert("An error occurred during the transaction.");
    },
  })
  .render("#paypal-button-container");
let selectedMethod = null;

// Hide M-Pesa input
function hideMpesaInput() {
  mpesaPhoneInputContainer.style.display = "none";
  mpesaPhoneInput.value = "";
  mpesaAmountInput.value = "";
  payNowBtn.disabled = true;
}

// Show M-Pesa input
function showMpesaInput() {
  mpesaPhoneInputContainer.style.display = "flex";
}

// Payment method selection
payMethods.forEach((method) => {
  method.addEventListener("click", () => {
    payMethods.forEach((opt) => opt.classList.remove("selected"));
    method.classList.add("selected");
    selectedMethod = method.id;

    if (selectedMethod === "mpesa-option") {
      showMpesaInput();
      payNowBtn.style.display = "none";
    } else {
      hideMpesaInput();
      payNowBtn.style.display = "block";
      payNowBtn.disabled = false;
    }
  });
});

// Initiate M-Pesa STK Push
initiateMpesaPayBtn.addEventListener("click", async () => {
  const phone = mpesaPhoneInput.value.trim();
  const amount = mpesaAmountInput.value.trim();

  if (!/^(07\d{8}|2547\d{8})$/.test(phone)) {
    alert(
      "Please enter a valid Safaricom number (07xxxxxxxx or 2547xxxxxxxx)."
    );
    return;
  }

  if (!amount || isNaN(amount) || Number(amount) < 1) {
    alert("Please enter a valid amount.");
    return;
  }

  try {
    const response = await fetch(
      "https://techlink-backend.onrender.com/stkpush",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert("STK Push sent. Please complete the payment on your phone.");
    } else {
      alert("Payment failed: " + (result.message || "Unknown error."));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Network error: Could not contact server.");
  }
});

// General Pay Now (non-MPesa)
payNowBtn.addEventListener("click", () => {
  if (selectedMethod && selectedMethod !== "mpesa-option") {
    alert(
      `Proceeding with payment via ${selectedMethod.replace("-option", "")}.`
    );
  } else {
    alert("Please select a valid payment method.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  hideMpesaInput();
  payNowBtn.style.display = "block";
  payNowBtn.disabled = true;
});
