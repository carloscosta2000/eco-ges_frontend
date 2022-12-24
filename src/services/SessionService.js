export async function verifyToken(token){
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({token: token})
        };
        const response = await fetch('session', requestOptions);
        return await response.json()
    }catch(error){
        return []
    }
}