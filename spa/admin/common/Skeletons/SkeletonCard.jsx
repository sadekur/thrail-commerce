import React from 'react'

const SkeletonCard = () => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200 animate-pulse">
        <div className="flex flex-col h-full">
            <div className="mb-auto">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-5/6 mt-1"></div>
            </div>
            <div className="mt-auto flex justify-end">
                <div className="w-12 h-5 bg-gray-200 rounded-full mt-4"></div>
            </div>
        </div>
    </div>
  )
}

export default SkeletonCard
