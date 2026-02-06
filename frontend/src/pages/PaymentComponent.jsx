import React from 'react';
import axios from 'axios';

const PaymentComponent = () => {

  // 1. Helper function to load the Razorpay script dynamically
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // 2. The Payment Handler
  const handlePayment = async () => {
    // A. Load the script
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // B. Call your Backend to create an order
    // Make sure your backend URL is correct (e.g., localhost or your EC2 IP)
    const result = await axios.post("http://localhost:3000/payment/create");

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    // C. Getting the order details
    const { amount, id: order_id, currency } = result.data.order;

    // D. Configure Razorpay Options
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Enter the Key ID generated from the Dashboard
      amount: amount,
      currency: currency,
      name: "DevTinder",
      description: "Premium Membership",
      image: "https://your-logo-url.com/logo.png", // Optional: Your logo
      order_id: order_id, // This is the one you created on backend
      
      // E. THE HANDLER: What happens after payment succeeds?
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        // ALERT: Do not upgrade the user here yet!
        // You must verify these 3 IDs on your backend first.
        const result = await axios.post("http://localhost:3000/payment/verify", data);

        alert(result.data.msg);
      },
      
      prefill: {
        name: "John Cena", // You can pre-fill from your user's profile
        email: "john@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#61dafb", // Match DevTinder's theme color
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="payment-card">
      <h2>Get DevTinder Premium</h2>
      <p>Unlock exclusive features for just ₹500</p>
      <button onClick={handlePayment}>
        Buy Now
      </button>
    </div>
  );
};

export default PaymentComponent;