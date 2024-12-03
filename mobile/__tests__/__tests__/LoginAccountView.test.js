import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer'; // Import act
import { AuthContext } from '../context/AuthContext';
import LoginAccountView from '../components/LoginAccountView';
import { loginUser } from '../service/authService';

jest.mock('../service/authService', () => ({
    loginUser: jest.fn(() => Promise.resolve({ username: 'mockUser' })),
}));

describe('LoginAccountView', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('calls handleLogin when submit is pressed', async () => {
        const mockLogin = jest.fn();
        const { getByPlaceholderText, getByText } = render(
            <AuthContext.Provider value={{ login: mockLogin }}>
                <LoginAccountView navigation={{ navigate: jest.fn() }} />
            </AuthContext.Provider>
        );

        const usernameInput = getByPlaceholderText('User Name');
        const passwordInput = getByPlaceholderText('Password');
        const submitButton = getByText('Submit');

        fireEvent.changeText(usernameInput, 'mockUser');
        fireEvent.changeText(passwordInput, 'mockPassword');

        await act(async () => {
            fireEvent.press(submitButton);
        });

        expect(loginUser).toHaveBeenCalledWith('mockUser', 'mockPassword');
        expect(mockLogin).toHaveBeenCalled();
    });
});
