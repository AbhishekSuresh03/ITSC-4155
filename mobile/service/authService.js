import {
    PRODUCTION_BACKEND_URL
  } from "@env"; // Import environment variables
const BASE_URL = `${PRODUCTION_BACKEND_URL}/users`;


// *******Replace with your actual backend URL using your computer IP address NOT local host, local host address is different on your phone than your laptop*****************8

//function to handle login
export async function loginUser(username, password){
    try{
        //IF YOU DELETE THIS COMMENT THIS WILL BREAK. DO NOT DELETE
        const response = await fetch(`${BASE_URL}/login`, {
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

        // const responseData = await response.json(); // Await the JSON response
        // console.log('response: ', responseData); // Log the response data

        return await response.json();
    } catch(error){
        throw error;
    }
}

export async function createUser(formData){
    try{
        // console.log(formData);
        // console.log(BASE_URL);
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
                profilePicture: formData.profilePicture,
                trails: [],
            }),
        });
        if(!response.ok){
            throw new Error(await response.text());
        }
        // console.log(response);
        return await response.json();
    } catch(error){
        throw error;
    }
}