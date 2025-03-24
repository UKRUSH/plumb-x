import { NextResponse } from 'next/server'

// Define public and protected routes
const publicRoutes = ['/signin', '/register', '/homepage', '/about', '/contact']
const protectedRoutes = {
  inventory: [
    '/inventory',
    '/inventory/dashboard',
    '/inventory/add_new',
    '/inventory/inventory_management',
    '/inventory/category',
    '/inventory/view_alerts',
    '/inventory/inventory_analytics'
  ],
  employee: [
    '/employees', 
    '/employees/employee_manager_dashboard',
    '/employees/attendance_check',
    '/employees/leave_management',
    '/employees/view_employees',
    '/employees/add_employee',
    '/employees/edit_employee'
  ],
  delivery: [
    '/delivery',
    '/delivery/dashboard',
    '/delivery/assign_drivers',
    '/delivery/track',
    '/delivery/reports'
  ],
  finance: [
    '/finance',
    '/finance/dashboard',
    '/finance/invoices',
    '/finance/salary',
    '/finance/insights'
  ],
  customer: [
    '/dashboard/orderAndCustomer',
    '/product',
    '/cart',
    '/dashboard/orderAndCustomer/order'
  ]
}

export function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value

  // Allow access to static files and API routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // If user is already logged in and tries to access auth pages, redirect to their dashboard
  if (token && role && (pathname === '/signin' || pathname === '/register')) {
    const roleRedirects = {
      inventory: '/inventory/dashboard',
      employee: '/employees/employee_manager_dashboard',
      delivery: '/delivery/dashboard',
      finance: '/finance/dashboard',
      customer: '/dashboard/orderAndCustomer'
    };
    return NextResponse.redirect(new URL(roleRedirects[role], request.url))
  }

  // Allow public routes for non-authenticated users
  if (!token && publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!token || !role) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // For authenticated users, check role-based access
  const allowedRoutes = protectedRoutes[role] || []
  const hasAccess = allowedRoutes.some(route => pathname.startsWith(route))

  // If user tries to access another role's routes, redirect to their own dashboard
  if (!hasAccess) {
    const roleRedirects = {
      inventory: '/inventory/dashboard',
      employee: '/employees/employee_manager_dashboard',
      delivery: '/delivery/dashboard',
      finance: '/finance/dashboard',
      customer: '/dashboard/orderAndCustomer'
    };
    return NextResponse.redirect(new URL(roleRedirects[role], request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /icons (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|fonts|icons|[\\w-]+\\.\\w+).*)',
  ],
}
