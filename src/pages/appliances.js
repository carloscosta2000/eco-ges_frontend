import React, { useEffect, useState } from 'react';
import { getCLient } from '../services/ClientService';
import { getAppliances } from '../services/ClientService';
import { getInvoices } from '../services/ClientService';
import useToken from '../components/useToken';
import { getContract } from '../services/ClientService';
import { getConsumptions } from '../services/ClientService';

function Appliances() {
    const { token, setToken } = useToken();
    const [client_name, setName] = useState("");
    const [client, setClient] = useState({});
    const [appliances, setAppliances] = useState([[]]);
    const [invoices, setInvoices] = useState(0);
    const [contracts, setContracts] = useState([[]]);
    const [consumptions, setConsumptions] = useState([[]]);
    useEffect(() => {
		async function fetchData() {
            const response_client = await getCLient(token);
            const client = response_client[0];
            setName(client.nome);
            const response_appliances = await getAppliances(client.id);
            setAppliances(await response_appliances); //appliance.id,appliance.nome, appliance.MaxConsumption, appliance.isProducing, appliance.contractID
            const response_invoices = await getInvoices(token);
            setInvoices(await response_invoices);
            const response_contracts = await getContract(token);
            setContracts(await response_contracts); //contract.id, contract.tipo
            const response_consumptions = await getConsumptions(token);
            let consumption_list = await response_consumptions;
            let list = [[]];
            consumption_list.forEach(listofConsumptions => {
                listofConsumptions.forEach(consumption => {
                    list.push(consumption);
                })
            });
            setConsumptions(list);
		}
		fetchData();
	  }, []);

    return (
        <div className="container">
            <h3 className="p-3 text-center">Appliances of {client_name}</h3>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th className="p-3 text-center">Nome</th>
                        <th className="p-3 text-center">Consumo Máximo</th>
                        <th className="p-3 text-center">Produz energia?</th>
                        <th className="p-3 text-center">ContractID</th>
                    </tr>
                </thead>
                <tbody>
                    {appliances.map(appliance =>
                        <tr key={appliance.id}>
                            <td>{appliance.nome}</td>
                            <td>{appliance.maxConsumption}</td>
                            <td>{appliance.isProducing}</td>
                            <td>{appliance.contractID}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <h3 className="p-3 text-center">Contracts of {client_name}</h3>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th className="p-3 text-center">ContractID</th>
                        <th className="p-3 text-center">Type</th>
                    </tr>
                </thead>
                <tbody>
                    {contracts.map(contract =>
                        <tr key={contract.id}>
                            <td>{contract.id}</td>
                            <td>{contract.tipo}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <h3 className="p-3 text-center">Consumptions of {client_name}'s Appliances</h3>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th className="p-3 text-center">ApplianceID</th>
                        <th className="p-3 text-center">Time of Consumption</th>
                        <th className="p-3 text-center">Consumption</th>
                    </tr>
                </thead>
                <tbody>
                    {consumptions.map(consumption =>
                        <tr key={consumption.id}>
                            <td>{consumption.applianceID}</td>
                            <td>{consumption.ts}</td>
                            <td>{consumption.consumption}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <p>Total a pagar: {invoices}</p>
        </div>
    );
}

export { Appliances };