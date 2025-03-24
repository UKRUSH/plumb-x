"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ProductPage = () => {
    const router = useRouter();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        let updatedCart;

        if (existingItem) {
            updatedCart = cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            updatedCart = [...cart, { ...product, quantity: 1 }];
        }

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        alert(`${product.name} added to cart!`);
    };

    const products = [
        { id: 1, name: "Phoenix PVC Pressure Pipes", price: 850.00, size: "20mm-200mm", image: "/download.jpeg" },
        { id: 2, name: "Anton uPVC Pressure Pipes", price: 1340.00, size: "20mm-200mm", image: "/th (1).jpeg" },
        { id: 3, name: "National PVC Pressure Pipes", price: 8999.99, size: "20mm-200mm", image: "/OIP (8).jpeg" },
        { id: 4, name: "S-Lon PVC Pressure Pipes", price: 2764.80, size: "20mm-200mm", image: "/OIP.jpeg" },
        { id: 5, name: "Anton Down Pipe 3 1/2", price: 2150.00, size: "20mm-200mm", image: "/th (2).jpeg" },
        { id: 6, name: "Anto HDPE Pipes", price: 5400.90, size: "20mm-200mm", image: "/OIP (7).jpeg" },
    ];

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen shadow-2xl">
            <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Our Products</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105">
                        <img src={product.image} alt={product.name} className="w-full h-56 object-cover rounded-md mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-800">{product.name}</h2>
                        <p className="text-gray-700 text-lg mt-2">Size: {product.size}</p>
                        <p className="text-green-600 text-xl font-bold mt-3">LKR {product.price.toFixed(2)}</p>

                        <button
                            className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            {/* Button to go to Cart */}
            <div className="flex justify-center mt-10">
                <button
                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                    onClick={() => router.push("/dashboard/orderAndCustomer/cart")}
                >
                    View Cart
                </button>
            </div>
        </div>
    );
};

export default ProductPage;
