'use client';
import React from 'react';

export default function ReportFilter({ activeFilter, onFilterChange, dateRange, onDateRangeChange }) {
    return (
        <div className="space-y-4">
            <div className="flex gap-4 mb-6">
                {['Daily', 'Weekly', 'Monthly', 'Custom'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => onFilterChange(filter.toLowerCase())}
                        className={`px-6 py-2 rounded-lg ${
                            activeFilter === filter.toLowerCase()
                                ? 'bg-yellow-500 text-black'
                                : 'bg-white border-2 border-yellow-500 text-black'
                        } hover:bg-yellow-400 transition-colors duration-300`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
            {activeFilter === 'custom' && (
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-full md:w-auto">
                        <label className="block text-sm font-medium text-black mb-1">Start Date</label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-black focus:border-yellow-500"
                            max={dateRange.end || undefined}
                        />
                    </div>
                    <span className="text-black">to</span>
                    <div className="w-full md:w-auto">
                        <label className="block text-sm font-medium text-black mb-1">End Date</label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-black focus:border-yellow-500"
                            min={dateRange.start || undefined}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
