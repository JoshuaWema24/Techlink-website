const payMethods = document.querySelectorAll(".method-option");
const payNowBtn = document.getElementById("payNowBtn");
const mpesaPhoneInputContainer = document.getElementById(
  "mpesa-phone-input-container"
);
const mpesaPhoneInput = document.getElementById("mpesa-phone");
const mpesaAmountInput = document.getElementById("mpesa-amount");
const initiateMpesaPayBtn = document.getElementById("initiateMpesaPayBtn");

// ================== PAYPAL ==================
paypal
  .Buttons({
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: { value: "45.00" }, // TODO: make this dynamic
            description: "Electrical Fault Diagnosis by Frank",
          },
        ],
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        alert("Payment completed by " + details.payer.name.given_name);

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

        fetch("https://techlink-backend.onrender.com/api/payments/paypal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Server response:", data);
          })
          .catch((err) => {
            console.error("Error posting PayPal payment:", err);
            alert("Payment succeeded but we couldn’t notify the server.");
          });
      });
    },
    onError: function (err) {
      console.error(err);
      alert("An error occurred during the PayPal transaction.");
    },
  })
  .render("#paypal-button-container");

// ================== GENERAL PAYMENT ==================
let selectedMethod = null;

function hideMpesaInput() {
  mpesaPhoneInputContainer.style.display = "none";
  mpesaPhoneInput.value = "";
  mpesaAmountInput.value = "";
  payNowBtn.disabled = true;
}

function showMpesaInput() {
  mpesaPhoneInputContainer.style.display = "flex";
}

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

// ================== POLLING FUNCTION ==================
async function checkPaymentStatus(reference) {
  try {
    const response = await fetch(
      `https://techlink-backend.onrender.com/payment-status/${reference}`
    );
    const result = await response.json();

    if (result.status === "SUCCESS") {
      clearInterval(window.paymentStatusInterval);
      alert("✅ Payment successful! Thank you.");
      // Optional: redirect to success page
      window.location.href = "/payment-success.html";
    } else if (result.status === "FAILED") {
      clearInterval(window.paymentStatusInterval);
      alert("❌ Payment failed. Please try again.");
    }
    // If still pending, keep polling
  } catch (err) {
    console.error("Error checking payment status:", err);
  }
}

// ================== M-PESA STK PUSH ==================
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

    if (response.ok && result.success) {
      const reference = result.data.reference; // Backend should send this
      alert("📲 STK Push sent! Enter PIN on your phone to complete payment.");

      // Start polling every 5 seconds
      window.paymentStatusInterval = setInterval(() => {
        checkPaymentStatus(reference);
      }, 5000);
    } else {
      alert(
        "❌ Payment initiation failed: " + (result.message || "Unknown error.")
      );
    }
  } catch (error) {
    console.error("Error:", error);
    alert("⚠️ Network error: Could not contact payment server.");
  }
});

// ================== PAY NOW BUTTON (NON-MPESA) ==================
payNowBtn.addEventListener("click", () => {
  if (selectedMethod && selectedMethod !== "mpesa-option") {
    alert(
      `Proceeding with payment via ${selectedMethod.replace("-option", "")}.`
    );
  } else {
    alert("Please select a valid payment method.");
  }
});

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  hideMpesaInput();
  payNowBtn.style.display = "block";
  payNowBtn.disabled = true;
});
