
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jasmine-dom'; // for additional matchers
import { BrowserRouter } from 'react-router-dom';
import CompleteProfile from '../src/components/GoogleLogin/CompleteProfile';

// Mock API URL globally
const API_URL = window.location.origin.replace('3000', '5000');

describe('CompleteProfile component tests', () => {
    beforeEach(() => {
        // Mock fetch globally to spy on it
        spyOn(window, 'fetch').and.callFake((url, options) => {
            if (url.endsWith('/api/users/complete-profile') && options.method === 'POST') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ message: 'Profile completed successfully' }),
                });
            }
            return Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: 'An error occurred' }),
            });
        });
    });

    afterEach(() => {
        // Reset spy after each test
        window.fetch.calls.reset();
    });

    it('[REQ072]_renders_CompleteProfile_form_with_username_input_and_submit_button', () => {
        render(
            <BrowserRouter>
                <CompleteProfile />
            </BrowserRouter>
        );

        // Check if the username input field is in the document
        expect(screen.getByPlaceholderText(/Enter your username/i)).toBeTruthy();
        // Check if the submit button is in the document
        expect(screen.getByText(/Complete Profile/i)).toBeTruthy();
    });


    it('[REQ073]_submits_form_and_sends_correct_data', async () => {
        render(
            <BrowserRouter>
                <CompleteProfile />
            </BrowserRouter>
        );

        // Set a value for the username input
        fireEvent.change(screen.getByPlaceholderText(/Enter your username/i), { target: { value: 'testuser' } });

        // Submit the form
        fireEvent.click(screen.getByText(/Complete Profile/i));

        // Wait for the form submission to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Assert that fetch was called with the correct data
        expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/users/complete-profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: parseInt(localStorage.getItem('id')), // ID from localStorage
                username: 'testuser',
            }),
        });
    });
});
