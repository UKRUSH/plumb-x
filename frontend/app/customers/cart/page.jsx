"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CartPage = () => {
    const router = useRouter();
    const [cartItems, setCartItems] = useState([]);

    // Load cart items from local storage
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    // Function to update quantity
    const updateQuantity = (id, newQuantity) => {
        const updatedCart = cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Function to remove an item from the cart
    const removeFromCart = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Calculate total price
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Checkout function: Move cart to orders and clear cart
    const handleCheckout = () => {
        if (cartItems.length === 0) return;

        // Save orders in localStorage
        const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
        localStorage.setItem("orders", JSON.stringify([...existingOrders, ...cartItems]));

        // Clear cart
        localStorage.removeItem("cart");
        setCartItems([]);

        // Redirect to Order Dashboard
        router.push("/order-dashboard");
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center">Your cart is empty</p>
            ) : (
                <div className="space-y-4">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-white p-4 shadow-lg rounded">
                            <div>
                                <h2 className="font-semibold text-lg">{item.name}</h2>
                                <p className="text-gray-700">Price: LKR {item.price.toFixed(2)}</p>
                                <p className="text-gray-700">Size: {item.size}</p>

                                {/* Quantity Selector */}
                                <label className="block mt-2">
                                    Quantity:
                                    <select
                                        className="ml-2 border rounded px-2 py-1"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                    >
                                        {[...Array(10).keys()].map(q => (
                                            <option key={q + 1} value={q + 1}>{q + 1}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            {/* Remove Button */}
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    
                    {/* Cart Total */}
                    <div className="mt-8 border-t pt-4 text-right">
                        <p className="text-xl font-bold">Total: LKR {calculateTotal().toFixed(2)}</p>
                        <button
                            className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-yellow-500"
                            onClick={() => router.push("/order")}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;


