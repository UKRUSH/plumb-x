"use client";

import { useState } from "react";
import { FaSearch, FaCalendarAlt, FaCheck, FaTimes, FaEye } from "react-icons/fa";

export default function LeaveManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data for leave requests
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: 'John Doe', date: '2024-01-15', description: 'Vacation', status: 'approved', type: 'vacation' },
    { id: 2, name: 'Jane Smith', date: '2024-01-18', description: 'Sick Leave', status: 'pending', type: 'sick' },
    { id: 3, name: 'Mike Johnson', date: '2024-01-20', description: 'Personal Leave', status: 'rejected', type: 'personal' },
  ]);

  // Filter function for search
  const filteredRequests = leaveRequests.filter((request) =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#fdc501] p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-black flex items-center gap-2">
            <FaCalendarAlt className="inline-block" /> Leave Management
          </h1>
          <p className="text-black mt-2">
            Manage employee leave requests
          </p>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-white border-b">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search employee..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdc501]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{request.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{request.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 capitalize">{request.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{request.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No matching leave requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <FaCheck className="text-xl" />
              </div>
              <div>
                <p className="text-xs  text-black">Approved</p>
                <p className="font-semibold  text-black">{leaveRequests.filter(r => r.status === "approved").length}</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2">
              <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                <FaCalendarAlt className="text-xl" />
              </div>
              <div>
                <p className="text-xs  text-black">Pending</p>
                <p className="font-semibold  text-black">{leaveRequests.filter(r => r.status === "pending").length}</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-full text-red-600">
                <FaTimes className="text-xl" />
              </div>
              <div>
                <p className="text-xs text-black">Rejected</p>
                <p className="font-semibold  text-black">{leaveRequests.filter(r => r.status === "rejected").length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}