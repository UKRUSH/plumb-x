"use client";

import { useState } from "react";
import Link from "next/link";
import { FaFacebook, FaGoogle, FaMicrosoft } from "react-icons/fa";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Form submitted:", formData);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
        <div className="relative z-10 w-full max-w-md md:max-w-lg bg-gray-100 rounded-3xl shadow-2xl p-10 flex flex-col items-center transition-transform duration-300 hover:scale-105">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center tracking-wide">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm text-center mt-2">Join us to start your journey</p>

          <form onSubmit={handleSubmit} className="mt-8 w-full space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-gray-700 font-semibold">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 font-semibold">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="w-full py-3 px-45 text-white font-semibold rounded-lg bg-gradient-to-r from-yellow-400 to-black hover:from-yellow-500 hover:to-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 shadow-md"
              >
                Register
              </button>
            </div>
          </form>

          <p className="mt-6 text-gray-600 text-sm">Or Register Using</p>
          <div className="flex justify-center space-x-10 mt-5">
            <button className="bg-blue-600 text-white rounded-full p-3 flex items-center justify-center w-12 h-12 shadow-md hover:bg-blue-700">
              <FaFacebook className="w-6 h-6" />
            </button>
            <button className="bg-gray-800 text-white rounded-full p-3 flex items-center justify-center w-12 h-12 shadow-md hover:bg-gray-900">
              <FaMicrosoft className="w-5 h-5" />
            </button>
            <button className="bg-red-500 text-white rounded-full p-3 flex items-center justify-center w-12 h-12 shadow-md hover:bg-red-600">
              <FaGoogle className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-6 text-gray-600 text-sm">
            Already have an account?{" "}
            <Link 
              href="/signin"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
