import React from "react";

const CommonHeader = ({ title, onDisableAll, onEnableAll }) => {
	return (
		<div className='thail-commerce-header bg-white py-3 p-4 rounded-lg shadow-md'>
			<h1 className='text-xl font-bold text-[#0029af]'>{title}</h1>
			<div className='thail-commerce-control-button flex'>
				<button
					className='thail-commerce-disable-all'
					onClick={onDisableAll}>
					Disable All
				</button>
				<button
					className='thail-commerce-enable-all'
					onClick={onEnableAll}>
					Enable All
				</button>
			</div>
		</div>
	);
};

export default CommonHeader;
