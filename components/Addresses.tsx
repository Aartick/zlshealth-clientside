/**
 * Addresses Component
 *
 * This component is a reusable form for adding or updating user addresses.
 *
 * Props:
 * - `address: Address` → An existing address object to edit, or an empty object for creating a new one.
 * - `editType: string` → Determines the mode of the form. Use `"newAddress"` to create a new address,
 *   otherwise it will update the provided `address`.
 * - `onUpdate: (updatedAddresses: Address[]) => void` → Callback triggered after a successful add/update,
 *   passing back the updated list of addresses.
 * - `onCancel: () => void` → Callback to cancel the form (e.g., closing modal or resetting state).
 *
 * Features:
 * - Handles controlled form inputs for all address fields.
 * - Supports both creating new addresses and updating existing ones.
 * - Calls backend API (`/api/users/addresses`) via `axiosClient.put` with form data.
 * - If creating a new address, it automatically removes `_id` from the payload before sending.
 * - Allows marking an address as the default (`isDefault`) with a checkbox.
 * - Includes validation for required fields and proper UI structure.
 * - Shows a loading state while submitting and disables submit button during the process.
 *
 * Usage:
 * ```tsx
 * <Addresses
 *   address={selectedAddress}
 *   editType="newAddress"
 *   onUpdate={handleAddressesUpdate}
 *   onCancel={closeForm}
 * />
 * ```
 */


"use client"

import { statesOfIndia } from '@/interfaces/user';
import { useAppDispatch } from '@/lib/hooks';
import { getMyAddress } from '@/lib/thunks/userThunks';
import { axiosClient } from '@/utils/axiosClient';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface Address {
    _id?: string;
    fullName: string;
    phone: string;
    landmark?: string;
    streetAddressHouseNo: string;
    streetAddress2?: string;
    addressType: string;
    cityTown: string;
    state: string;
    pinCode: string;
    isDefault: boolean;
}

interface AddressFormProps {
    address: Address
    editType: string;
    onCancel: () => void;
}

const Addresses: React.FC<AddressFormProps> = ({
    address,
    editType,
    onCancel,
}) => {
    const [formData, setFormData] = useState<Address>(address)
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()

    /**
      * Handles form input changes and updates `formData` state.
      *
      * @param e - The change event from the input element.
    */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" && "checked" in e.target ? e.target.checked : value
        })
    }

    /**
       * Submits the form to either add a new address or update an existing one.
       * - Removes `_id` if creating a new address.
       * - Sends request to `/api/users/addresses`.
       * - Passes updated addresses back to parent via `onUpdate`.
       *
       * @param e - The form submit event.
    */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true)

            // Clone form data to avoid mutating state directly
            const payload = { ...formData }

            // If adding a new address, remove `_id`
            if (editType === "newAddress") {
                delete payload._id;
            }

            // Send request to backend
            const res = await axiosClient.put(
                `/api/users/addresses`,
                payload
            );

            // Pass updated addresses back to parent
            await dispatch(getMyAddress())
            toast.success(res.data.result)
            onCancel() // Close the form after success
        } catch { }
        finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className=" space-y-4"
        >
            <h2 className="text-xl font-semibold">{editType === "newAddress" ? "Add" : "Update"} Address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name Input */}
                <div className="flex flex-col space-y-1.5 w-full">
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
                <div className="flex flex-col space-y-1.5 w-full">
                    <label
                        htmlFor='phone'
                        className="text-sm font-medium"
                    >
                        Mobile Number *
                    </label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="p-2.5 border border-[#CDCDCD] 
                        rounded-[6px] text-xs text-[#848484] focus:outline-none"
                        placeholder='(+91)-'
                        required
                    />
                </div>
            </div>

            {/* Street Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Street Address 1 */}
                <div className="flex flex-col space-y-1.5 w-full">
                    <label
                        htmlFor='streetAddress'
                        className="text-sm font-medium"
                    >
                        Street Address *
                    </label>
                    <input
                        type='text'
                        name='streetAddressHouseNo'
                        id='streetAddress'
                        value={formData.streetAddressHouseNo}
                        onChange={handleChange}
                        placeholder='Street Address'
                        className="p-2.5 border border-[#CDCDCD]
                        rounded-[6px] text-xs text-[#848484] focus:outline-none"
                        required
                    />
                </div>

                {/* Street Address 2 */}
                <div className="flex flex-col space-y-1.5 w-full">
                    <label
                        htmlFor='streetAddress2'
                        className="text-sm font-medium"
                    >
                        Street Address 2 (optional)
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
            </div>

            {/* Landmark */}
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
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* City */}
                <div className="flex flex-col space-y-1.5">
                    <label
                        htmlFor='city'
                        className="text-sm font-medium"
                    >
                        City / Town *
                    </label>
                    <input
                        type="text"
                        name="cityTown"
                        id="city"
                        value={formData.cityTown}
                        onChange={handleChange}
                        placeholder='City'
                        className="p-2.5 border border-[#CDCDCD] 
                        rounded-[6px] text-xs text-[#848484] focus:outline-none"
                        required
                    />
                </div>

                {/* State */}
                <div className="flex flex-col space-y-1.5">
                    <label
                        htmlFor='state'
                        className="text-sm font-medium"
                    >
                        State *
                    </label>
                    <select
                        name="state"
                        id="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="p-2.5 border border-[#CDCDCD] 
                        rounded-[6px] text-xs text-[#848484] focus:outline-none"
                        required
                    >
                        {statesOfIndia.map((state, idx) => (
                            <option key={idx} value={state}>
                                {state === "" ? "(Select Your State)" : state}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pin Code */}
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

                {/* Address Type */}
                <div className="flex flex-col space-y-1.5">
                    <label
                        htmlFor="addressType"
                        className='text-sm font-medium'
                    >
                        Address Type (Home / Work / Other)
                    </label>
                    <select
                        id="addressType"
                        name='addressType'
                        value={formData.addressType || ""}
                        onChange={handleChange}
                        className="p-2.5 border border-[#CDCDCD] 
                        rounded-[6px] text-xs text-[#848484] focus:outline-none"
                        required
                    >
                        <option value="" disabled>Select address type</option>
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            {/* Checkbox to mark address as default */}
            <label className='flex items-center space-x-2'>
                <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                />
                <span className='text-[#71BF45]'>Set as default address</span>
            </label>

            <div className="grid grid-cols-2 gap-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className='px-4 py-2 bg-[#CDCDCD] rounded-[6px] hover:opacity-90 hover:cursor-pointer'
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className='py-2 bg-[#71BF45] text-white rounded-[6px] hover:opacity-90 hover:cursor-pointer'
                >
                    {editType === "newAddress" ? "Add Address" : "Update Address"}
                </button>
            </div>
        </form>
    )
}

export default Addresses