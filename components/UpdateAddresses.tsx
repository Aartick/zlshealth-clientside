"use client"

import { axiosClient } from '@/utils/axiosClient';
import React, { useState } from 'react'

interface Address {
    _id: string;
    fullName: string;
    phone: string;
    landmark?: string;
    houseNo: string;
    streetAddress: string;
    streetAddress2?: string;
    addressType?: string;
    city: string;
    district: string;
    state: string;
    pinCode: string;
    isDefault: boolean;
}

interface EditAddressProps {
    address: Address;
    onUpdate: (updatedAddress: Address) => void;
    onCancel: () => void;
}

const UpdateAddresses: React.FC<EditAddressProps> = ({
    address,
    onUpdate,
    onCancel,
}) => {
    const [formData, setFormData] = useState<Address>(address)
    const [loading, setLoading] = useState(false)

    // Update form state
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    // Submit updated address
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true)
            const res = await axiosClient.put(
                `/api/users/addresses/${formData._id}`,
                formData
            );
            onUpdate(res.data.updatedAddress)
        } catch { }
        finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4"
        >
            <h2 className="text-xl font-semibold">Edit Address</h2>

            {/* Full Name Input */}
            <div className="flex flex-col space-y-1.5">
                <label
                    htmlFor='fullName'
                    className="text-sm font-medium"
                >
                    Full Name *
                </label>
                <input
                    type="text"
                    name="fullName"
                    id='fullName'
                    value={formData.fullName}
                    onChange={handleChange}
                    className="p-2.5 border border-[#CDCDCD]
                    rounded-[6px] text-xs text-[#848484] focus:outline-none"
                    placeholder='Enter Full Name'
                    required
                />
            </div>

            {/* Mobile Number Input */}
            <div className="flex flex-col space-y-1.5">
                <label
                    htmlFor='mobileNumber'
                    className="text-sm font-medium"
                >
                    Mobile Number *
                </label>
                <input
                    type="text"
                    name="mobileNumber"
                    id="mobileNumber"
                    value={formData.phone}
                    onChange={handleChange}
                    className="p-2.5 border border-[#CDCDCD] 
                    rounded-[6px] text-xs text-[#848484] focus:outline-none"
                    placeholder='(+91)-'
                    required
                />
            </div>

            <div className="flex flex-col space-y-1.5">
                <label
                    htmlFor='houseNo'
                    className="text-sm font-medium"
                >
                    House Number *
                </label>
                <input
                    type="text"
                    name='houseNo'
                    id='houseNo'
                    value={formData.houseNo}
                    onChange={handleChange}
                    placeholder='House No.'
                    className="p-2.5 border border-[#CDCDCD]
                    rounded-[6px] text-xs text-[#848484] focus:outline-none"
                    required
                />
            </div>

            <div className="flex flex-col space-y-1.5">
                <label
                    htmlFor='streetAddress'
                    className="text-sm font-medium"
                >
                    Street Address *
                </label>
                <input
                    type='text'
                    name='streetAddress'
                    id='streetAddress'
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder='Street Address'
                    className="p-2.5 border border-[#CDCDCD]
                    rounded-[6px] text-xs text-[#848484] focus:outline-none"
                    required
                />
            </div>

            <div className="flex flex-col space-y-1.5">
                <label
                    htmlFor='streetAddress2'
                    className="text-sm font-medium"
                >
                    Street Address 2 *
                </label>
                <input
                    type="text"
                    name="streetAddress2"
                    id="streetAddress2"
                    value={formData.streetAddress2 || ""}
                    onChange={handleChange}
                    placeholder='Street Address 2'
                    className="p-2.5 border border-[#CDCDCD] 
                        rounded-[6px] text-xs text-[#848484] focus:outline-none"
                />
            </div>

            <div className="flex flex-col space-y-1.5">
                <label
                    htmlFor='landmark'
                    className="text-sm font-medium"
                >
                    Landmark *
                </label>
                <input
                    type="text"
                    name="landmark"
                    id="landmark"
                    value={formData.landmark || ""}
                    onChange={handleChange}
                    placeholder='Landmark'
                    className="p-2.5 border border-[#CDCDCD] 
                        rounded-[6px] text-xs text-[#848484] focus:outline-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col space-y-1.5">
                    <label
                        htmlFor='city'
                        className="text-sm font-medium"
                    >
                        City *
                    </label>
                    <input
                        type="text"
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder='City'
                        className="p-2.5 border border-[#CDCDCD] 
                        rounded-[6px] text-xs text-[#848484] focus:outline-none"
                        required
                    />
                </div>

                <div className="flex flex-col space-y-1.5">
                    <label
                        htmlFor='district'
                        className="text-sm font-medium"
                    >
                        District *
                    </label>
                    <input
                        type="text"
                        name="district"
                        id="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder='District'
                        className="p-2.5 border border-[#CDCDCD] 
                        rounded-[6px] text-xs text-[#848484] focus:outline-none"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col space-y-1.5">
                    <label
                        htmlFor='state'
                        className="text-sm font-medium"
                    >
                        State *
                    </label>
                    <input
                        type="text"
                        name="state"
                        id="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder='State'
                        className="p-2.5 border border-[#CDCDCD] 
                        rounded-[6px] text-xs text-[#848484] focus:outline-none"
                        required
                    />
                </div>

                <div className="flex flex-col space-y-1.5">
                    <label
                        htmlFor='pinCode'
                        className="text-sm font-medium"
                    >
                        Pin Code *
                    </label>
                    <input
                        type="text"
                        name="pinCode"
                        id="pinCode"
                        value={formData.pinCode}
                        onChange={handleChange}
                        placeholder='Pincode'
                        className="p-2.5 border border-[#CDCDCD] 
                        rounded-[6px] text-xs text-[#848484] focus:outline-none"
                        required
                    />
                </div>
            </div>

            <label className='flex items-center space-x-2'>
                <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                />
                <span>Set as default address</span>
            </label>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={onCancel}
                    className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                >
                    {loading ? "Updating..." : "Update"}
                </button>
            </div>
        </form>
    )
}

export default UpdateAddresses