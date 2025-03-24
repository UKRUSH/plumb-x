import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to add employee');
    }

    const employee = await response.json();
    return NextResponse.json(employee, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }

    const employees = await response.json();
    return NextResponse.json(employees);

  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch employees' },
      { status: 500 }
    );
  }
} 