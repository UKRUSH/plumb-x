import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/inventory/categories`;
    console.log('Fetching categories from:', apiUrl);

    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch categories');
    }
    
    const data = await response.json();
    console.log('Categories fetched:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
