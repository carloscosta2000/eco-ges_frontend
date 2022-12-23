import React, { useEffect, useState } from 'react';
import { getCLient } from '../services/ClientService';
import { getAppliances } from '../services/ClientService';
import useToken from '../components/useToken';

function Appliances() {
    const token = useToken();
    const client = getCLient(token); //user.nome, user.morada
    const appliances = getAppliances(client.id); //appliance.id,appliance.nome
    return (
        <div className="container">
            <h3 className="p-3 text-center">Appliances of {client.nome}</h3>
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