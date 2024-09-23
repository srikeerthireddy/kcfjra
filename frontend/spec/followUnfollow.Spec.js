import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ProfileHeader from '../src/components/Profile/ProfileHeader';  // Adjust the import path as necessary

describe('ProfileHeader Follow/Unfollow functionality tests', () => {
    let container;
    let mockUpdateNewPost;
    let user;

    beforeEach(() => {
        mockUpdateNewPost = jasmine.createSpy('mockUpdateNewPost');

        // Mock localStorage for the current user ID
        localStorage.setItem('id', '1'); // Assume current user ID is 1
        localStorage.setItem('token', 'dummy-token'); // Add token to simulate authentication

        // Mock fetch globally for follow/unfollow actions
        spyOn(window, 'fetch').and.callFake((url, options) => {
            if (url.endsWith('/follow/2')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ message: 'Followed successfully' }),
                });
            }
            if (url.endsWith('/unfollow/2')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ message: 'Unfollowed successfully' }),
                });
            }
            return Promise.reject('API endpoint not found');
        });

        // Mock user object where the current user (ID 1) is not following this user (ID 2)
        user = {
            id: 2, // Profile belongs to user with ID 2
            followers: [], // Empty followers list (not followed by current user)
            following: [],
        };

        container = render(<ProfileHeader username="testuser" postCount={10} user={user} updateNewPost={mockUpdateNewPost} />);
    });

    afterEach(() => {
        window.fetch.calls.reset();
    });

    it('[REQ064]_should_follow_the_user_when_follow_button_is_clicked', async () => {
        const { getByText } = container;

        // Find the follow button and click it
        const followButton = getByText('Follow');
        fireEvent.click(followButton);

        // Verify that the correct API call is made
        await waitFor(() => {
            expect(window.fetch).toHaveBeenCalledWith(
                jasmine.stringMatching('/api/users/follow/2'),
                jasmine.objectContaining({
                    method: 'POST',
                    headers: jasmine.objectContaining({
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }),
                })
            );
        });

        // Verify that the button text changes to 'Unfollow'
        await waitFor(() => {
            const unfollowButton = getByText('Unfollow');
            expect(unfollowButton).toBeTruthy();
        });

        // Verify that updateNewPost is called after following
        expect(mockUpdateNewPost).toHaveBeenCalled();
    });

    it('[REQ065]_should_unfollow_the_user_when_unfollow_button_is_clicked', async () => {
        // Re-render the component, but this time set the user as already followed
        user.followers = [{ id: 1 }]; // Current user is already a follower
        container = render(<ProfileHeader username="testuser" postCount={10} user={user} updateNewPost={mockUpdateNewPost} />);

        const { getByText } = container;

        // Find the unfollow button and click it (user is currently followed)
        const unfollowButton = getByText('Unfollow');
        fireEvent.click(unfollowButton);

        // Verify that the correct API call is made
        await waitFor(() => {
            expect(window.fetch).toHaveBeenCalledWith(
                jasmine.stringMatching('/api/users/unfollow/2'),
                jasmine.objectContaining({
                    method: 'POST',
                    headers: jasmine.objectContaining({
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }),
                })
            );
        });

        // Verify that the button text changes back to 'Follow'
        await waitFor(() => {
            const followButton = getByText('Follow');
            expect(followButton).toBeTruthy();
        });

        // Verify that updateNewPost is called after unfollowing
        expect(mockUpdateNewPost).toHaveBeenCalled();
    });
});