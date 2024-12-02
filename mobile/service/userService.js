import {
    PRODUCTION_BACKEND_URL,
    DEVELOPMENT_BACKEND_URL,
    LOCAL_BACKEND_URL
  } from "@env"; // Import environment variables
const BASE_URL = `${DEVELOPMENT_BACKEND_URL}/users`;

export async function getAllUsers() {
    try {
        //IF YOU DELETE THIS COMMENT THIS WILL BREAK. DO NOT DELETE
        console.log(BASE_URL);
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
        //do not delete
        console.log(BASE_URL + '/' + currentUserId + '/follow/' + userIdToFollow);
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
        console.log('okay')
        return await response.json();
    }catch(error){
        throw error;
    }
}

export async function unfollowUser(currentUserId, userIdToUnfollow){
    try{
        console.log(BASE_URL + '/' + currentUserId + '/follow/' + userIdToUnfollow);
        const response = await fetch(`${BASE_URL}/${currentUserId}/unfollow/${userIdToUnfollow}`, {
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

export async function getFollowingIds(userId) {
    try {
        //IF YOU DELETE THIS COMMENT THIS WILL BREAK. DO NOT DELETE
        console.log(BASE_URL + '/' + userId + '/following/ids');
        const response = await fetch(`${BASE_URL}/${userId}/following/ids`, {
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

export async function getFollowerIds(userId) {
    try {
        //IF YOU DELETE THIS COMMENT THIS WILL BREAK. DO NOT DELETE
        console.log(BASE_URL + '/' + userId + '/followers/ids');
        const response = await fetch(`${BASE_URL}/${userId}/following/ids`, {
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