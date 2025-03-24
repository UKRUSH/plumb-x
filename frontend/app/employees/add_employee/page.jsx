'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiDollarSign, FiCalendar } from 'react-icons/fi';

export default function AddEmployee() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        salary: '',
        joiningDate: '',
        isFullTime: true
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales'];
    const positions = ['Manager', 'Director', 'Developer', 'Analyst', 'Specialist', 'Assistant'];

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
        
        if (!formData.joiningDate) {
            tempErrors.joiningDate = 'Joining date is required';
            isValid = false;
        }
        
        setErrors(tempErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            try {
                const response = await fetch('/api/employees', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        salary: Number(formData.salary),
                        joiningDate: new Date(formData.joiningDate).toISOString()
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to add employee');
                }

                router.push('/employees/view_employees');
            } catch (error) {
                console.error('Error:', error);
                setErrors(prev => ({
                    ...prev,
                    submit: error.message
                }));
            } finally {
                setLoading(false);
            }
        }
    };
   
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Add New Employee</h1>
            
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Department</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1">Position</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Salary</label>
                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Joining Date</label>
                            <input
                                type="date"
                                name="joiningDate"
                                value={formData.joiningDate}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isFullTime"
                            checked={formData.isFullTime}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label>Full-time Employee</label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        {loading ? 'Adding...' : 'Add Employee'}
                    </button>
                </div>
            </form>

            {errors.submit && (
                <div className="text-red-500 text-sm mt-2">
                    {errors.submit}
                </div>
            )}
        </div>
    );
}
