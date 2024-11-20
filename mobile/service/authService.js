const BASE_URL = 'http://10.106.8.53:8080/users';  
// *******Replace with your actual backend URL using your computer IP address NOT local host, local host address is different on your phone than your laptop*****************8

//function to handle login
export async function loginUser(username, password){
    try{
        const response = await fetch(`${BASE_URL}`, {
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

export async function createUser(formData){
    try{
        console.log(formData);
        console.log(BASE_URL);
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                username: formData.username,
                firstName: formData.firstName,
                lastName: formData.lastName, 
                password: formData.password,
                city: formData.city,
                state: formData.state,
                profilePic: formData.profilePic,
                trails: formData.trails,
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