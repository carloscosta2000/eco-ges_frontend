export async function login(username, password, publickey, name){
    try {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password})
        };

        const response = await fetch('login', requestOptions);
        return await response.json();
    }catch(error){
        return []
    }
}