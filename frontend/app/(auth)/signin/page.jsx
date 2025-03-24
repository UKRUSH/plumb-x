"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaFacebook, FaGoogle, FaMicrosoft } from "react-icons/fa";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Clear existing cookies
                document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                document.cookie = "userName=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                
                // Set new cookies
                document.cookie = `token=demo-token; path=/`;
                document.cookie = `role=${encodeURIComponent(data.role)}; path=/`;
                document.cookie = `userName=${encodeURIComponent(data.fullName)}; path=/`;
                
                // Redirect logic
                setTimeout(() => {
                    if (callbackUrl && !callbackUrl.startsWith('/signin')) {
                        router.push(callbackUrl);
                    } else {
                        const roleRedirects = {
                            inventory: '/inventory/dashboard',
                            employee: '/employees/employee_manager_dashboard',
                            delivery: '/delivery/dashboard',
                            finance: '/finance/dashboard',
                            customer: '/dashboard/orderAndCustomer',
                            admin: '/admin/dashboard'
                        };
                        router.push(roleRedirects[data.role]);
                    }
                }, 100);
            } else {
                setError(data.message || "Invalid email or password");
            }
        } catch (error) {
            console.error('Login error:', error);
            setError("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
            <div className="relative z-10 w-full max-w-md md:max-w-lg bg-gray-100 rounded-3xl shadow-2xl p-10 flex flex-col items-center transition-transform duration-300 hover:scale-105">
                <h2 className="text-4xl font-extrabold text-gray-900 text-center tracking-wide">
                    Welcome Back
                </h2>
                <p className="text-gray-500 text-sm text-center mt-2">Sign in to continue your journey</p>

                {error && (
                    <div className="w-full mt-4 p-4 text-red-500 bg-red-100 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 w-full space-y-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-[#fdc501] focus:border-[#fdc501]"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-[#fdc501] focus:border-[#fdc501]"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-[#fdc501] focus:ring-[#fdc501] border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <Link href="/reset" className="text-sm font-medium text-[#fdc501] hover:text-[#e3b101]">
                            Forgot your password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#fdc501] hover:bg-[#e3b101] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fdc501]"
                    >
                        Sign in
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-medium text-[#fdc501] hover:text-[#e3b101]">
                            Sign up
                        </Link>
                    </p>
                </div>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-100 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                        <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <FaGoogle className="text-xl" />
                        </button>
                        <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <FaFacebook className="text-xl" />
                        </button>
                        <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <FaMicrosoft className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
