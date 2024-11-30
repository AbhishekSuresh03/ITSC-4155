import {
    PRODUCTION_BACKEND_URL,
    DEVELOPMENT_BACKEND_URL
  } from "@env"; // Import environment variables
const BASE_URL = `${DEVELOPMENT_BACKEND_URL}/users`;

export async function getAllUsers() {
    try {
        //IF YOU DELETE THIS COMMENT THIS WILL BREAK. DO NOT DELETE
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