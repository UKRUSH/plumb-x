'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function EditEmployee() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

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

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    
    const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales'];

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const response = await fetch(`/api/employees/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch employee');
            }
            const data = await response.json();
            setFormData({
                ...data,
                joiningDate: data.joiningDate ? new Date(data.joiningDate).toISOString().split('T')[0] : ''
            });
        } catch (error) {
            console.error('Error fetching employee:', error);
            setErrors(prev => ({
                ...prev,
                fetch: error.message
            }));
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
                const response = await fetch(`/api/employees/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error('Failed to update employee');
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

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Edit Employee</h1>
            
            {errors.fetch ? (
                <div className="text-red-500 text-center">
                    {errors.fetch}
                </div>
            ) : (
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
                            {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName}</span>}
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
                                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
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
                                {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
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
                                {errors.department && <span className="text-red-500 text-sm">{errors.department}</span>}
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
                                {errors.position && <span className="text-red-500 text-sm">{errors.position}</span>}
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
                                {errors.salary && <span className="text-red-500 text-sm">{errors.salary}</span>}
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
                                {errors.joiningDate && <span className="text-red-500 text-sm">{errors.joiningDate}</span>}
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
                            disabled={loading}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {loading ? 'Updating...' : 'Update Employee'}
                        </button>

                        {errors.submit && (
                            <div className="text-red-500 text-sm mt-2">
                                {errors.submit}
                            </div>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
} 