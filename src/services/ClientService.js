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
        console.log("GET_CLIENT" + response.json());
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
        console.log("GET_APPLIANCES" + response.json());
        return await response.json()
    }catch(error){
        return []
    }
}