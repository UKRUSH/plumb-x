import { 
    FaUserClock, 
    FaCalendarAlt, 
    FaChartBar, 
    FaUsers, 
    FaFileAlt 
} from 'react-icons/fa';

export const employeeRoutes = [
    {
        path: '/employees/employee_manager_dashboard',
        label: 'Dashboard',
        icon: FaChartBar
    },
    {
        path: '/employees/attendance_check',
        label: 'Attendance',
        icon: FaUserClock
    },
    {
        path: '/employees/leave_management',
        label: 'Leave Management',
        icon: FaCalendarAlt
    },
    {
        path: '/employees/view_employees',
        label: 'View Employees',
        icon: FaUsers
    },
    {
        path: '/employees/add_employee',
        label: 'Add Employee',
        icon: FaUsers
    }
];
