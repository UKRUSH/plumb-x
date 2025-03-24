import React from 'react'

export const metadata = {
  title: 'Employee Management',
  description: 'Employee management system for Plumb-X'
}

export default function EmployeeLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-grow">
        {children}
      </main>
    </div>
  )
}