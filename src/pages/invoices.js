import React, { useEffect, useState } from 'react';
import { getCLient } from '../services/ClientService';
import { getInvoices } from '../services/ClientService';
import useToken from '../components/useToken';

function Invoices() {
    const { token, setToken } = useToken();
    const [client_name, setName] = useState("");
    const [client, setClient] = useState({});
    const [invoices, setInvoices] = useState(0);
    useEffect(() => {
		async function fetchData() {
            const response_client = await getCLient(token);
            const client = response_client[0];
            setName(client.nome);
            const response_invoices = await getInvoices(token);
            setInvoices(await response_invoices);
		}
		fetchData();
	  }, []);

    return (
        <div className="container">
            <h3 className="p-3 text-center">Invoices of {client_name}</h3>
            <p>O client tem que pagar {invoices}.</p>
        </div>
    );
}

export { Invoices };