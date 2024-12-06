import { fetchTrails, fetchTrailById, createTrail } from '../service/trailService';

global.fetch = jest.fn(); // Mock the fetch API

describe('trailService', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('fetchTrails should return a list of trails', async () => {
        const mockTrails = [{ id: 1, name: 'Trail 1' }, { id: 2, name: 'Trail 2' }];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockTrails),
        });

        const trails = await fetchTrails();
        expect(fetch).toHaveBeenCalledWith(`${process.env.PRODUCTION_BACKEND_URL}/trails`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(trails).toEqual(mockTrails);
    });

    it('fetchTrailById should return a trail by ID', async () => {
        const mockTrail = { id: 1, name: 'Trail 1' };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockTrail),
        });

        const trail = await fetchTrailById(1);
        expect(fetch).toHaveBeenCalledWith(`${process.env.PRODUCTION_BACKEND_URL}/trails/1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(trail).toEqual(mockTrail);
    });

    it('createTrail should create a new trail and return it', async () => {
        const mockFormData = { name: 'New Trail', length: 5 };
        const mockUserId = '123';
        const mockCreatedTrail = { id: 1, ...mockFormData };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockCreatedTrail),
        });

        const createdTrail = await createTrail(mockFormData, mockUserId);
        expect(fetch).toHaveBeenCalledWith(`${process.env.PRODUCTION_BACKEND_URL}/trails?ownerId=123`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockFormData),
        });
        expect(createdTrail).toEqual(mockCreatedTrail);
    });

    it('should throw an error if fetchTrails fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            text: jest.fn().mockResolvedValueOnce('Error fetching trails'),
        });

        await expect(fetchTrails()).rejects.toThrow('Error fetching trails');
    });

    it('should throw an error if fetchTrailById fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            text: jest.fn().mockResolvedValueOnce('Error fetching trail'),
        });

        await expect(fetchTrailById(1)).rejects.toThrow('Error fetching trail');
    });

    it('should throw an error if createTrail fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            text: jest.fn().mockResolvedValueOnce('Error creating trail'),
        });

        await expect(createTrail({ name: 'Trail' }, '123')).rejects.toThrow('Error creating trail');
    });
});
