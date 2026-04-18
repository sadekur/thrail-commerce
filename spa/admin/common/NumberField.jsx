import React from 'react'

const NumberField = ({ value, onChange, suffix, helper }) => (
    <>
        <div className="flex items-center gap-2">
            <input
                type="number"
                min={0}
                value={value}
                onChange={onChange}
                className="w-80 max-w-full px-3 py-1.5 text-sm text-gray-800 bg-white border border-gray-400 rounded shadow-inner focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            {suffix && (
                <span className="text-sm font-medium text-gray-500">{suffix}</span>
            )}
        </div>
        {helper && (
            <p className="mt-1.5 text-xs text-gray-500 italic">{helper}</p>
        )}
    </>
);

export default NumberField
