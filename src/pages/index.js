import React, { useEffect, useState } from 'react';
import { getAllClients } from '../services/ClientService';
import { verifyToken } from '../services/SessionService';
import useToken from '../components/useToken';

import { diffie_hellman } from '../services/DiffieHellmanService';


function Home() {
	const { token, setToken } = useToken();
	const [ isloading, setIsLoading ] = useState(false);
	const [ sessionKey, setSessionKey ] = useState("");

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
		<h1>{sessionKey}</h1>
		{/* <h1>{token}</h1> */}
		</div>
	);
}

export default Home;
