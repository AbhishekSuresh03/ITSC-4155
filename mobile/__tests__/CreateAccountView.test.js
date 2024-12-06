import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import CreateAccountView from '../components/CreateAccountView';

jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: true })),
    MediaTypeOptions: {
        Images: 'Images',
        Videos: 'Videos',
    },
}));

jest.mock('../service/fileService', () => ({
    uploadProfilePic: jest.fn(() => Promise.resolve('mocked-download-url')),
}));

jest.mock('react-native-progress', () => {
    const { View } = require('react-native');
    return {
        Bar: () => <View />,
    };
});

describe('CreateAccountView', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders Pick a Profile Picture button when on step 5', async () => {
        const { getByText, queryByText } = render(<CreateAccountView navigation={{ navigate: jest.fn() }} />);
        const nextButton = getByText('Next');

        await act(async () => {
            for (let i = 0; i < 4; i++) {
                fireEvent.press(nextButton);
            }
        });

        const pickProfilePictureButton = queryByText('Pick a Profile Picture');
        expect(pickProfilePictureButton).toBeTruthy();
    });
});
