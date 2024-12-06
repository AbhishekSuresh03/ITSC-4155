import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TrailDetailModal from '../components/TrailDetailModal';

const mockTrail = {
    name: 'Blue Ridge Trail',
    primaryImage: 'https://example.com/trail.jpg',
    owner: {
        username: 'hiker123',
        profilePicture: 'https://example.com/profile.jpg',
    },
    rating: 4.5,
    length: '5 miles',
    time: '2 hours',
    pace: '2.5 mph',
    difficulty: 'Moderate',
    description: 'A scenic trail with beautiful views.',
};

describe('TrailDetailModal', () => {
    it('renders correctly when visible', () => {
        const { getByText, getByTestId } = render(
            <TrailDetailModal visible={true} onClose={jest.fn()} trail={mockTrail} />
        );

        // Check if trail information is displayed
        expect(getByText('Blue Ridge Trail')).toBeTruthy();
        expect(getByText('hiker123')).toBeTruthy();
        expect(getByText('Length: 5 miles')).toBeTruthy();
        expect(getByText('Time: 2 hours')).toBeTruthy();
        expect(getByText('Pace: 2.5 mph')).toBeTruthy();
        expect(getByText('difficulty: Moderate')).toBeTruthy();
        expect(getByText('A scenic trail with beautiful views.')).toBeTruthy();
    });

    it('does not render when not visible', () => {
        const { queryByText } = render(
            <TrailDetailModal visible={false} onClose={jest.fn()} trail={mockTrail} />
        );

        // Modal should not render
        expect(queryByText('Blue Ridge Trail')).toBeNull();
    });

    it('calls onClose when close button is pressed', () => {
        const onCloseMock = jest.fn();

        const { getByText } = render(
            <TrailDetailModal visible={true} onClose={onCloseMock} trail={mockTrail} />
        );

        // Locate the close button by the "close" icon text
        const closeButton = getByText(''); // Unicode value for the close icon
        fireEvent.press(closeButton);

        expect(onCloseMock).toHaveBeenCalled();
    });

});
