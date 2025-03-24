'use client';
import React, { useEffect } from 'react';

export default function CustomModal({ isOpen, onRequestClose, children, title, className = '' }) {
  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onRequestClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.body.style.overflow = 'unset'; // Re-enable scrolling
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onRequestClose]);

  if (!isOpen) return null;

  // Handle clicks on the overlay (background) to close the modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onRequestClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
      data-testid="modal-overlay"
    >
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}
        onClick={e => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button 
            onClick={onRequestClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
