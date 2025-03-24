'use client';
import { useState, useEffect } from 'react';

export default function InventoryModal({ item, isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    description: '',
    quantity: 0,
    price: 0,
    supplier: '',
    reorderPoint: 10,
    location: ''
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' || name === 'reorderPoint' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">{item ? 'Edit' : 'Add'} Inventory Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="Item Name"
              className="border p-2 rounded"
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="tools">Tools</option>
              <option value="pipes">Pipes</option>
              <option value="fittings">Fittings</option>
              <option value="valves">Valves</option>
              <option value="pvc">PVC</option>
            </select>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2 rounded"
              required
            />
            <input
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Supplier"
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="reorderPoint"
              value={formData.reorderPoint}
              onChange={handleChange}
              placeholder="Reorder Point"
              className="border p-2 rounded"
            />
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="border p-2 rounded"
            />
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded w-full"
            rows="3"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {item ? 'Update' : 'Add'} Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
