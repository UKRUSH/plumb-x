import Link from "next/link";
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the dashboard page directly
  redirect('/inventory/dashboard');

  // This part won't be executed due to the redirect
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Plumbing Distribution System</h1>
        <Link 
          href="/inventory/dashboard" 
          className="inline-block px-6 py-3 bg-[#fdc501] text-white rounded-lg hover:bg-[#e3b101]"
        >
          Go to Inventory Management
        </Link>
      </div>
    </div>
  );
} 