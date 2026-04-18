import React from 'react'

const CheckboxField = ({ checked, onChange, label, helper }) => (
    <>
        <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
            />
            <span className="text-sm text-gray-800">{label}</span>
        </label>
        {helper && (
            <p className="mt-1.5 text-xs text-gray-500 italic">{helper}</p>
        )}
    </>
);

export default CheckboxField
