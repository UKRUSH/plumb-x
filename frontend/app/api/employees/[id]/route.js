import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch employee');
    }

    const employee = await response.json();
    return NextResponse.json(employee);

  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update employee');
    }

    const employee = await response.json();
    return NextResponse.json(employee);

  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Failed to update employee' },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete employee');
    }

    return NextResponse.json({ message: 'Employee deleted successfully' });

  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Failed to delete employee' },
      { status: 500 }
    );
  }
} 