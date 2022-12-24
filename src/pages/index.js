import React, { useEffect, useState } from 'react';
import { getAllClients } from '../services/ClientService';
import { verifyToken } from '../services/SessionService';
import useToken from '../components/useToken';

import { diffie_hellman, save_data } from '../services/DiffieHellmanService';


function Home() {
	const { token, setToken } = useToken();
	const [ isloading, setIsLoading ] = useState(false);
	const [ sessionKey, setSessionKey ] = useState("");


	const [personalInfo, setPersonalInfo] = useState({
		morada: '',
		nif: '',
		iban: '',
		email: '',
		telefone: '',
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setPersonalInfo((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		await save_data(token, personalInfo.morada, personalInfo.nif, personalInfo.iban, personalInfo.email, personalInfo.telefone)

		// Send the personal information to the API
		// api.updatePersonalInfo(personalInfo);
	};
	

	useEffect(() => {
		async function fetchData() {
			const response = await verifyToken(token);
			console.log("Verify Token: " + JSON.stringify(response))
			if("success" in response){
				setIsLoading(true)
				const hexSessionKey = await diffie_hellman(token);
				setSessionKey(hexSessionKey);
				setIsLoading(false)
			}
		}
		fetchData();
	}, []);

	return (
		<div>
			{ isloading == true &&
				<p>Generating Session Keys.</p>
			}
			{ sessionKey != "" &&
				<form onSubmit={handleSubmit}>
					<label htmlFor="morada">Address:</label>
					<input
						type="text"
						id="morada"
						name="morada"
						value={personalInfo.morada}
						onChange={handleChange}
					/><br />
					<label htmlFor="nif">NIF:</label>
					<input
						type="text"
						id="nif"
						name="nif"
						value={personalInfo.nif}
						onChange={handleChange}
					/><br />
					<label htmlFor="iban">IBAN:</label>
					<input
						type="text"
						id="iban"
						name="iban"
						value={personalInfo.iban}
						onChange={handleChange}
					/><br />
					<label htmlFor="iban">Email:</label>
					<input
						type="email"
						id="email"
						name="email"
						value={personalInfo.email}
						onChange={handleChange}
					/><br />
					<label htmlFor="iban">Phone:</label>
					<input
						type="text"
						id="telefone"
						name="telefone"
						value={personalInfo.telefone}
						onChange={handleChange}
					/><br />
					<button type="submit">Save</button>
				</form>
			}

			
		</div>
	);
}

export default Home;
