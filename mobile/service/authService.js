const BASE_URL = 'http://192.168.10.105:8080/users';  
// *******Replace with your actual backend URL using your computer IP address NOT local host, local host address is different on your phone than your laptop*****************8

//function to handle login
export async function loginUser(username, password){
    try{
        const response = await fetch(`${BASE_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        });
        if(!response.ok){
            throw new Error(await response.text()); //throw error if login fails
        }

        return await response.json();
    } catch(error){
        throw error;
    }
}

export async function createUser(email, username, firstName, lastName, password){
    try{
        const response = await fetch(`${BASE_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                username: username,
                firstName: firstName,
                lastName: lastName, 
                password: password,
            }),
        });
        if(!response.ok){
            throw new Error(await response.text());
        }

        return await response.json();
    } catch(error){
        throw error;
    }
}