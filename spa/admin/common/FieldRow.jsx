import React from 'react';

const FieldRow = ({ label, children }) => (
    <div className="flex items-start gap-6 py-5 px-6">
        <div className="w-56 flex-shrink-0 pt-1">
            <span className="text-sm font-semibold text-gray-800">
                {label}
            </span>
        </div>
        <div className="flex-1 min-w-0">{children}</div>
    </div>
);

export default FieldRow;