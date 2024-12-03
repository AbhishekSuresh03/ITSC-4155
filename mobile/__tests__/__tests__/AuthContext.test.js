import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, Button } from 'react-native'; // Import Text and Button
import { AuthContext, AuthProvider } from '../context/AuthContext';

describe('AuthContext', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('provides default values', () => {
        const TestComponent = () => (
            <AuthContext.Consumer>
                {(context) => (
                    <Text>
                        {context ? 'Has context' : 'No context'}
                    </Text>
                )}
            </AuthContext.Consumer>
        );

        const { getByText } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(getByText('Has context')).toBeTruthy();
    });

    it('allows login to update context', () => {
        const TestComponent = () => {
            const { login, user } = React.useContext(AuthContext);

            return (
                <>
                    <Text>{user ? `Logged in as ${user.username}` : 'Not logged in'}</Text>
                    <Button title="Login" onPress={() => login({ username: 'testuser' })} />
                </>
            );
        };

        const { getByText } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // Initially not logged in
        expect(getByText('Not logged in')).toBeTruthy();

        // Simulate login
        fireEvent.press(getByText('Login'));
        expect(getByText('Logged in as testuser')).toBeTruthy();
    });

    it('allows logout to clear context', () => {
        const TestComponent = () => {
            const { login, logout, user } = React.useContext(AuthContext);

            return (
                <>
                    <Text>{user ? `Logged in as ${user.username}` : 'Not logged in'}</Text>
                    <Button title="Login" onPress={() => login({ username: 'testuser' })} />
                    <Button title="Logout" onPress={logout} />
                </>
            );
        };

        const { getByText } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // Simulate login
        fireEvent.press(getByText('Login'));
        expect(getByText('Logged in as testuser')).toBeTruthy();

        // Simulate logout
        fireEvent.press(getByText('Logout'));
        expect(getByText('Not logged in')).toBeTruthy();
    });
});
