import React from 'react';
import { render } from '@testing-library/react-native';
import { AuthContext } from '../context/AuthContext';
import SavedScreen from '../components/SavedScreen';

// this needs to just be updated to accomodate new savedscreen
describe('SavedScreen', () => {
    it('renders the static content correctly', () => {
        const { getByText } = render(
            <AuthContext.Provider value={{ user: null }}>
                <SavedScreen />
            </AuthContext.Provider>
        );

        // Static content
        expect(getByText('This is the saved screen')).toBeTruthy();
        expect(
            getByText(
                'To access user information, use the AuthContext. Reference the JS to see how its utilized'
            )
        ).toBeTruthy();
    });

    it('displays "Please log in" when user is not logged in', () => {
        const { getByText } = render(
            <AuthContext.Provider value={{ user: null }}>
                <SavedScreen />
            </AuthContext.Provider>
        );

        expect(getByText('Please log in')).toBeTruthy();
    });

    it('displays the username when the user is logged in', () => {
        const { getByText } = render(
            <AuthContext.Provider value={{ user: { username: 'JohnDoe' } }}>
                <SavedScreen />
            </AuthContext.Provider>
        );

        expect(getByText('Welcome JohnDoe')).toBeTruthy();
    });
});
