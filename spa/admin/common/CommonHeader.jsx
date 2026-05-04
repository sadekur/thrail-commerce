import React from "react";

const CommonHeader = ({ title, onDisableAll, onEnableAll }) => {
	return (
		<div className='commerce-kit-header bg-white py-3 px-4 rounded-lg shadow-md'>
			<h1 className='text-xl font-bold text-[#0029af]'>{title}</h1>
			<div className='commerce-kit-control-button flex'>
				<button
					className='commerce-kit-disable-all'
					onClick={onDisableAll}>
					Disable All
				</button>
				<button
					className='commerce-kit-enable-all'
					onClick={onEnableAll}>
					Enable All
				</button>
			</div>
		</div>
	);
};

export default CommonHeader;
