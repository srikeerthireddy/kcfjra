
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jasmine-dom';
import FeedCard from "../src/components/Feed/FeedCard/FeedCard";
import { BrowserRouter } from "react-router-dom";

describe("FeedCard Component", () => {
    // Mock feed data
    const mockFeed = {
        id: 1,
        profileImg: "https://example.com/profile.jpg",
        username: "testuser",
        time: new Date().toISOString(),
        postImg: "https://example.com/post.jpg",
        caption: "Test Caption",
        likeCount: 1,
        commentCount: 0,
        likedByUserIds: [1], // The post is already liked by the current user
    };

    // Mock functions for like and unlike
    const mockOnLike = jasmine.createSpy("onLike");
    const mockOnUnlike = jasmine.createSpy("onUnlike");

    // Test case for liking a post
    it("[REQ041]_should_call_onLike_when_the_like_button_(empty heart icon)_is_clicked", () => {
        // Modify feed data to simulate the post being unliked initially
        const unlikedFeed = { ...mockFeed, likedByUserIds: [] };

        // Render the component with unliked feed
        render(
            <BrowserRouter>
                <FeedCard
                    feed={unlikedFeed}
                    onLike={mockOnLike}
                    onUnlike={mockOnUnlike}
                    currentUserId={1}
                />
            </BrowserRouter>

        );

        // Find the like button and empty heart icon using data-testid
        const likeButton = screen.getByTestId("like-button");
        const emptyHeart = screen.getByTestId("empty-heart");

        expect(emptyHeart).toBeTruthy(); // Check if the empty heart icon is rendered

        // Click the like button
        fireEvent.click(likeButton);

        // Expect the onLike function to have been called with the post ID
        expect(mockOnLike).toHaveBeenCalledWith(mockFeed.id);
    });

    // Test case for unliking a post
    it("[REQ042]_should_call_onUnlike_when_the_unlike_button_(filled heart icon)_is_clicked", () => {
        // Render the component with liked feed
        render(
            <BrowserRouter>
                <FeedCard
                    feed={mockFeed}
                    onLike={mockOnLike}
                    onUnlike={mockOnUnlike}
                    currentUserId={1}
                />
            </BrowserRouter>
        );

        // Find the unlike button and filled heart icon using data-testid
        const unlikeButton = screen.getByTestId("like-button");
        const filledHeart = screen.getByTestId("filled-heart");

        expect(filledHeart).toBeTruthy(); // Check if the filled heart icon is rendered

        // Click the unlike button
        fireEvent.click(unlikeButton);

        // Expect the onUnlike function to have been called with the post ID
        expect(mockOnUnlike).toHaveBeenCalledWith(mockFeed.id);
    });
});
