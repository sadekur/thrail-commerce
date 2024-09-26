import React, { useEffect, useState } from "react";
import axios from "axios";

const Settings = () => {
	// Create state for each input field
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const url = `${THRAILCOMMERCE.apiurl}/post-settings`;
	console.log("url: ", url);
	const [loader, setLoader] = useState("Save Setting");

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoader("Saving...");
		axios
			.post(
				url,
				{
					firstname: firstname,
					lastname: lastname,
					email: email,
				},
				{
					headers: {
						"Content-Type": "application/json",
						"X-WP-Nonce": THRAILCOMMERCE.nonce,
					},
				}
			)
			.then((response) => {
				setLoader("Saved");
			})
			.catch((error) => {
				console.log("error: ", error);
			});
	};
	useEffect(() => {
		axios
			.get(`${THRAILCOMMERCE.apiurl}/get-settings`)
			.then((response) => {
				setFirstname(response.data.firstname);
				setLastname(response.data.lastname);
				setEmail(response.data.email);
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
						<tr>
							<th scope='row'>
								<label htmlFor='firstname'>Firstname</label>
							</th>
							<td>
								<input
									id='firstname'
									name='firstname'
									value={firstname}
									onChange={(e) => {
										setFirstname(e.target.value);
									}}
									className='regular-text h-[40px]'
								/>
							</td>
						</tr>
						<tr>
							<th scope='row'>
								<label htmlFor='lastname'>Lastname</label>
							</th>
							<td>
								<input
									id='lastname'
									name='lastname'
									value={lastname}
									onChange={(e) =>
										setLastname(e.target.value)
									}
									className='regular-text h-[40px]'
								/>
							</td>
						</tr>
						<tr>
							<th scope='row'>
								<label htmlFor='email'>Email</label>
							</th>
							<td>
								<input
									id='email'
									name='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className='regular-text h-[40px]'
								/>
							</td>
						</tr>
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
