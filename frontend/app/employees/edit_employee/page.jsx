"use client";

import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiDollarSign, FiCalendar } from 'react-icons/fi';
    
export default function EmployeeForm({ employeeId }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        salary: '',
        startDate: '',
        isFullTime: false
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales'];
    const positions = ['Manager', 'Director', 'Developer', 'Analyst', 'Specialist', 'Assistant'];

    useEffect(() => {
        if (employeeId) {
            fetchEmployeeData();
        }
    }, [employeeId]);

    const fetchEmployeeData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/employees/${employeeId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch employee data");
            }
            const data = await response.json();
            setFormData(data);
        } catch (error) {
            toast.error("Error fetching employee data");
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!formData.fullName.trim()) {
            tempErrors.fullName = 'Name is required';
            isValid = false;
        }

        if (!formData.email.trim()) {
            tempErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            tempErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!formData.phone.trim()) {
            tempErrors.phone = 'Phone is required';
            isValid = false;
        }

        if (!formData.department) {
            tempErrors.department = 'Department is required';
            isValid = false;
        }

        if (!formData.position) {
            tempErrors.position = 'Position is required';
            isValid = false;
        }

        if (!formData.salary) {
            tempErrors.salary = 'Salary is required';
            isValid = false;
        }

        if (!formData.startDate) {
            tempErrors.startDate = 'Start date is required';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const method = employeeId ? "PUT" : "POST";
            const url = employeeId ? `/api/employees/${employeeId}` : "/api/employees";

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to submit employee data");

            toast.success(`Employee ${employeeId ? "updated" : "added"} successfully!`);

            setFormData({
                fullName: '',
                email: '',
                phone: '',
                department: '',
                position: '',
                salary: '',
                startDate: '',
                isFullTime: false
            });

        } catch (error) {
            toast.error("Error saving employee data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">
                {employeeId ? "Edit Employee" : " Edit Employee"}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Employee Information</h2>

                    <div className="flex flex-col space-y-1">
                        <input type="text" name="fullName" placeholder="Full Name"
                            className={`w-full p-2 border rounded-lg ${errors.fullName ? 'border-red-500' : ''}`}
                            value={formData.fullName} onChange={handleInputChange}
                        />
                        {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName}</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="email" name="email" placeholder="Email"
                            className={`w-full p-2 border rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                            value={formData.email} onChange={handleInputChange}
                        />
                        <input type="tel" name="phone" placeholder="Phone"
                            className={`w-full p-2 border rounded-lg ${errors.phone ? 'border-red-500' : ''}`}
                            value={formData.phone} onChange={handleInputChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select name="department" className="w-full p-2 border rounded-lg"
                            value={formData.department} onChange={handleInputChange}>
                            <option value="">Select Department</option>
                            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                        </select>

                        <select name="position" className="w-full p-2 border rounded-lg"
                            value={formData.position} onChange={handleInputChange}>
                            <option value="">Select Position</option>
                            {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                        </select>
                    </div>

                    <input type="number" name="salary" placeholder="Salary"
                        className={`w-full p-2 border rounded-lg ${errors.salary ? 'border-red-500' : ''}`}
                        value={formData.salary} onChange={handleInputChange}
                    />

                    <input type="date" name="startDate" placeholder="Start Date"
                        className={`w-full p-2 border rounded-lg ${errors.startDate ? 'border-red-500' : ''}`}
                        value={formData.startDate} onChange={handleInputChange}
                    />

                    <div className="mt-8 flex justify-center">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
                            disabled={loading}>
                            {loading ? 'Saving...' : employeeId ? "Update Employee" : "Update Employee"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}