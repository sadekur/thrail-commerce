import React from "react";

const CommonHeader = ({ title, onDisableAll, onEnableAll }) => {
	return (
		<div className='flex justify-between items-center bg-white py-3 p-4 rounded-lg shadow-md'>
			<h1 className='text-xl font-bold text-[#0029af]'>{title}</h1>
			<div className='flex space-x-4'>
				<button
					className='px-4 py-2 bg-gray-500 border border-gray-500 text-white font-bold rounded-lg shadow hover:bg-red-600 transition-all duration-200'
					onClick={onDisableAll}>
					Disable All
				</button>
				<button
					className='px-4 py-2 bg-[#0029af] border-gray-500 text-white rounded-lg shadow hover:bg-[#0842ff] transition-all duration-200'
					onClick={onEnableAll}>
					Enable All
				</button>
			</div>
		</div>
	);
};

export default CommonHeader;
