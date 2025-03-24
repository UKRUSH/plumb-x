import { redirect } from 'next/navigation';

export default function EmployeesMainPage() {
  // Redirect to the dashboard page directly
  redirect('/employees/employee_manager_dashboard');
} 