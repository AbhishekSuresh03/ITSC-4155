import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import { Text, TouchableOpacity } from 'react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
}));

describe('AuthContext', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('allows login to update context', async () => {
        const TestComponent = () => {
            const { user, login } = React.useContext(AuthContext);
            return (
                <>
                    <Text>{user ? `Logged in as ${user.username}` : 'Not logged in'}</Text>
                    <TouchableOpacity onPress={() => login({ username: 'testuser' })}>
                        <Text>Login</Text>
                    </TouchableOpacity>
                </>
            );
        };

        const { getByText } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(getByText('Not logged in')).toBeTruthy();

        await act(async () => {
            fireEvent.press(getByText('Login'));
        });

        expect(getByText('Logged in as testuser')).toBeTruthy();
    });

    it('allows logout to clear context', async () => {
        const TestComponent = () => {
            const { user, login, logout } = React.useContext(AuthContext);
            return (
                <>
                    <Text>{user ? `Logged in as ${user.username}` : 'Not logged in'}</Text>
                    <TouchableOpacity onPress={() => login({ username: 'testuser' })}>
                        <Text>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logout}>
                        <Text>Logout</Text>
                    </TouchableOpacity>
                </>
            );
        };

        const { getByText } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await act(async () => {
            fireEvent.press(getByText('Login'));
        });
        expect(getByText('Logged in as testuser')).toBeTruthy();

        await act(async () => {
            fireEvent.press(getByText('Logout'));
        });
        expect(getByText('Not logged in')).toBeTruthy();
    });
});
