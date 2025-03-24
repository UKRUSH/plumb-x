import React from 'react'

import NavBar from './components/CUNavBar'

export const metadata = {
  title: 'Employee Management',
}

export default function CustomerLayout({ children }) {
  return (
    <div>
      {children}
    </div>
  )
}