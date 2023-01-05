import React, { useEffect, useState } from 'react';
import { verifyToken } from '../services/SessionService';
import useToken from '../components/useToken';
import { useNavigate } from "react-router-dom";
import { diffie_hellman, save_data } from '../services/DiffieHellmanService';


function Home() {
	const { token, setToken } = useToken();
	const [ isloading, setIsLoading ] = useState(false);
	const [ sessionKey, setSessionKey ] = useState("");
	const [ isSaved, setIsSaved ] = useState("");
	const [ timestamp, setTimeStamp ] = useState();

	const navigate = useNavigate();

	

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

		// timestamp + 1min for maior que now pode fazer save

		let max_threshold = new Date(parseInt(timestamp))
		console.log(max_threshold)
		
		max_threshold.setMinutes(max_threshold.getMinutes() + 1);

		const now = new Date()
		console.log(now)
		if (max_threshold > now){
			await save_data(token, sessionKey, personalInfo.morada, personalInfo.nif, personalInfo.iban, personalInfo.email, personalInfo.telefone)
			setIsSaved("Information updated with success!");
		}else{
			setIsSaved("The time limit has expired! You only have one minute to update your critical information. Please refresh the page.");
		}
	};
	

	useEffect(() => {
		if(!token){
			navigate("/login")
		}
		async function fetchData() {
			const response = await verifyToken(token);
			console.log("Verify Token: " + JSON.stringify(response))
			if("success" in response){
				setIsLoading(true)
				const information = await diffie_hellman(token);
				setSessionKey(information.secret);
				setTimeStamp(information.timestamp)
				setIsLoading(false);
				setPersonalInfo(information.information)
			}
		}
		fetchData();
	}, []);

	return (
		<div>
			<p>{isSaved}</p>
			{ isloading == true &&
				<p>Generating Session Keys.</p>
			}
			{ sessionKey != "" &&
				
				<form onSubmit={handleSubmit}>
					<label htmlFor="morada">Address:</label>
					<input
						minLength="5"
						type="text"
						id="morada"
						name="morada"
						value={personalInfo.morada}
						onChange={handleChange}
					/><br />
					<label htmlFor="nif">NIF:</label>
					<input
						minLength="5"
						type="text"
						id="nif"
						name="nif"
						value={personalInfo.nif}
						onChange={handleChange}
					/><br />
					<label htmlFor="iban">IBAN:</label>
					<input
						minLength="5"
						type="text"
						id="iban"
						name="iban"
						value={personalInfo.iban}
						onChange={handleChange}
					/><br />
					<label htmlFor="iban">Email:</label>
					<input
						minLength="5"
						type="email"
						id="email"
						name="email"
						value={personalInfo.email}
						onChange={handleChange}
					/><br />
					<label htmlFor="iban">Phone:</label>
					<input
						minLength="5"
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
