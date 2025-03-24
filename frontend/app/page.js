import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  const role = cookieStore.get('role');

  // If not logged in, redirect to signin
  if (!token || !role) {
    redirect('/signin');
  }

  // If logged in, redirect to role-specific dashboard
  const roleRedirects = {
    inventory: '/inventory/dashboard',
    employee: '/employees/employee_manager_dashboard',
    delivery: '/delivery/dashboard',
    finance: '/finance/dashboard',
    customer: '/dashboard/orderAndCustomer'
  };

  redirect(roleRedirects[role.value] || '/signin');
}
