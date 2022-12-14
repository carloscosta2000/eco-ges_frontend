export async function getAllClients(){
    try {
        const response = await fetch('clients');
        return await response.json()
    }catch(error){
        return []
    }
}

export async function getCLient(token){
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({rnd_hash: token})
        };
        const response = await fetch('clienttoken', requestOptions);
        return await response.json()
    }catch(error){
        return []
    }
}

export async function getInvoices(token){
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({rnd_hash: token})
        };
        const response = await fetch('invoices', requestOptions);
        return await response.json()
    }catch(error){
        return []
    }
}

export async function getContract(token){
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({rnd_hash: token})
        };
        const response = await fetch('contractstoken', requestOptions);
        return await response.json()
    }catch(error){
        return []
    }
}

export async function getConsumptions(token){
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({rnd_hash: token})
        };
        const response = await fetch('consumptionstoken', requestOptions);
        return await response.json()
    }catch(error){
        return []
    }
}

export async function getAppliances(id){
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientID: id})
        };
        const response = await fetch('appliancesclient', requestOptions);
        return await response.json()
    }catch(error){
        return []
    }
}