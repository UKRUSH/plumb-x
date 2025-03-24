'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaUserClock, FaClock, FaCalendarAlt, FaChartBar, FaUsers, FaFileAlt, FaBell, FaSearch } from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { employeeRoutes } from '../routes';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function EmployeeDashboard() {
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const [searchQuery, setSearchQuery] = useState('');
        const [notifications, setNotifications] = useState([]);
        const [activeTab, setActiveTab] = useState('overview');
        const [animateCharts, setAnimateCharts] = useState(false);
        
        // Trigger chart animations after component mounts
        useEffect(() => {
            setTimeout(() => setAnimateCharts(true), 300);
        }, []);

        const [attendanceData, setAttendanceData] = useState({
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                        label: 'Attendance Rate',
                        data: [95, 93, 97, 94, 96, 92, 98],
                        borderColor: '#fdc501',
                        tension: 0.4,
                }]
        });

        useEffect(() => {
                const interval = setInterval(() => {
                        setAttendanceData(prevData => ({
                                ...prevData,
                                datasets: [{
                                        ...prevData.datasets[0],
                                        data: Array(7).fill().map(() => 
                                                Math.floor(Math.random() * (100 - 90) + 90)
                                        )
                                }]
                        }));
                }, 6000);
                return () => clearInterval(interval);
        }, []);

        const [departmentData, setDepartmentData] = useState({
                labels: ['Delivery', 'Employee', 'Finance', 'Inventory', 'Customer and Order'],
                datasets: [{
                        data: [10, 20, 15, 25, 10],
                        backgroundColor: ['#fdc501', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
                }]
        });

        useEffect(() => {
                const interval = setInterval(() => {
                        setDepartmentData(prevData => ({
                                ...prevData,
                                datasets: [{
                                        ...prevData.datasets[0],
                                        data: prevData.datasets[0].data.map(() => 
                                                Math.floor(Math.random() * 30) + 5
                                        )
                                }]
                        }));
                }, 6000);
                return () => clearInterval(interval);
        }, []);

        const menuItems = [
                { href: '/attendance_check', label: 'Attendance Check', icon: FaUserClock },
                { href: '/ot', label: 'Overtime Hours', icon: FaClock },
                { href: '/leave_management', label: 'Leave Management', icon: FaCalendarAlt },
                { href: '/performance', label: 'Performance', icon: FaChartBar },
                { href: '/reports', label: 'Reports', icon: FaFileAlt },
        ];

        const recentActivities = [
                { id: 1, user: 'John Doe', action: 'Clocked In', time: '08:00 AM' },
                { id: 2, user: 'Jane Smith', action: 'Requested Leave', time: '09:15 AM' },
                { id: 3, user: 'Mike Johnson', action: 'Submitted Report', time: '10:30 AM' },
        ];

        return (
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                {/* Quick Access Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {employeeRoutes.map((route, index) => (
                                                <Link
                                                        key={route.path}
                                                        href={route.path}
                                                        className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md 
                                                                 transition-all duration-300
                                                                 hover:border-[#fdc501] hover:scale-105 hover:shadow-lg hover:rotate-1
                                                                 animate-fadeIn"
                                                        style={{ animationDelay: `${600 + index * 150}ms`, animationFillMode: 'forwards' }}
                                                >
                                                        <div className="flex items-center mb-4">
                                                                <route.icon className="text-2xl text-[#fdc501] mr-3 transform transition-transform hover:scale-125 hover:rotate-12" />
                                                                <h2 className="text-xl font-bold text-gray-800">{route.label}</h2>
                                                        </div>
                                                        <p className="text-gray-600">Manage and view {route.label.toLowerCase()} details</p>
                                                </Link>
                                        ))}
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 opacity-0 animate-fadeIn" 
                                     style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                                </div>

                                {/* Charts Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className={`bg-white p-6 rounded-lg shadow-md transform transition-all duration-500 ${animateCharts ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                                <h3 className="text-lg font-semibold mb-4 text-black">Weekly Attendance</h3>
                                                <Line data={attendanceData} options={{ 
                                                    responsive: true,
                                                    animation: {
                                                        duration: 2000,
                                                        easing: 'easeOutQuart'
                                                    }
                                                }} />
                                        </div>
                                        <div className={`bg-white p-6 rounded-lg shadow-md transform transition-all duration-500 ${animateCharts ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} 
                                             style={{ transitionDelay: '200ms' }}>
                                                <h3 className="text-lg font-semibold mb-1 text-black">Department Attendance</h3>
                                                <Doughnut data={departmentData} options={{ 
                                                    responsive: true,
                                                    animation: {
                                                        duration: 2000,
                                                        easing: 'easeOutQuart'
                                                    }
                                                }} />
                                        </div>
                                </div>
                        </main>
                </div>
        );
}
