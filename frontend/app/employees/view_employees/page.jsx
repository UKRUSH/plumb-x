'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function ViewEmployees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('/api/employees');
            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const response = await fetch(`/api/employees/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setEmployees(employees.filter(emp => emp._id !== id));
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Employees List</h1>
                <Link 
                    href="/employees/add_employee"
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                >
                    <FaPlus className="mr-2" /> Add Employee
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Department</th>
                            <th className="px-6 py-3 text-left">Position</th>
                            <th className="px-6 py-3 text-left">Email</th>
                            <th className="px-6 py-3 text-left">Phone</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee._id} className="border-b">
                                <td className="px-6 py-4">{employee.fullName}</td>
                                <td className="px-6 py-4">{employee.department}</td>
                                <td className="px-6 py-4">{employee.position}</td>
                                <td className="px-6 py-4">{employee.email}</td>
                                <td className="px-6 py-4">{employee.phone}</td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/employees/edit_employee/${employee._id}`}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(employee._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}