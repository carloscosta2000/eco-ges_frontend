import React, { useEffect, useState } from 'react';
import { getAllClients } from '../services/ClientService';
import { verifyToken } from '../services/SessionService';
import useToken from '../components/useToken';

import { get_user_information } from '../services/DiffieHellmanService';

function Home() {
	const { token, setToken } = useToken();
	//const [users, setUsers] = useState(null)

	useEffect(() => {
		async function fetchData() {
			const response = await verifyToken(token);
			console.log("Verify Token: " + JSON.stringify(response))
			if("success" in response){
				const response_clients = await get_user_information(token);
				console.log(response_clients)
				//setUsers(response_clients);
			}
		}
		fetchData();
	  }, []);

	return (
		<div>
		<h1>{token}</h1>
		</div>
	);
}

export default Home;
