'use client';

import React from 'react';
import Link from 'next/link';
import { FaWrench, FaHome, FaPhoneAlt, FaInfoCircle, FaTools, FaUserTie } from 'react-icons/fa';
import { MdPlumbing, MdWaterDrop, MdEngineering } from 'react-icons/md';

export default function Homepage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-black to-gray-900 text-white py-20">
                <div className="container mx-auto text-center px-4">
                    <h1 className="text-5xl font-bold mb-6">Professional Plumbing Solutions</h1>
                    <p className="text-xl mb-10 max-w-3xl mx-auto">
                        Expert plumbing services for your home and business. Quality work, fair prices, and exceptional service.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-[#fdc501] text-black px-8 py-3 rounded-md font-bold hover:bg-opacity-90">
                            Our Services
                        </button>
                        <button className="border-2 border-[#fdc501] text-white px-8 py-3 rounded-md font-bold hover:bg-[#fdc501] hover:text-black">
                            Contact Us
                        </button>
                    </div>
                </div>
            </section>
            {/* ... rest of your homepage content ... */}
        </div>
    );
} 