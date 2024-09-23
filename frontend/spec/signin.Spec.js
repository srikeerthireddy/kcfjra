
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jasmine-dom';
import { BrowserRouter } from 'react-router-dom';
import SignIn from '../src/pages/SignIn';
import { AuthProvider } from '../src/context/AuthContext';

// Update API_URL based on your actual setup
const API_URL = window.location.origin.replace("3000", "5000");

describe('SignIn component tests', () => {
  beforeEach(() => {
    // Mock fetch globally to spy on it
    spyOn(window, "fetch").and.callFake((url, options) => {
      if (url.endsWith("/api/users/login") && options.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: "Registered Successfully", token: "fake-token" }),
        });
      }
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "An error occurred" }),
      });
    });
  });

  afterEach(() => {
    // Reset spy after each test
    window.fetch.calls.reset();
  });

  it('[REQ010]_renders_the_sign_in_form_with_email_and_password_fields', () => {
    render(
      <AuthProvider value={{ login: jasmine.createSpy('login') }}>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </AuthProvider>
    );
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByText('Sign In')).toBeTruthy();
  });

  it('[REQ011]_submits_form_with_all_fields_filled_and_sends_correct_data', async () => {
    // Mock the login function
    const mockLogin = jasmine.createSpy('login');

    render(
      <AuthProvider value={{ login: mockLogin }}>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </AuthProvider>
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "geekyjha@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "m789456123M@" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledWith(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "geekyjha@gmail.com",
          password: "m789456123M@"
        }),
      });
    });

   
  });
});
