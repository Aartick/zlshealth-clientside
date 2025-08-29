"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { axiosClient } from "@/utils/axiosClient";
import toast from "react-hot-toast";
import { useAppSelector } from "@/lib/hooks";

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

    const [loading, setLoading] = useState<boolean>(false);

    const cart = useAppSelector((state) => state.cartSlice.cart) || []

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true)
                const res = await axiosClient.get("/api/users?type=me");
                if (res.data.result) {
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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axiosClient.put("/api/users", formData);
            toast.success(res.data.result)
            const orderResponse = await axiosClient.post("/api/orders", { cart })
            toast.success(orderResponse.data.result)
        } catch (err) { }
    };

    if (loading) return <p className="text-center my-center text-xl font-semibold">Loading...</p>;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-lg mx-auto p-4 my-10 border rounded"
        >
            <p className="font-semibold text-xl">BILLING DETAILS</p>

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
                    <label htmlFor={id}>{label}</label>
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
