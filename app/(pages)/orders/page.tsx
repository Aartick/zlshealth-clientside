/**
 * Orders Page
 * 
 * This component displays a list of user orders.
 * It fetches orders from the backend and shows product details, order status, and payment status.
 * Users can cancel an order, which updates the backend and refreshes the list.
 */

// Import required modules and components
"use client"
import { axiosClient } from '@/utils/axiosClient'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// Product interface defines the structure of each product in an order
interface product {
    _id: string,
    name: string,
    price: string,
    imgUrl: string,
    quantity: number,
    totalAmount: number
}

// Orders interface defines the structure of an order
interface orders {
    _id: string,
    customerId: string,
    products: product[],
    orderStatus: string,
    paymentStatus: string,
    paymentMethod: string,
}

function Page() {
    // State to hold all orders
    const [orders, setOrders] = useState<orders[]>([])

    // Fetch orders when component mounts
    useEffect(() => {
        getOrders()
    }, [])

    // Function to fetch orders from backend
    const getOrders = async () => {
        try {
            const response = await axiosClient.get("/api/orders")
            console.log("orders", response.data.result)
            setOrders(response.data.result)
        } catch { }
    }

    // Function to cancel an order and refresh the list
    const handleCancel = async (id: string) => {
        try {
            const response = await axiosClient.put(`/api/orders?id=${id}`)
            toast.success(response.data.result)
            getOrders()
        } catch { }
    }

    return (
        <div className='flex flex-col gap-4 items-center'>
            {/* Render each order */}
            {
                orders.map((data) => (
                    <div key={data._id} className='flex items-center gap-2'>
                        {/* Render each product in the order */}
                        {data.products.map((pro) => (
                            <div key={pro._id} className='flex gap-2 items-center'>
                                {/* Product image */}
                                <div className="relative size-[100px]">
                                    <Image
                                        src={pro.imgUrl}
                                        alt={pro.name}
                                        fill
                                        className='rounded'
                                    />
                                </div>
                                {/* Product details */}
                                <div className="flex flex-col items-center gap-4">
                                    <p>Name: {pro.name}</p>
                                    <p>Price: {pro.price}</p>
                                    <p>Quantity: {pro.quantity}</p>
                                    <p>Total: {pro.totalAmount}</p>
                                </div>
                            </div>
                        ))}
                        {/* Order and payment status */}
                        <p>Order Status: {data.orderStatus}</p>
                        <p>Payment Status: {data.paymentStatus}</p>

                        {/* Cancel order button */}
                        <button
                            onClick={() => handleCancel(data._id)}
                            className='bg-red-500 text-white font-semibold px-1 py-2 rounded cursor-pointer'
                        >CANCEL</button>
                    </div>
                ))
            }
        </div>
    )
}

export default Page