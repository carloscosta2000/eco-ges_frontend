import React, { useEffect, useState } from 'react';
import { getCLient } from '../services/ClientService';
import { getAppliances } from '../services/ClientService';
import useToken from '../components/useToken';

function Appliances() {
    const { token, setToken } = useToken();
    console.log("token: " + token);
    const [client_name, setName] = useState("");
    const [client, setClient] = useState({});
    const [appliances, setAppliances] = useState([[]]);
    useEffect(() => {
		async function fetchData() {
            const response_client = await getCLient(token);
            const client = response_client[0];
			//setClient(response_client[0]); //client.id, client.nome
            console.log("Client-> " + JSON.stringify(response_client[0]));
            setName(client.nome);
            const response_appliances = await getAppliances(client.id);
            setAppliances(await response_appliances); //appliance.id,appliance.nome, appliance.MaxConsumption, appliance.isProducing
		}
		fetchData();
	  }, []);

    return (
        <div className="container">
            <h3 className="p-3 text-center">Appliances of {client_name}</h3>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Consumo Máximo</th>
                        <th>Produz energia?</th>
                    </tr>
                </thead>
                <tbody>
                    {appliances.map(appliance =>
                        <tr key={appliance.id}>
                            <td>{appliance.nome}</td>
                            <td>{appliance.maxConsumption}</td>
                            <td>{appliance.isProducing}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export { Appliances };