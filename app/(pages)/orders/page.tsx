"use client"
import { axiosClient } from '@/utils/axiosClient'
import { div } from 'framer-motion/client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface product {
    _id: string,
    name: string,
    price: string,
    imgUrl: string,
    quantity: number,
    totalAmount: number
}

interface orders {
    _id: string,
    customerId: string,
    products: product[],
    orderStatus: string,
    paymentStatus: string,
    paymentMethod: string,
}

function page() {
    const [orders, setOrders] = useState<orders[]>([])

    useEffect(() => {
        getOrders()
    }, [])

    const getOrders = async () => {
        try {
            const response = await axiosClient.get("/api/orders")
            console.log("orders", response.data.result)
            setOrders(response.data.result)
        } catch (e) { }
    }

    const handleCancel = async (id: string) => {
        try {
            const response = await axiosClient.put(`/api/orders?id=${id}`)
            toast.success(response.data.result)
            getOrders()
        } catch (e) { }
    }
    return (
        <div className='flex flex-col gap-4 items-center'>
            {
                orders.map((data) => (
                    <div key={data._id} className='flex items-center gap-2'>
                        {data.products.map((pro) => (
                            <div key={pro._id} className='flex gap-2 items-center'>
                                <div className="relative size-[100px]">
                                    <Image
                                        src={pro.imgUrl}
                                        alt={pro.name}
                                        fill
                                        className='rounded'
                                    />
                                </div>
                                <div className="flex flex-col items-center gap-4">
                                    <p>Name: {pro.name}</p>
                                    <p>Price: {pro.price}</p>
                                    <p>Quantity: {pro.quantity}</p>
                                    <p>Total: {pro.totalAmount}</p>
                                </div>
                            </div>
                        ))}
                        <p>Order Status: {data.orderStatus}</p>
                        <p>Payment Status: {data.paymentStatus}</p>

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

export default page