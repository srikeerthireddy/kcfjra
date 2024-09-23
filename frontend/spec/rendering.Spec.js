
// import React from "react";
// import { render, screen, waitFor, cleanup } from "@testing-library/react";
// import { BrowserRouter } from "react-router-dom";
// import App from "../src/App";
// import { AuthProvider } from "../src/context/AuthContext";
// import Modal from 'react-modal';

// describe("App Component", () => {
//     // Set up the modal root element before each test
//     beforeEach(() => {
//         // Create a div with id 'root' and append it to the document body
//         const root = document.createElement('div');
//         root.setAttribute('id', 'root');
//         document.body.appendChild(root);

//         // Set the app element to the newly created div
//         Modal.setAppElement(root);
//     });

//     afterEach(() => {
//         cleanup();
//         // Remove the root element after each test
//         const root = document.getElementById('root');
//         if (root) {
//             document.body.removeChild(root);
//         }
//         localStorage.removeItem('token'); // Clear localStorage after each test
//     });

//     it("REQ032_should_redirect_to_/signin_for_unauthenticated_users", async () => {
//         // Mock unauthenticated state
//         localStorage.removeItem('token'); // Ensure token is not set

//         // Render the App component with AuthProvider and BrowserRouter
//         render(
//             <AuthProvider>
//                 <BrowserRouter>
//                     <App />
//                 </BrowserRouter>
//             </AuthProvider>
//         );

//         // Wait for the SignIn component to be rendered
//         await waitFor(() => {
//             const signInPage = screen.getByText("Log In to see photos and videos from you friends");
//             expect(signInPage).toBeInTheDocument(); // Assert that SignIn page is displayed
//         });
//     });
// });
