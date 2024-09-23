
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jasmine-dom";
import { BrowserRouter } from "react-router-dom";
import SignUp from "../src/pages/SignUp";
const API_URL = window.location.origin.replace("3000", "5000");
import { GoogleOAuthProvider } from "@react-oauth/google";

describe("SignUp component tests", () => {
  beforeEach(() => {
    // Mock fetch globally to spy on it
    spyOn(window, "fetch").and.callFake((url, options) => {
      if (url.endsWith("/api/users/register") && options.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: "Registered Successfully" }),
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


  it("[REQ001]_renders_SignUp_form_with_all_necessary_fields", () => {
    render(
      <GoogleOAuthProvider>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </GoogleOAuthProvider>

    );

    expect(screen.getByPlaceholderText(/Full Name/i)).toBeTruthy(); // Use .toBeTruthy() instead of .toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Email/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Username/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Password/i)).toBeTruthy();
  });



  it("[REQ002]_register_new_user_and_displays_success_message", async () => {
    render(
      <GoogleOAuthProvider>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </GoogleOAuthProvider>
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "geekyjha@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: "johndoe" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "m789456123M@" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Wait for the registration to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Assert that the success message is displayed
    expect(screen.getByText("Registered Successfully")).toBeTruthy();
  });

  it("[REQ006]_submits_form_with_all_fields_filled_and_sends_correct_data", async () => {
    render(
      <GoogleOAuthProvider>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </GoogleOAuthProvider>
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "geekyjha@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: "johndoe" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "m789456123M@" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Wait for the form submission to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Assert that fetch was called with the correct data
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "johndoe",
        fullname: "John Doe",
        email: "geekyjha@gmail.com",
        password: "m789456123M@",

      }),
    });
  });
  it("[REQ007]__display_an_error_message_for_invalid_password", async () => {
    render(
      <GoogleOAuthProvider>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </GoogleOAuthProvider>
    );


    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "geekyjha@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: "johndoe" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "short" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Wait for the form submission to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Assert that the success message is displayed
    expect(screen.getByText("Password must contain at least 8 characters, including at least 1 number and 1 includes both lower and uppercase letters and special characters for example #,?,!")).toBeTruthy();
  });

});
