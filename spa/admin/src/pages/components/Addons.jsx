import React, { useEffect, useState } from "react";
import axios from "axios";

const Addons = () => {
	const url = `${THRAILCOMMERCE.apiurl}/post-settings`;
	const [loader, setLoader] = useState("Save Settings");

	// Create state for toggle buttons
	const [toggles, setToggles] = useState([
		{
			id: 1,
			label: "Woocommerce Tip",
			name: "woocommerce_tips",
			description:
				"Enable the footer hook to show additional content in the footer.",
			value: false,
		},
		{
			id: 2,
			label: "Woocommerce Faq",
			name: "woocommerce_faq",
			description: "Enable custom functionality 1 for advanced features.",
			value: false,
		},
		{
			id: 3,
			label: "Woocommerce Product Barcode",
			name: "woocommerce_product_barcode",
			description: "Enable custom functionality 2 for more options.",
			value: false,
		},
		{
			id: 4,
			label: "Woocommerce Tips2",
			name: "woocommerce_tips2",
			description: "Enable custom functionality 3 for more options.",
			value: false,
		},
	]);

	const handleToggleChange = (id) => {
		// Toggle the switch value based on the id
		setToggles((prevToggles) =>
			prevToggles.map((toggle) =>
				toggle.id === id ? { ...toggle, value: !toggle.value } : toggle
			)
		);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoader("Saving...");

		// Prepare the toggle values to send to the backend
		const toggleValues = toggles.reduce((acc, toggle) => {
			acc[toggle.name] = toggle.value ? "on" : "off";
			return acc;
		}, {});

		axios
			.post(url, toggleValues, {
				headers: {
					"Content-Type": "application/json",
					"X-WP-Nonce": THRAILCOMMERCE.nonce,
				},
			})
			.then((response) => {
				setLoader("Saved");
				// window.location.reload();
			})
			.catch((error) => {
				console.log("error: ", error);
			});
	};

	useEffect(() => {
		axios
			.get(`${THRAILCOMMERCE.apiurl}/get-settings`)
			.then((response) => {
				// Update toggle state based on response
				setToggles((prevToggles) =>
					prevToggles.map((toggle) => ({
						...toggle,
						value: response.data[toggle.name] === "on",
					}))
				);
			})
			.catch((error) => {
				console.log("error: ", error);
			});
	}, []);

	return (
		<div>
			<form id='work-settings-form' onSubmit={handleSubmit}>
				<div className='grid grid-cols-4 md:grid-cols-4 sm:grid-cols-1 gap-6'>
					{toggles.map((toggle) => (
						<div
							key={toggle.id}
							className='p-4 bg-white shadow-md rounded-lg border border-gray-200'>
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='text-lg font-semibold'>
										{toggle.label}
									</h3>
									<p className='text-sm text-gray-600'>
										{toggle.description}
									</p>
								</div>
								<label className='relative inline-block w-12 h-6'>
									<input
										type='checkbox'
										id={`toggle-${toggle.id}`}
										className='opacity-0 w-0 h-0'
										checked={toggle.value}
										onChange={() =>
											handleToggleChange(toggle.id)
										}
									/>
									<span
										className={`slider block bg-gray-400 rounded-full w-[50px] h-[28px] cursor-pointer transition-all duration-100 ${
											toggle.value
												? "bg-[#5e3500]"
												: "bg-[#867c7c]"
										}`}></span>
									<span
										className={`dot absolute left-1 top-6 w-4 h-4 bg-white rounded-full transition-transform duration-100 transform ${
											toggle.value ? "translate-x-6" : ""
										}`}></span>
								</label>
							</div>
						</div>
					))}
				</div>
				<p className='submit mt-6'>
					<button type='submit' className='button button-primary'>
						{loader}
					</button>
				</p>
			</form>
		</div>
	);
};

export default Addons;