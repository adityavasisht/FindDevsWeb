import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // <--- Using your existing Context!
import './PaymentComponent.css';

const PaymentComponent = () => {
  
  // 1. Get the user directly from your AuthContext
  const { user } = useAuth(); 

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => { resolve(true); };
      script.onerror = () => { resolve(false); };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // 2. Safety Check: Ensure we have a user before paying
    if (!user || !user._id) {
        alert("Please login first!");
        return;
    }

    try {
        // 3. Send the userId from Context to your Backend
        const result = await axios.post("http://localhost:3000/create", 
            {},
            {withCredentials: true},
             
        );
        console.log("Order Data:", result.data);

        // Check if the order was created successfully
        if (!result.data || !result.data.order) {
            alert("Server error: Order not created");
            return;
        }

        const { amount, id: order_id, currency } = result.data.order;

        const options = {
            key: "rzp_test_SCohf3b7ZwPh2I", // <--- REPLACE THIS WITH YOUR ACTUAL KEY!
            amount: amount,
            currency: currency,
            name: "FindDevs",
            description: "Premium Membership",
            order_id: order_id, 
            
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };

                // Verify the payment
                const verifyResult = await axios.post("http://localhost:3000/verify", data);
                alert(verifyResult.data.message || "Payment Successful!");
            },
            
            prefill: {
                name: user.firstName + " " + user.lastName, // Optional: Use real user data
                email: user.emailId,                        // Optional: Use real user data
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

    } catch (err) {
        console.error(err);
        alert("Payment processing failed. Check console for details.");
    }
  };

  return (
    <div className="payment-card">
      <h2>Get FindDevs Premium</h2>
      <p>Unlock exclusive features for just ₹500</p>
      <button onClick={handlePayment} className="buy-now-button">
        Buy Now
      </button>
    </div>
  );
};

export default PaymentComponent;