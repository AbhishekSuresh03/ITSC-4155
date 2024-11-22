import {
    PRODUCTION_BACKEND_URL
  } from "@env"; // Import environment variables
const BASE_URL = `${PRODUCTION_BACKEND_URL}/users`;

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

export async function followUser(currentUserId, userIdToFollow){
    try{
        const response = await fetch(`${BASE_URL}/${currentUserId}/follow/${userIdToFollow}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok){
            const errorText = await response.text();
            throw new Error(errorText);
        }
        return await response.json();
    }catch(error){
        throw error;
    }

    export async function unFollowUser(currentUserId, userIdToFollow){
        try{
            const response = await fetch(`${BASE_URL}/${currentUserId}/unfollow/${userIdToFollow}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok){
                const errorText = await response.text();
                throw new Error(errorText);
            }
            return await response.json();
        }catch(error){
            throw error;
        }
}