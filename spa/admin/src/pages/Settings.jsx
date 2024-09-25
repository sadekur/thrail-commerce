import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
	// Create state for each input field
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log({
			firstname,
			lastname,
			email,
		});
	};

	return (
		<div>
			<form id='work-settings-form' onSubmit={handleSubmit}>
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
									onChange={(e) => setFirstname(e.target.value)}
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
									onChange={(e) => setLastname(e.target.value)}
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
						Submit
					</button>
				</p>
			</form>
		</div>
	);
};

export default Settings;
