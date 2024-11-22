import { PRODUCTION_BACKEND_URL } from "@env"; // Import environment variables
const BASE_URL = PRODUCTION_BACKEND_URL + "/users";

export async function followUser(currentUserId, userIdToFollow) {
    try {
        console.log('Follow User ' + PRODUCTION_BACKEND_URL);
        console.log('Follow User ' + BASE_URL);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 5 seconds timeout

        const response = await fetch(`${BASE_URL}/${currentUserId}/follow/${userIdToFollow}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log('Response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.log('Response error text:', errorText);
            throw new Error(errorText);
        }
        const responseData = await response.json();
        console.log('Response data:', responseData);
        return responseData;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Error in followUser: Request timed out');
        } else {
            console.error('Error in followUser:', error);
        }
        throw error;
    }
}