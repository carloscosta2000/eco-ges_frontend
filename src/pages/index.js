import React, { useEffect, useState } from 'react';
import { getAllClients } from '../services/ClientService';
import { verifyToken } from '../services/SessionService';
import useToken from '../components/useToken';

import { get_user_information } from '../services/DiffieHellmanService';

function Home() {
	const { token, setToken } = useToken();
	const [ isloading, setIsLoading ] = useState(false);
	const { sessionKey, setSessionKey } = useState({});

	useEffect(() => {
		async function fetchData() {
			const response = await verifyToken(token);
			console.log("Verify Token: " + JSON.stringify(response))
			if("success" in response){
				setIsLoading(true)

				let hasSessionKey = false;
				do {
					const response_clients = await get_user_information(token);
					console.log(response_clients)
					
					if (response_clients != false)
						hasSessionKey = true
					
				} while (!hasSessionKey);
				setIsLoading(false)

				
				//const test = await getAllClients();
				
				//setUsers(response_clients);
			}
		}
		fetchData();
	  }, []);

	return (
		<div>
		<h1>{isloading}</h1>
		<h1>{token}</h1>
		</div>
	);
}

export default Home;
