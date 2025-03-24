import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/inventory/category/${params.category}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch items');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching category items:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
