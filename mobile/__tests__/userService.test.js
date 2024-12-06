import { getAllUsers } from '../service/userService';

global.fetch = jest.fn(); // Mock the fetch API

describe('userService', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('getAllUsers should return a list of users', async () => {
        const mockUsers = [
            { id: 1, name: 'User One' },
            { id: 2, name: 'User Two' },
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockUsers),
        });

        const users = await getAllUsers();

        expect(fetch).toHaveBeenCalledWith(`${process.env.PRODUCTION_BACKEND_URL}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(users).toEqual(mockUsers);
    });

    it('getAllUsers should throw an error if the API response is not ok', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            text: jest.fn().mockResolvedValueOnce('Error fetching users'),
        });

        await expect(getAllUsers()).rejects.toThrow('Error fetching users');
    });
});
