
import React from 'react';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import ProfileHeader from '../src/components/Profile/ProfileHeader';
import { BrowserRouter } from 'react-router-dom';

const API_URL = window.location.origin.replace("3000", "5000");

describe('ProfileHeader component tests', () => {
    let container;
    let mockUser;
    let mockUpdateNewPost;

    beforeEach(() => {
        // Setup mock user data
        mockUser = {
            id: 1,
            followers: [{ id: 2 }],
            following: [],
        };
        mockUpdateNewPost = jasmine.createSpy('updateNewPost');

        // Set localStorage ID to match the user ID
        localStorage.setItem("id", mockUser.id);
        localStorage.setItem("token", "mock-token");

        // Mock fetch globally
        spyOn(window, 'fetch').and.callFake((url, options) => {
            if (url.endsWith('/api/users/profile/photo') && options.method === 'DELETE') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({}),
                });
            }
            return Promise.resolve({
                ok: false,
                status: 400,
                json: () => Promise.resolve({ error: 'Invalid request' }),
            });
        });

        // Render the component
        container = render(
            <BrowserRouter>
                <ProfileHeader
                    username="Test User"
                    postCount={5}
                    user={mockUser}
                    updateNewPost={mockUpdateNewPost}
                />
            </BrowserRouter>
        );
    });

    afterEach(() => {
        cleanup();
        window.fetch.calls.reset();

    });

    it('[REQ0068]_should_display_the_ProfilePicModal_when_the_profile_picture_is_clicked', () => {
        const { getByAltText, queryByText } = container;

        // Click the profile picture to open the modal
        const profilePic = getByAltText('');
        fireEvent.click(profilePic);

        // Check if the modal is displayed
        expect(queryByText('Upload New Photo')).not.toBeNull();
        expect(queryByText('Remove Current Photo')).not.toBeNull();
        expect(queryByText('Cancel')).not.toBeNull();
    });

    it('[REQ0069]_should_call_RemoveProfilePhotoInDatabase_when_the_Remove_Current_Photo_button_is_clicked', async () => {
        const { getByAltText, getByText } = container;

        // Click the profile picture to open the modal
        const profilePic = getByAltText('');
        fireEvent.click(profilePic);

        // Click the Remove Current Photo button
        const removePhotoButton = getByText('Remove Current Photo');
        fireEvent.click(removePhotoButton);

        // Wait for the fetch call to be made and assert the correct call parameters
        await waitFor(() => {
            expect(window.fetch).toHaveBeenCalledWith(`${API_URL}/api/users/profile/photo`, jasmine.objectContaining({
                method: 'DELETE',
                headers: jasmine.objectContaining({
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }),
            }));
        });
    });
});
