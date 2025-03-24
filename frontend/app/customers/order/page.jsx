"use client";

import React, { useState, useEffect } from "react";

const OrderDashboard = () => {
    const [orders, setOrders] = useState([]);

    // Load orders from local storage
    useEffect(() => {
        const storedOrders = localStorage.getItem("orders");
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        }
    }, []);

    // Function to remove an order
    const removeOrder = (index) => {
        const updatedOrders = orders.filter((_, i) => i !== index);
        setOrders(updatedOrders);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen shadow-2xl">
            <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Order Dashboard</h1>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                {orders.length === 0 ? (
                    <p className="text-gray-600 text-center">No orders placed yet.</p>
                ) : (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">Image</th>
                                <th className="border border-gray-300 px-4 py-2">Product Name</th>
                                <th className="border border-gray-300 px-4 py-2">Price</th>
                                <th className="border border-gray-300 px-4 py-2">Size</th>
                                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((product, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border border-gray-300 px-4 py-2">
                                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-green-600 font-bold">LKR {product.price.toFixed(2)}</td>
                                    <td className="border border-gray-300 px-4 py-2">{product.size}</td>
                                    <td className="border border-gray-300 px-4 py-2">{product.quantity}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                            onClick={() => removeOrder(index)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default OrderDashboard;
