"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("✅ Password reset link sent to your email.");

    // Redirect to Login after 3 seconds
    setTimeout(() => router.push("/login"), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white ">
      <div className="max-w-md w-full  bg-gray-100  rounded-3xl shadow-2xl p-10 flex flex-col items-center transition-transform duration-300 hover:scale-105">
        <h2 className="text-2xl font-extrabold mb-10 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-9">
            <label className="font-semibold text-gray-700 mb-2" htmlFor="email ">
              Email Address
              
              
            </label>
            
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          {message && <p className="text-green-600 mb-10 text-center">{message}</p>}
          <button
  type="submit"
  className="w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-yellow-400 to-black hover:from-yellow-500 hover:to-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 shadow-md"
>
  Reset Password
</button>

        </form>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-indigo-600 font-semibold hover:text-blue-600">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
