import React from 'react'

const SettingSkeleton = () => {
  return (
    <div className="relative">
        {/* <CommonHeader title="Stock Threshold Settings" /> */}
        <div className="mt-4 p-6 bg-white shadow-md rounded-lg border border-gray-200 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-10 bg-gray-100 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-100 rounded w-2/3"></div>
        </div>
    </div>
  )
}

export default SettingSkeleton
