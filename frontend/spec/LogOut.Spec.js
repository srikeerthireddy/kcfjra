
// Import setupTests.js to ensure the #root element is available
import '../src/setupModalsTests';
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jasmine-dom';
import AppLayout from '../src/pages/AppLayout';
import LogoutModal from '../src/components/LogOut/LogOut';
import { AuthProvider } from '../src/context/AuthContext';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter


describe('AppLayout Component', () => {
  let closeModal;
  let onConfirm;

  beforeEach(() => {
    closeModal = jasmine.createSpy('closeModal');
    onConfirm = jasmine.createSpy('onConfirm');

    // Render the AppLayout with the mock context
    render(
      <AuthProvider value={{ logout: jasmine.createSpy('logout') }}>
        <MemoryRouter> {/* Wrap with MemoryRouter */}
          <AppLayout />
        </MemoryRouter>
      </AuthProvider>
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('[REQ0033]_shows_logout_modal_after_logout_button_click', async () => {
    // Click the logout button
    const logoutButton = screen.getByText('Log Out');
    expect(logoutButton).toBeTruthy();
    fireEvent.click(logoutButton);
  
    // Add a log to check if the logout button was clicked
    console.log('Logout button clicked');
  
    // Check if the LogoutModal is rendered
    await waitFor(() => {
      const modalTitle = screen.getByText('Confirm Logout');
      console.log('Modal title found:', modalTitle);
      expect(modalTitle).toBeTruthy();
    });
  
    // Optionally, log the entire document body for further inspection
    console.log(document.body.innerHTML);
  });
});




describe('LogoutModal Component', () => {
  let closeModal;
  let onConfirm;

  beforeEach(() => {
    closeModal = jasmine.createSpy('closeModal');
    onConfirm = jasmine.createSpy('onConfirm');
  });

  afterEach(() => {
    cleanup();
  });

  it('[REQ0034]_calls_onConfirm_when_the_Logout_button_is_clicked', async () => {
    render(<LogoutModal onClose={closeModal} onConfirm={onConfirm} />);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalled();
    });
  });

  it('[REQ0035]_calls_onClose_when_the_Cancel_button_is_clicked', async () => {
    render(<LogoutModal onClose={closeModal} onConfirm={onConfirm} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it('[REQ0036]_calls_onClose_when_the_modal_close_button_is_clicked', async () => {
    render(<LogoutModal onClose={closeModal} onConfirm={onConfirm} />);

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });
});
