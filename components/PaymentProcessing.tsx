"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

type PaymentStatus = "processing" | "success" | "failed";

interface PaymentProcessingProps {
    status: PaymentStatus
}

export default function PaymentProcessing({ status }: PaymentProcessingProps) {

    useEffect(() => {
        // Disable back button during processing
        const preventBack = () => window.history.pushState(null, "", window.location.href);

        if (status === "processing") {

            window.history.pushState(null, "", window.location.href);
            window.addEventListener("popstate", preventBack);
        }
        else {
            return () => window.removeEventListener("popstate", preventBack);
        }

        return () => window.removeEventListener("popstate", preventBack);
    }, [status]);

    const renderContent = () => {
        switch (status) {
            case "processing":
                return (
                    <>
                        <Loader2 className="animate-spin text-blue-500 w-16 h-16 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-800">Processing Payment...</h2>
                        <p className="text-gray-500 mt-2 text-center max-w-sm">
                            Please wait a moment while we verify your payment and confirm your order.
                        </p>
                    </>
                );
            case "success":
                return (
                    <>
                        <CheckCircle className="text-green-500 w-16 h-16 mb-4 animate-bounce" />
                        <h2 className="text-2xl font-semibold text-green-600">Payment Successful!</h2>
                        <p className="text-gray-500 mt-2 text-center max-w-sm">
                            Your order has been confirmed. Redirecting you to order summary...
                        </p>
                    </>
                );
            case "failed":
                return (
                    <>
                        <XCircle className="text-red-500 w-16 h-16 mb-4 animate-pulse" />
                        <h2 className="text-2xl font-semibold text-red-600">Payment Failed</h2>
                        <p className="text-gray-500 mt-2 text-center max-w-sm">
                            Something went wrong. Please try again or contact support.
                        </p>
                    </>
                );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center"
        >
            {renderContent()}

            <div className="mt-8 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                {status === "processing" && (
                    <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                    />
                )}
            </div>
        </motion.div>
    );
}
