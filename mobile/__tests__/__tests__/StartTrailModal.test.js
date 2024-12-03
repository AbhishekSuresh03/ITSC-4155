import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import StartTrailModalScreen from '../components/StartTrailModal';
import { AuthContext } from '../context/AuthContext';
import { createTrail } from '../service/trailService';

// Mock navigation
const mockNavigation = {
    goBack: jest.fn(),
};

// Mock services
jest.mock('../service/fileService', () => ({
    uploadTrailPic: jest.fn(() => Promise.resolve('mockImageURL')),
}));

jest.mock('../service/trailService', () => ({
    createTrail: jest.fn(() => Promise.resolve()),
}));

describe('StartTrailModalScreen', () => {
    it('submits the form correctly', async () => {
        const { getByText, getByPlaceholderText } = render(
            <AuthContext.Provider value={{ user: { id: '123', username: 'testuser' } }}>
                <StartTrailModalScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        );

        // Fill in the form inputs
        fireEvent.changeText(getByPlaceholderText('Name'), 'Trail Name');
        fireEvent.changeText(getByPlaceholderText('City'), 'Charlotte');
        fireEvent.changeText(getByPlaceholderText('State'), 'NC');
        fireEvent.changeText(getByPlaceholderText('Rating'), '4.5');
        fireEvent.changeText(getByPlaceholderText('Difficulty'), 'Easy');
        fireEvent.changeText(getByPlaceholderText('Length'), '2.5');
        fireEvent.changeText(getByPlaceholderText('Time'), '1.5');
        fireEvent.changeText(getByPlaceholderText('Pace'), '1.2');
        fireEvent.changeText(getByPlaceholderText('Description'), 'Nice trail.');

        // Submit the form
        await act(async () => {
            fireEvent.press(getByText('Create Trail'));
        });

        // Verify the mock functions
        expect(createTrail).toHaveBeenCalledWith(expect.any(Object), '123');
        expect(mockNavigation.goBack).toHaveBeenCalled();
    });
});
