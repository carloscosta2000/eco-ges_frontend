export async function getAllClients(){
    try {
        const response = await fetch('clients');
        return await response.json()
    }catch(error){
        return []
    }
}