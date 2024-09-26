import React, { useEffect, useState } from "react";
import axios from "axios";

const Settings = () => {
	const url = `${THRAILCOMMERCE.apiurl}/post-settings`;
	const [loader, setLoader] = useState("Save Settings");

	// Create state for toggle buttons
	const [toggles, setToggles] = useState([
		{ id: 1, label: "Enable Footer Hook", value: false },
		{ id: 2, label: "Enable Custom Functionality 1", value: false },
		{ id: 3, label: "Enable Custom Functionality 2", value: false },
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
			acc[toggle.label] = toggle.value ? "on" : "off";
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
			})
			.catch((error) => {
				console.log("error: ", error);
			});
	};

	useEffect(() => {
		// Fetch initial values from the backend
		axios
			.get(`${THRAILCOMMERCE.apiurl}/get-settings`)
			.then((response) => {
				// Update toggle state based on response
				setToggles((prevToggles) =>
					prevToggles.map((toggle) => ({
						...toggle,
						value: response.data[toggle.label] === "on",
					}))
				);
			})
			.catch((error) => {
				console.log("error: ", error);
			});
	}, []);

	return (
		<div>
			<form id='work-settings-form' onSubmit={(e) => handleSubmit(e)}>
				<table className='form-table' role='presentation'>
					<tbody>
						{toggles.map((toggle) => (
							<tr key={toggle.id}>
								<th scope='row'>
									<label htmlFor={`toggle-${toggle.id}`}>
										{toggle.label}
									</label>
								</th>
								<td>
									<label className='switch'>
										<input
											type='checkbox'
											id={`toggle-${toggle.id}`}
											checked={toggle.value}
											onChange={() =>
												handleToggleChange(toggle.id)
											}
										/>
										<span className='slider'></span>
									</label>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<p className='submit'>
					<button type='submit' className='button button-primary'>
						{loader}
					</button>
				</p>
			</form>
		</div>
	);
};

export default Settings;
