/**
 * Checkout Page
 * 
 * This component renders the checkout form for billing details and order placement.
 * It fetches user details from the backend, allows users to edit their billing info,
 * and submits the order along with cart items. Shows loading state while fetching data.
 */

// Import required modules and components
"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { axiosClient } from "@/utils/axiosClient";
import toast from "react-hot-toast";
import { useAppSelector } from "@/lib/hooks";

// Interface for customer billing details
interface CustomerDetails {
    _id: string;
    firstName: string;
    lastName: string;
    country: string;
    streetAddress: string;
    houseNo: string;
    landmark: string;
    city: string;
    state: string;
    phone: string;
    pinCode: string;
    email: string;
}

function Checkout() {
    // State for billing form data
    const [formData, setFormData] = useState<CustomerDetails>({
        _id: "",
        firstName: "",
        lastName: "",
        country: "",
        streetAddress: "",
        houseNo: "",
        landmark: "",
        city: "",
        state: "",
        phone: "",
        pinCode: "",
        email: "",
    });

    // State for loading indicator
    const [loading, setLoading] = useState<boolean>(false);

    // Get cart items from Redux store
    const cart = useAppSelector((state) => state.cartSlice.cart) || []

    // Fetch user billing details on mount
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true)
                // Get user details from backend
                const res = await axiosClient.get("/api/users?type=me");
                if (res.data.result) {
                    // Populate form with fetched details
                    setFormData((prev) => ({ ...prev, ...res.data.result }));
                }
            } catch (err) {
                console.error("Failed to fetch billing details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    // Handle input changes in the form
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Handle form submission for billing and order placement
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // Update user billing details
            const res = await axiosClient.put("/api/users", formData);
            toast.success(res.data.result)
            // Place the order with cart items
            const orderResponse = await axiosClient.post("/api/orders", { cart })
            toast.success(orderResponse.data.result)
        } catch { }
    };

    // Show loading indicator while fetching user details
    if (loading) return <p className="text-center my-center text-xl font-semibold">Loading...</p>;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-lg mx-auto p-4 my-10 border rounded"
        >
            <p className="font-semibold text-xl">BILLING DETAILS</p>

            {/* Render billing input fields */}
            {[
                { id: "firstName", label: "First Name *", type: "text", required: true },
                { id: "lastName", label: "Last Name *", type: "text", required: true },
                { id: "country", label: "Country *", type: "text", required: true },
                { id: "streetAddress", label: "Street Address *", type: "text", required: true },
                { id: "hoseNo", label: "House No.", type: "text", required: false },
                { id: "landmark", label: "Landmark / Street *", type: "text", required: true },
                { id: "city", label: "Town / City *", type: "text", required: true },
                { id: "state", label: "State *", type: "text", required: true },
                { id: "phone", label: "Phone *", type: "tel", required: true },
                { id: "pinCode", label: "PIN Code *", type: "text", required: true },
                { id: "email", label: "Email Address *", type: "email", required: true },
            ].map(({ id, label, type, required }) => (
                <div key={id} className="space-y-2">
                    {/* Input label */}
                    <label htmlFor={id}>{label}</label>
                    {/* Input field */}
                    <input
                        type={type}
                        id={id}
                        placeholder={label.replace(" *", "")}
                        value={formData[id as keyof CustomerDetails] || ""}
                        onChange={handleChange}
                        required={required}
                        className="w-full border p-2 rounded"
                    />
                </div>
            ))}

            {/* Submit button for placing order */}
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Place Order
            </button>
        </form>
    );
}

export default Checkout;
