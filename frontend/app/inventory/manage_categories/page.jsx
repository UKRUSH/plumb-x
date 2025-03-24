'use client';
import React, { useState, useEffect } from 'react';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch categories from an API or database
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        // Replace with your API call
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
    };

    return (
        <div>
            <h1>Category Product Dashboard</h1>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>{category.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ManageCategories;