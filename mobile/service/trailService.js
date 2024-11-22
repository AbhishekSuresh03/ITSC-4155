import {
    PRODUCTION_BACKEND_URL
  } from "@env"; // Import environment variables
const BASE_URL = `${PRODUCTION_BACKEND_URL}/trails`;

export async function fetchTrails() {
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

export async function fetchTrailById(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
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

export async function fetchTrailsByUserId(userId) {
    try {
        const response = await fetch(`${BASE_URL}/owner/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseText = await response.text();
        console.log('API Response:', responseText); // Log the raw response text
        if (!response.ok) {
            throw new Error(responseText);
        }
        return JSON.parse(responseText); // Parse the response text as JSON
    } catch (error) {
        console.error('Error fetching trails by user ID:', error);
        throw error;
    }
}

export async function createTrail(formData, userId) {
    try {
        const response = await fetch(`${BASE_URL}?ownerId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}