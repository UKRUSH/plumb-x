'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

// Safe localStorage utility functions with improved error handling
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      // Use a safer error reporting method
      try {
        console.error('Error accessing localStorage:', e.message || 'Unknown error');
      } catch (_) {
        // Fallback if console.error fails
      }
      return null;
    }
  },
  
  setItem: (key, value) => {
    if (typeof window === 'undefined') return false;
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (e) {
      // Use a safer error reporting method
      try {
        console.log('Error setting localStorage:', e.message || 'Unknown error');
      } catch (_) {
        // Fallback if console.log fails
      }
      return false;
    }
  },
  
  removeItem: (key) => {
    if (typeof window === 'undefined') return false;
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (e) {
      try {
        console.log('Error removing from localStorage:', e.message || 'Unknown error');
      } catch (_) {
        // Fallback if console.log fails
      }
      return false;
    }
  }
};

export default function AddNewItem() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';
  const editItemId = searchParams.get('itemId');
  
  // Add isMounted state to ensure we don't use localStorage during SSR
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    price: '',
    size: '',
    category: '',
    stockLevel: 0,
    material: 'PVC',
    description: '',
    imageUrl: '', // Add this field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add function to generate item code
  const generateItemCode = (material) => {
    const prefix = material?.substring(0, 3).toUpperCase() || 'ITM';
    const timestamp = Date.now().toString().slice(-5);
    return `${prefix}-${timestamp}`;
  };

  // Update useEffect for setting initial item code
  useEffect(() => {
    setIsMounted(true);
    if (!isEditMode) {
      // Auto-generate item code when material changes
      setFormData(prev => ({
        ...prev,
        itemCode: generateItemCode(prev.material)
      }));
    }
  }, [isEditMode, formData.material]);

  // Update the useEffect for fetching edit item data
  useEffect(() => {
    const fetchEditItem = async () => {
      if (!isMounted) return;

      const itemId = searchParams.get('id');
      if (!itemId) return;

      try {
        setIsSubmitting(true); // Show loading state
        console.log('Fetching item with ID:', itemId); // Debug log

        const response = await fetch(`/api/inventory/${itemId}`);
        if (!response.ok) throw new Error('Failed to fetch item');
        
        const itemData = await response.json();
        console.log('Fetched item data:', itemData); // Debug log
        
        setFormData({
          id: itemData._id,
          itemCode: itemData.sku,
          itemName: itemData.itemName,
          price: itemData.price,
          size: itemData.size,
          category: itemData.category,
          stockLevel: itemData.quantity,
          material: itemData.material,
          description: itemData.description || '',
          imageUrl: itemData.imageUrl || itemData.image || '', // Handle both image field names
        });
      } catch (error) {
        console.error("Error loading item for edit:", error);
        alert("Error loading item data. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (isEditMode) {
      fetchEditItem();
    }
  }, [isMounted, isEditMode, searchParams]);

  // Update handleInputChange to regenerate item code when material changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updates = { [name]: value };
      
      // Auto-generate item code when material changes and not in edit mode
      if (name === 'material' && !isEditMode) {
        updates.itemCode = generateItemCode(value);
      }
      
      return { ...prev, ...updates };
    });
  };

  // Store or update item in localStorage
  const storeAddedItem = (item, isUpdate = false) => {
    // Only execute once mounted
    if (!isMounted) {
      try { console.log("Component not mounted yet, cannot access localStorage"); } catch (_) {}
      return false;
    }
    
    try {
      // Get existing items or initialize empty array
      const existingItems = safeLocalStorage.getItem('recentlyAddedItems');
      let items = [];
      
      if (existingItems) {
        try {
          items = JSON.parse(existingItems);
          if (!Array.isArray(items)) {
            console.warn("Stored items was not an array, resetting");
            items = [];
          }
        } catch (parseError) {
          console.error("Error parsing stored items:", parseError);
          items = [];
        }
      }
      
      // IMPORTANT: Prepare the item with correct structure and validate image
      const itemToStore = {
        ...item,
        id: item.id || Date.now(),
        name: item.itemName || "Unnamed Item", // Ensure name field is set
        itemName: item.itemName || "Unnamed Item", // Keep both for consistency
        material: item.material || "Unknown",
        size: item.size || "Standard",
        stockLevel: Number(item.stockLevel) || 0,
        price: Number(item.price) || 0,
        dateAdded: item.dateAdded || new Date().toISOString(),
        dateModified: new Date().toISOString(),
        // Make sure image is properly stored
        image: item.image || null,
        // Add a flag to indicate if there's an image
        hasImage: !!item.image
      };
      
      // Log what we're storing for debugging
      console.log(`${isUpdate ? 'Updating' : 'Adding'} item with image:`, !!itemToStore.image);
      
      if (isUpdate) {
        // Try to find the item by ID first, then by itemCode as fallback
        let index = items.findIndex(i => i.id === item.id);
        
        // If not found by ID, try to find by itemCode
        if (index === -1 && item.originalItemCode) {
          index = items.findIndex(i => i.itemCode === item.originalItemCode);
          console.log(`Item not found by ID, searching by itemCode ${item.originalItemCode}, found at index: ${index}`);
        }
        
        if (index !== -1) {
          // Keep the original ID if it exists
          itemToStore.id = items[index].id || itemToStore.id;
          items[index] = itemToStore;
          console.log(`Updated item at index ${index}:`, itemToStore);
        } else {
          // If item not found, add it as new
          items.unshift(itemToStore);
          console.log("Item not found for update, adding as new:", itemToStore);
        }
      } else {
        // Add new item to the beginning of the array
        items.unshift(itemToStore);
        console.log("Added new item:", itemToStore);
      }
      
      // Keep only the last 20 items
      if (items.length > 20) {
        items = items.slice(0, 20);
      }
      
      // Extra safety check for browser environment
      if (typeof window === 'undefined' || !window.localStorage) {
        console.log("Window or localStorage not available");
        return false;
      }
      
      // Use our safe method instead of direct access
      const success = safeLocalStorage.setItem('recentlyAddedItems', JSON.stringify(items));
      
      if (success) {
        console.log("Successfully stored items with length:", items.length);
      } else {
        console.log("Failed to store items");
      }
      
      // Clean up if we were updating
      if (isUpdate && success) {
        safeLocalStorage.removeItem('itemToUpdate');
      }
      
      // Extra safety check for image size
      try {
        const totalSize = JSON.stringify(items).length;
        console.log(`Total localStorage size: ~${Math.round(totalSize / 1024)}KB`);
        // Warning if over 4MB (localStorage typical limit is ~5MB)
        if (totalSize > 4 * 1024 * 1024) {
          console.warn("WARNING: localStorage size is approaching the limit!");
        }
      } catch (e) {}
      
      return success;
    } catch (error) {
      try { console.log("Error in storeAddedItem function:", error.message || "Unknown error"); } catch (_) {}
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isMounted) return;
    
    setIsSubmitting(true);
    
    try {
      const itemData = {
        itemName: formData.itemName,
        category: formData.category,
        quantity: parseInt(formData.stockLevel) || 0,
        price: parseFloat(formData.price) || 0,
        size: formData.size,
        material: formData.material,
        imageUrl: formData.imageUrl, // Make sure this matches the backend expectation
        description: formData.description || '',
        supplier: formData.supplier || '',
        reorderPoint: parseInt(formData.reorderPoint) || 10,
        location: formData.location || '',
        sku: formData.itemCode
      };

      const url = isEditMode ? `/api/inventory/${formData.id}` : '/api/inventory';
      const method = isEditMode ? 'PUT' : 'POST';

      console.log('Submitting data:', itemData); // Debug log

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save item');
      }

      const savedData = await response.json();
      console.log('Server response:', savedData); // Debug log

      router.push(`/inventory/added-items?category=${formData.category}&success=true&action=${isEditMode ? 'updated' : 'added'}&t=${Date.now()}`);
    } catch (error) {
      console.error('Error saving item:', error);
      alert(error.message || 'Failed to save item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-yellow-500 mb-8">
          {isEditMode ? 'Update Item' : 'Add New Item'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image URL */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-md"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>

          {/* Item Code - Modified to be manually entered */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Code</label>
            <input
              type="text"
              name="itemCode"
              value={formData.itemCode}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              readOnly={isEditMode} // Only read-only in edit mode
              required // Make it required
            />
            <p className="mt-1 text-xs text-gray-500">
              {isEditMode 
                ? "Item codes cannot be changed after creation" 
                : "Enter a unique code for this item (e.g., PVC-12345)"
              }
            </p>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">Rs</span>
              </div>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Size</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              placeholder="e.g., 12 inches"
              required
            />
          </div>
          
          {/* Material */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Material</label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              placeholder="e.g., PVC, Metal"
              required
            />
          </div>
          
          {/* Stock Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Initial Stock Level</label>
            <input
              type="number"
              name="stockLevel"
              value={formData.stockLevel}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              min="0"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              required
            >
              <option value="">Select a category</option>
              <option value="pipes">Pipes</option>
              <option value="fittings">Fittings</option>
              <option value="valves">Valves</option>
              <option value="tools">Tools</option>
              <option value="fixtures">Fixtures</option>
              <option value="sealants">Sealants</option>
              <option value="safety">Safety Equipment</option>
              <option value="others">Others</option>
            </select>
            
            {/* Category help text */}
            <p className="mt-1 text-sm text-gray-500">
              Items will appear in their respective category section
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-yellow-500 text-white px-12 py-3 rounded-lg hover:bg-yellow-400 transition-colors duration-300 font-semibold text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                isEditMode ? 'Update Item' : 'Add Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
