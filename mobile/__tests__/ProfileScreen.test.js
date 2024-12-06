import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../components/ProfileScreen';
import { AuthContext } from '../context/AuthContext';

const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    city: 'Charlotte',
    state: 'NC',
    profilePicture: 'https://example.com/profile.jpg',
    miles: 100,
};

const mockLogout = jest.fn();

const renderWithContext = (component) => {
    return render(
        <AuthContext.Provider value={{ user: mockUser, logout: mockLogout }}>
            {component}
        </AuthContext.Provider>
    );
};

describe('ProfileScreen', () => {
    it('renders the ProfileScreen correctly', () => {
        const { getByText } = renderWithContext(<ProfileScreen />);

        // Check for user details
        expect(getByText(`${mockUser.firstName} ${mockUser.lastName}`)).toBeTruthy();
        expect(getByText(`${mockUser.city}, ${mockUser.state}`)).toBeTruthy();

        // Check for year stats
        expect(getByText('2024 Stats')).toBeTruthy();
        expect(getByText('Activities')).toBeTruthy(); // Matches the "Activities" text
        expect(getByText('Miles')).toBeTruthy(); // Matches the "Miles" text
    });

    it('renders the correct tab content on tab change', () => {
        const { getByText } = renderWithContext(<ProfileScreen />);

        // Initially, the Feed tab should be active
        expect(getByText('Nothing from feed to currently display!')).toBeTruthy();

        // Switch to Activities tab
        fireEvent.press(getByText('Activities'));
        expect(getByText('No activities to display!')).toBeTruthy();
    });

    it('handles logout functionality', () => {
        const { getByText } = renderWithContext(<ProfileScreen />);

        // Simulate logout
        fireEvent.press(getByText('Logout')); // Ensure there's a "Logout" button or adjust if it's missing
        expect(mockLogout).toHaveBeenCalled();
    });
});
