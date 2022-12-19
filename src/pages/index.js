import React, { useEffect, useState } from 'react';
import { getAllClients } from '../services/ClientService';
import { verifyToken } from '../services/SessionService';
import useToken from '../components/useToken';

function Home() {
	const { token, setToken } = useToken();
	const [users, setUsers] = useState(null)

	useEffect(() => {
		async function fetchData() {
			const response = await verifyToken(token);
			console.log("Verify Token: " + JSON.stringify(response))
			if("success" in JSON.stringify(response)){
				const response_clients = await getAllClients();
				console.log("Users: " + response_clients)
				setUsers(response_clients);
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
