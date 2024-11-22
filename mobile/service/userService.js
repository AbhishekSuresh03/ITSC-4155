import {
    PRODUCTION_BACKEND_URL
  } from "@env"; // Import environment variables
const BASE_URL = `${PRODUCTION_BACKEND_URL}/users`;

export async function getAllUsers() {
    try {
        //IF YOU DELETE THIS COMMENT THIS WILL BREAK. DO NOT DELETE
        console.log('Get All Users ' + PRODUCTION_BACKEND_URL);
        console.log('Get All Users ' + BASE_URL);
        const response = await fetch(`${BASE_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}