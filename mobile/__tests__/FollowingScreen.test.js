import React from 'react';
import { render } from '@testing-library/react-native';
import FollowingScreen from '../components/FollowingScreen';

describe('FollowingScreen', () => {
    it('renders the FollowingScreen correctly', () => {
        const { getByText } = render(<FollowingScreen />);

        // Check for the header or specific text
        expect(getByText('Following Screen')).toBeTruthy(); // Updated to match actual text
    });
});
