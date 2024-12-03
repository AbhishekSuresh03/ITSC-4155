import { uploadProfilePic, uploadTrailPic } from '../service/fileService';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

jest.mock('../firebaseConfig', () => ({
    storage: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(),
}));

global.fetch = jest.fn();


describe('fileService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('uploadProfilePic', () => {
        it('uploads a profile picture and returns the download URL', async () => {
            const uri = 'file://mock-profile-pic.jpg';
            const blob = new Blob(['mockBlob'], { type: 'image/jpeg' });
            const mockDownloadURL = 'https://mock-storage-url.com/mock-profile-pic.jpg';

            // Mock fetch and Firebase functions
            fetch.mockResolvedValueOnce({ blob: jest.fn().mockResolvedValue(blob) });
            ref.mockReturnValueOnce({});
            uploadBytes.mockResolvedValueOnce();
            getDownloadURL.mockResolvedValueOnce(mockDownloadURL);

            const result = await uploadProfilePic(uri);

            // Assert the storage path and return value
            expect(ref).toHaveBeenCalledWith(storage, expect.stringMatching(/^profile_pics\/.*mock-profile-pic.jpg$/));
            expect(uploadBytes).toHaveBeenCalledWith({}, blob);
            expect(getDownloadURL).toHaveBeenCalledWith({});
            expect(result).toBe(mockDownloadURL);
        });
    });

    describe('uploadTrailPic', () => {
        it('uploads a trail picture and returns the download URL', async () => {
            const uri = 'file://mock-trail-pic.jpg';
            const blob = new Blob(['mockBlob'], { type: 'image/jpeg' });
            const mockDownloadURL = 'https://mock-storage-url.com/mock-trail-pic.jpg';

            // Mock fetch and Firebase functions
            fetch.mockResolvedValueOnce({ blob: jest.fn().mockResolvedValue(blob) });
            ref.mockReturnValueOnce({});
            uploadBytes.mockResolvedValueOnce();
            getDownloadURL.mockResolvedValueOnce(mockDownloadURL);

            const result = await uploadTrailPic(uri);

            // Assert the storage path and return value
            expect(ref).toHaveBeenCalledWith(storage, expect.stringMatching(/^trail_pics\/.*mock-trail-pic.jpg$/));
            expect(uploadBytes).toHaveBeenCalledWith({}, blob);
            expect(getDownloadURL).toHaveBeenCalledWith({});
            expect(result).toBe(mockDownloadURL);
        });
    });
});
