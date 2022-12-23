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
            body: JSON.stringify({ rnd_hash: token})
        };
          
        const response = await fetch('clienttoken', requestOptions);
        return await response.json()
    }catch(error){
        return []
    }
}

export async function getAppliances(id){
    try {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        const params = new URLSearchParams();
        params.append('clientID', id);
        const response = await fetch(`appliancesclient?${params}`, requestOptions);
        return await response.json()
    }catch(error){
        return []
    }
}