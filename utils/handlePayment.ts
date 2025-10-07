import toast from "react-hot-toast";
import { axiosClient } from "./axiosClient";
import { OrderSummary } from "@/app/(pages)/cart/page";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Function to initialize Razorpay payment
const initPay = (
  data: RazorpayOrder,
  orderId: string
): Promise<OrderSummary | null> => {
  return new Promise((resolve) => {
    const { id, amount, currency } = data;
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount,
      currency,
      name: "Zealous Health",
      description: "Service Payment",
      image: "/logo.png",
      order_id: id,
      handler: async (response: RazorpayResponse) => {
        try {
          const verificationResponse = await axiosClient.post(
            `/api/payments/verify?orderId=${orderId}`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount / 100, // Convert paise -> INR
            }
          );
          if (verificationResponse.data.status === "ok") {
            toast.success("Payment Successful");
            resolve(verificationResponse.data.result);
          } else {
            toast.error("Payment Failed");
            resolve(null);
          }
        } catch (error) {
          toast.error("Payment Cancelled");
          resolve(null);
        }
      },
      theme: { color: "#71BF45" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  });
};

export const handlePayment = async (totalPrice: number, orderId: string) => {
  try {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load.");
      return null;
    }

    const response = await axiosClient.post("/api/payments/order", {
      amount: totalPrice,
    });

    return await initPay(response.data.result as RazorpayOrder, orderId);
  } catch (error) {
    toast.error("Unable to initiate payment");
    return null;
  }
};
