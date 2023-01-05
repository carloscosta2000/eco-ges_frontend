export async function signup_client(username, password, name){
    try {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password, name: name })
        };

        const response = await fetch('signup', requestOptions);
        return await response.json()
    }catch(error){
        return []
    }
}