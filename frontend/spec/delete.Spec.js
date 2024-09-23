
import '../src/setupModalsTests';
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import ProfilePosts from '../src/components/Profile/ProfilePosts';
import Modal from 'react-modal';

const API_URL = window.location.origin.replace("3000", "5000");

describe('ProfilePosts component tests', () => {
    let container;
    let mockUpdateNewPost;
    let updateNewPost;
    let posts;
    let user;

    beforeEach(() => {
        // Create a div with id 'root' and append it to the document body
        const root = document.createElement('div');
        root.setAttribute('id', 'root');
        document.body.appendChild(root);

        // Set the app element to the newly created div
        Modal.setAppElement(root);

        mockUpdateNewPost = jasmine.createSpy('mockUpdateNewPost');
        updateNewPost = jasmine.createSpy('updateNewPost');

        // Mock fetch globally
        spyOn(window, 'fetch').and.callFake((url, options) => {
            if (url.endsWith(`/api/posts/delete/1`) && options.method === 'DELETE') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true }),
                });
            }
            return Promise.resolve({
                ok: false,
                status: 500,
                json: () => Promise.resolve({ error: 'An error occurred' }),
            });
        });

        // Mock posts and user data
        posts = [
            { id: 1, image: 'image1.jpg' },
            { id: 2, image: 'image2.jpg' }
        ];
        user = { id: 1 }; // Simulate the logged-in user

        container = render(<ProfilePosts posts={posts} updateNewPost={mockUpdateNewPost} user={user} />);
    });

    afterEach(() => {
        cleanup();
        // Remove the 'root' element after each test
        const root = document.getElementById('root');
        if (root) {
            document.body.removeChild(root);
        }
        window.fetch.calls.reset();
    });

    it('[REQ055]_should_open_the_delete_modal_when_delete_icon_is_clicked', () => {
        const { getByAltText, queryByTestId } = container;

        // Simulate localStorage for the logged-in user
        localStorage.setItem('id', '1');

        // Find the delete icon for the first post and click it
        const deleteIcon = getByAltText('Post 1').parentNode.querySelector('.group-hover\\:opacity-100');
        fireEvent.click(deleteIcon);

        // Verify that the delete modal is opened
        const modal = document.querySelector('.ReactModal__Content');
        expect(modal).toBeTruthy();
    });

    it('[REQ056]_should_delete_post_when_confirm_button_in_modal_is_clicked', async () => {
        const { getByAltText, getByText } = container;

        // Simulate localStorage for the logged-in user
        localStorage.setItem('id', '1');

        // Open the delete modal
        const deleteIcon = getByAltText('Post 1').parentNode.querySelector('.group-hover\\:opacity-100');
        fireEvent.click(deleteIcon);

        // Click the "Yes" button in the modal
        const confirmButton = getByText('Yes');
        fireEvent.click(confirmButton);

        // Wait for fetch to be called and modal to close
        await waitFor(() => {
            // Ensure fetch was called with correct parameters
            expect(window.fetch).toHaveBeenCalledWith(
                jasmine.stringMatching('/api/posts/delete/1'),
                jasmine.objectContaining({
                    method: 'DELETE',
                    headers: jasmine.objectContaining({
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    }),
                })
            );
        });

        // Verify that updateNewPost was called to refresh the posts
        expect(mockUpdateNewPost).toHaveBeenCalled();
    });

    it('[REQ057]_should_close_the_delete_modal_when_cancel_button_is_clicked', async () => {
        const { getByAltText, getByText } = container;

        // Simulate localStorage for the logged-in user
        localStorage.setItem('id', '1');

        // Open the delete modal
        const deleteIcon = getByAltText('Post 1').parentNode.querySelector('.group-hover\\:opacity-100');

        fireEvent.click(deleteIcon);

        // Wait for the modal to open
        await waitFor(() => {
            const modal = document.querySelector('.ReactModal__Content');
            expect(modal).toBeTruthy();  // Verify modal is open
        });

        // Now find and click the Cancel button
        const cancelButton = await waitFor(() => getByText('Cancel'));

        fireEvent.click(cancelButton);

        // Wait for the modal to close
        await waitFor(() => {
            const modal = document.querySelector('.ReactModal__Content');
            expect(modal).toBeFalsy();  // Verify modal is closed
        });
    });

});
