const withdrawMethods = document.querySelectorAll(".method-option");
const mpesaWithdrawOption = document.getElementById("mpesa-withdraw-option");
const bankWithdrawOption = document.getElementById("bank-withdraw-option");
const mpesaWithdrawInputContainer = document.getElementById(
  "mpesa-withdraw-input-container"
);
const bankWithdrawInputContainer = document.getElementById(
  "bank-withdraw-input-container"
);
const initiateMpesaWithdrawBtn = document.getElementById(
  "initiateMpesaWithdrawBtn"
);
const initiateBankWithdrawBtn = document.getElementById(
  "initiateBankWithdrawBtn"
);
const currentBalanceDisplay = document.getElementById("current-balance");

let currentBalance = 12500.0; // Initial balance in KES (for demonstration)

// Function to format currency
function formatCurrency(amount) {
  return `Ksh ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Update balance display
function updateBalanceDisplay() {
  currentBalanceDisplay.textContent = formatCurrency(currentBalance);
}

// Hide all withdrawal input forms
function hideAllWithdrawalForms() {
  mpesaWithdrawInputContainer.style.display = "none";
  bankWithdrawInputContainer.style.display = "none";
  // Reset form fields
  document
    .querySelectorAll(".withdrawal-input-container input")
    .forEach((input) => (input.value = ""));
}

// Event listeners for withdrawal method selection
withdrawMethods.forEach((method) => {
  method.addEventListener("click", () => {
    withdrawMethods.forEach((opt) => opt.classList.remove("selected"));
    method.classList.add("selected");
    hideAllWithdrawalForms(); // Hide all forms first

    if (method.id === "mpesa-withdraw-option") {
      mpesaWithdrawInputContainer.style.display = "flex";
    } else if (method.id === "bank-withdraw-option") {
      bankWithdrawInputContainer.style.display = "flex";
    }
    // Add more conditions for other methods
  });
});

// M-Pesa Withdrawal Logic
initiateMpesaWithdrawBtn.addEventListener("click", () => {
  const phone = document.getElementById("mpesa-withdraw-phone").value.trim();
  const amount = parseFloat(
    document.getElementById("mpesa-withdraw-amount").value
  );

  if (!/^(07\d{8}|2547\d{8})$/.test(phone)) {
    alert(
      "Please enter a valid Safaricom number (07xxxxxxxx or 2547xxxxxxxx)."
    );
    return;
  }

  if (isNaN(amount) || amount <= 0 || amount > currentBalance) {
    alert(
      "Please enter a valid withdrawal amount, not exceeding your current balance."
    );
    return;
  }

  // Simulate API call for M-Pesa withdrawal
  // In a real application, you would send this to your backend
  console.log(`Initiating M-Pesa withdrawal of Ksh ${amount} to ${phone}`);
  alert(
    `M-Pesa withdrawal of ${formatCurrency(
      amount
    )} to ${phone} initiated. Please wait for confirmation.`
  );

  // Simulate balance update after successful withdrawal
  currentBalance -= amount;
  updateBalanceDisplay();
  hideAllWithdrawalForms(); // Hide form after initiation
  withdrawMethods.forEach((opt) => opt.classList.remove("selected")); // Deselect method

  // In a real app, you'd handle success/failure from the backend
});

// Bank Withdrawal Logic
initiateBankWithdrawBtn.addEventListener("click", () => {
  const accountName = document.getElementById("bank-account-name").value.trim();
  const accountNumber = document
    .getElementById("bank-account-number")
    .value.trim();
  const bankName = document.getElementById("bank-name").value.trim();
  const amount = parseFloat(
    document.getElementById("bank-withdraw-amount").value
  );

  if (!accountName || !accountNumber || !bankName) {
    alert("Please fill in all bank details.");
    return;
  }

  if (isNaN(amount) || amount <= 0 || amount > currentBalance) {
    alert(
      "Please enter a valid withdrawal amount, not exceeding your current balance."
    );
    return;
  }

  // Simulate API call for Bank withdrawal
  // In a real application, you would send this to your backend
  console.log(
    `Initiating Bank withdrawal of Ksh ${amount} to account ${accountNumber} at ${bankName} (${accountName})`
  );
  alert(
    `Bank withdrawal of ${formatCurrency(
      amount
    )} to ${bankName} initiated. Funds should reflect within 1-3 business days.`
  );

  // Simulate balance update after successful withdrawal
  currentBalance -= amount;
  updateBalanceDisplay();
  hideAllWithdrawalForms(); // Hide form after initiation
  withdrawMethods.forEach((opt) => opt.classList.remove("selected")); // Deselect method

  // In a real app, you'd handle success/failure from the backend
});

// Initial setup when the page loads
document.addEventListener("DOMContentLoaded", () => {
  updateBalanceDisplay(); // Set initial balance text
  hideAllWithdrawalForms(); // Ensure all forms are hidden initially
});
