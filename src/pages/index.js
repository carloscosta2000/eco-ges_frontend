import React, { useEffect, useState } from 'react';
import { getAllClients } from '../services/ClientService';

function Home() {
	const [users, setUsers] = useState(null)

	useEffect(() => {
		async function fetchData() {
		  const response = await getAllClients();
		  console.log(response)
		  setUsers(response);
		}
		//fetchData();
	  }, []);

	return (
		<div>
		<h1>Welcome to GeeksforGeeks</h1>
		</div>
	);
}

export default Home;
