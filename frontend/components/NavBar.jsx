"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { 
  AiOutlineHome, 
  AiOutlineShoppingCart, 
  AiOutlineInfoCircle, 
  AiOutlinePhone,
  AiOutlineMenu, 
  AiOutlineClose 
} from 'react-icons/ai';
import { 
  FaUserClock, 
  FaCalendarAlt, 
  FaChartBar, 
  FaFileAlt,
  FaPlus,
  FaBoxOpen,
  FaExclamationTriangle,
  FaChartPie,
  FaDollarSign,
  FaUsers
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [role, setRole] = useState(null);
    const [userName, setUserName] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Check authentication on component mount
        const checkAuth = () => {
            const cookies = document.cookie.split(';');
            const token = cookies.find(c => c.trim().startsWith('token='));
            const roleCookie = cookies.find(c => c.trim().startsWith('role='));
            
            if (!token || !roleCookie) {
                router.push('/signin');
                return;
            }
            
            const role = roleCookie.split('=')[1];
            setRole(decodeURIComponent(role));
            
            const userNameCookie = cookies.find(c => c.trim().startsWith('userName='));
            if (userNameCookie) {
                setUserName(decodeURIComponent(userNameCookie.split('=')[1]));
            }
        };

        checkAuth();
    }, [router]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Define navigation items based on role
    const getNavItems = (role) => {
        const navItems = {
            // Public routes (when not logged in)
            public: [
                { name: 'Home', href: '/homepage', icon: <AiOutlineHome className="mr-2" /> },
                { name: 'About Us', href: '/about', icon: <AiOutlineInfoCircle className="mr-2" /> },
                { name: 'Contact Us', href: '/contact', icon: <AiOutlinePhone className="mr-2" /> },
            ],
            // Customer routes
            customer: [
                { name: 'Home', href: '/dashboard/orderAndCustomer', icon: <AiOutlineHome className="mr-2" /> },
                { name: 'Products', href: '/product', icon: <AiOutlineShoppingCart className="mr-2" /> },
                { name: 'Cart', href: '/cart', icon: <AiOutlineShoppingCart className="mr-2" /> },
                { name: 'Orders', href: '/dashboard/orderAndCustomer/order', icon: <FaFileAlt className="mr-2" /> },
            ],
            // Employee routes
            employee: [
                { 
                    name: 'Dashboard', 
                    href: '/employees/employee_manager_dashboard', 
                    icon: <FaChartBar className="mr-2" /> 
                },
                { 
                    name: 'Attendance', 
                    href: '/employees/attendance_check', 
                    icon: <FaUserClock className="mr-2" /> 
                },
                { 
                    name: 'Leave Management', 
                    href: '/employees/leave_management', 
                    icon: <FaCalendarAlt className="mr-2" /> 
                },
                { 
                    name: 'View Employees', 
                    href: '/employees/view_employees', 
                    icon: <FaUsers className="mr-2" /> 
                },
                { 
                    name: 'Add Employee', 
                    href: '/employees/add_employee', 
                    icon: <FaUsers className="mr-2" /> 
                }
            ],
            // Inventory routes
            inventory: [
                { name: 'Dashboard', href: '/inventory/dashboard', icon: <FaChartBar className="mr-2" /> },
                { name: 'Manage Items', href: '/inventory/inventory_management', icon: <FaPlus className="mr-2" /> },
                { name: 'Categories', href: '/inventory/category', icon: <FaBoxOpen className="mr-2" /> },
                { name: 'Alerts', href: '/inventory/view_alerts', icon: <FaExclamationTriangle className="mr-2" /> },
                { name: 'Analytics', href: '/inventory/inventory_analytics', icon: <FaChartPie className="mr-2" /> },
            ],
            // Delivery routes
            delivery: [
                { name: 'Dashboard', href: '/delivery/dashboard', icon: <AiOutlineHome className="mr-2" /> },
                { name: 'Assign Drivers', href: '/delivery/assign_drivers', icon: <FaUserClock className="mr-2" /> },
                { name: 'Track Status', href: '/delivery/track', icon: <FaChartBar className="mr-2" /> },
                { name: 'Delivery Reports', href: '/delivery/reports', icon: <FaFileAlt className="mr-2" /> },
            ],
            // Financial routes
            finance: [
                { name: 'Dashboard', href: '/finance/dashboard', icon: <AiOutlineHome className="mr-2" /> },
                { name: 'Invoices', href: '/finance/invoices', icon: <FaFileAlt className="mr-2" /> },
                { name: 'Salary Management', href: '/finance/salary', icon: <FaDollarSign className="mr-2" /> },
                { name: 'Financial Insights', href: '/finance/insights', icon: <FaChartPie className="mr-2" /> },
            ],
        };

        return navItems[role] || navItems.public;
    };

    const navItems = getNavItems(role);

    const handleLogout = () => {
        // Clear all cookies
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        document.cookie = "userName=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        
        // Redirect to login
        router.push('/signin');
    };

    return (
        <nav className="bg-[#fdc501] shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img src="/image/logo.png" alt="Company Logo" className="h-8 w-8 mr-2" />
                        <Link href="/" className="flex items-center">
                            <span className="text-gray-800 text-xl font-bold">Plumb X</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => (
                            <Link 
                                key={item.href}
                                href={item.href}
                                className="flex items-center text-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                        {role && (
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-800 hover:text-white focus:outline-none"
                        >
                            {isOpen ? 
                                <AiOutlineClose className="h-6 w-6" /> : 
                                <AiOutlineMenu className="h-6 w-6" />
                            }
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden">
                        {navItems.map((item) => (
                            <Link 
                                key={item.href}
                                href={item.href}
                                className="flex items-center text-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                        {role && (
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center text-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar; 