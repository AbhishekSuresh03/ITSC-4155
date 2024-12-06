import React from 'react';
import { render } from '@testing-library/react-native';
import LocalScreen from '../components/LocalScreen';

describe('LocalScreen', () => {
    it('renders the LocalScreen correctly', () => {
        const { getByText } = render(<LocalScreen />);

        // Check if "Local Screen" text is rendered
        expect(getByText('Local Screen')).toBeTruthy();
    });
});
