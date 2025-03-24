import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/${params.id}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch item');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    
    // Ensure we're sending all required fields
    const updateData = {
      itemName: body.itemName,
      category: body.category,
      quantity: body.quantity,
      price: body.price,
      size: body.size,
      material: body.material,
      description: body.description || '',
      imageUrl: body.imageUrl, // Add this field
      image: body.image,
      supplier: body.supplier,
      reorderPoint: body.reorderPoint,
      location: body.location,
      sku: body.sku
    };

    console.log('Updating item with data:', updateData); // Debug log

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update item');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Update error:', error); // Debug log
    return NextResponse.json(
      { error: error.message || 'Failed to update item' }, 
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/${params.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete item');
    }

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete item' }, 
      { status: 500 }
    );
  }
}
