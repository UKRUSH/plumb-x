"use client";

import { useState } from "react";
import { FaUserCheck, FaClock, FaCalendarAlt, FaSearch, FaDownload, FaFileCsv } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";

export default function AttendanceCheck() {
  // Sample data - in a real app, this would come from an API or database
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      employeeName: "John Doe",
      checkIn: "09:00 AM",
      checkOut: "05:30 PM",
      date: "2023-11-20",
      status: "Present",
    },
    {
      id: 2,
      employeeName: "Jane Smith",
      checkIn: "08:45 AM",
      checkOut: "05:15 PM",
      date: "2023-11-20",
      status: "Present",
    },
    {
      id: 3,
      employeeName: "Robert Johnson",
      checkIn: "09:10 AM",
      checkOut: "06:00 PM",
      date: "2023-11-20",
      status: "Present",
    },
    {
      id: 4,
      employeeName: "Emily Davis",
      checkIn: "Late",
      checkOut: "04:00 PM",
      date: "2023-11-20",
      status: "Late",
    },
    {
      id: 5,
      employeeName: "Michael Wilson",
      checkIn: "-",
      checkOut: "-",
      date: "2023-11-20",
      status: "Absent",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  // Filter function for search
  const filteredData = attendanceData.filter((item) =>
    item.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to generate CSV content from data
  const generateCsvContent = (data) => {
    // CSV header row
    const headers = ["Employee Name", "Check In", "Check Out", "Date", "Status"];
    
    // Convert data to CSV rows
    const csvRows = data.map((item) => {
      return [
        item.employeeName,
        item.checkIn,
        item.checkOut,
        item.date,
        item.status
      ].join(",");
    });
    
    // Combine header and rows
    return [headers.join(","), ...csvRows].join("\n");
  };
  
  // Function to handle CSV download
  const handleDownloadCsv = () => {
    try {
      setIsDownloading(true);
      
      // Generate CSV content
      const csvContent = generateCsvContent(attendanceData);
      
      // Create a Blob with the CSV data
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const link = document.createElement("a");
      const date = new Date().toISOString().split("T")[0];
      link.href = url;
      link.setAttribute("download", `attendance_data_${date}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Reset download state after a short delay
      setTimeout(() => {
        setIsDownloading(false);
      }, 1000);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      setIsDownloading(false);
      alert("Failed to download CSV file. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#fdc501] p-4 md:p-6 flex flex-wrap justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black flex items-center gap-2">
              <FaUserCheck className="inline-block" /> Employee Attendance
            </h1>
            <p className="text-black mt-2 flex items-center gap-2">
              <FaCalendarAlt className="inline-block" /> 
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={handleDownloadCsv}
            disabled={isDownloading}
            className={`mt-3 md:mt-0 flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all ${
              isDownloading ? "opacity-70 cursor-wait" : "hover:shadow-md"
            }`}
          >
            {isDownloading ? (
              <>
                <FaDownload className="animate-pulse" /> Downloading...
              </>
            ) : (
              <>
                <FaFileCsv /> Download CSV
              </>
            )}
          </button>
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
                  <div className="flex items-center gap-1">
                    <BiTimeFive /> Check In
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <BiTimeFive /> Check Out
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt /> Date
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{employee.employeeName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{employee.checkIn}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{employee.checkOut}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{employee.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                          employee.status === "Present"
                            ? "bg-green-100 text-green-800"
                            : employee.status === "Late"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {employee.status === "Present" ? (
                          <IoMdCheckmarkCircleOutline className="mr-1 self-center" />
                        ) : employee.status === "Late" ? (
                          <FaClock className="mr-1 self-center" />
                        ) : (
                          <MdOutlineCancel className="mr-1 self-center" />
                        )}
                        {employee.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No matching employees found
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
                <IoMdCheckmarkCircleOutline className="text-xl" />
              </div>
              <div>
                <p className="text-xs  text-black">Present</p>
                <p className="font-semibold  text-black">{attendanceData.filter(e => e.status === "Present").length}</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2">
              <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                <FaClock className="text-xl" />
              </div>
              <div>
                <p className="text-xs t text-black">Late</p>
                <p className="font-semibold  text-black">{attendanceData.filter(e => e.status === "Late").length}</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-full text-red-600">
                <MdOutlineCancel className="text-xl" />
              </div>
              <div>
                <p className="text-xs  text-black">Absent</p>
                <p className="font-semibold  text-black">{attendanceData.filter(e => e.status === "Absent").length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSV Information Panel */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex items-start">
          <FaFileCsv className="text-green-600 text-xl mt-1 mr-3" />
          <div>
            <h3 className="font-bold text-lg text-gray-800">CSV Export</h3>
            <p className="text-gray-600 mt-1">
              Download attendance data as a CSV file that can be opened in Excel, Google Sheets, or other 
              spreadsheet applications for further analysis and reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}