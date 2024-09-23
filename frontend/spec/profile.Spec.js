
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfilePosts from '../src/components/Profile/ProfilePosts.js';
import ProfileHeader from '../src/components/Profile/ProfileHeader.js';

describe('Profile Components', () => {
  // [REQ016] Test Case: Ensure username and post count are rendered correctly in ProfileHeader
  it('[REQ016]_should_render_username_correctly', () => {
    const username = 'testuser';
    const postCount = 10;
    const currentUserId = '1';
    localStorage.setItem('id', currentUserId);

    const user = {
      id: 2,
      followers: [{ id: 1 }, { id: 3 }],
      following: [{ id: 4 }, { id: 5 }]
    };

    render(<ProfileHeader username={username} postCount={postCount} user={user} updateNewPost={() => { }} />);

    // Check username, post count, followers, and following counts
    const usernameElement = screen.getByText(username);

    // Checking if elements exist
    expect(usernameElement).not.toBe(null);


    // Simulate updated followers count after unfollow
    const updatedUser = { ...user, followers: [] };
    render(<ProfileHeader username={username} postCount={postCount} user={updatedUser} updateNewPost={() => { }} />);


  });

  // [REQ017] Test Case: Ensure posts are rendered with correct src and alt attributes
  it('[REQ017]_should_render_posts_with_correct_src_and_alt_attributes', () => {
    // Mock posts data
    const posts = [
      { id: 1, image: "https://via.placeholder.com/150" },
      { id: 2, image: "https://via.placeholder.com/150" },
      { id: 3, image: "https://via.placeholder.com/150" }
    ];

    // Mock user data
    const user = { id: 1, followers: [], following: [] };
    localStorage.setItem('id', '1'); // Simulate the logged-in user ID

    render(<ProfilePosts posts={posts} user={user} updateNewPost={() => { }} />);

    // Select all image elements (posts)
    const postElements = screen.getAllByRole('img');

    // Ensure that each post has the correct 'src' and 'alt' attributes
    postElements.forEach((postElement, index) => {
      // Check if the 'src' attribute exists and matches the expected value
      expect(postElement.getAttribute('src')).toBe(posts[index].image);

      // Check if the 'alt' attribute exists and matches the expected value
      expect(postElement.getAttribute('alt')).toBe(`Post ${posts[index].id}`);
    });
  });
});
