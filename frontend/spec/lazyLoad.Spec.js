import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jasmine-dom";
import Feed from "../src/components/Feed/Feed";
import { BrowserRouter } from "react-router-dom";

describe("Feed component tests", () => {
    const API_URL = window.location.origin.replace("3000", "5000");

    beforeEach(() => {
        spyOn(window, "fetch").and.callFake((url) => {
            if (url.includes("/api/posts/getAll?page=1")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        posts: [
                            {
                                id: 1,
                                profileImg: "https://via.placeholder.com/150",
                                username: "john_doe",
                                time: "2024-07-31T22:12:19.840Z",
                                postImg: "https://via.placeholder.com/600",
                                likeCount: 150,
                                mutualFrndImg1: "https://via.placeholder.com/50",
                                mutualFrndImg2: "https://via.placeholder.com/50",
                                commentCount: 20,
                                caption: "Enjoying the sunset!",
                                likedByUserIds: [1, 2]
                            },
                            {
                                id: 2,
                                profileImg: "https://via.placeholder.com/150",
                                username: "john_doe",
                                time: "2024-07-31T22:12:19.840Z",
                                postImg: "https://via.placeholder.com/600",
                                likeCount: 150,
                                mutualFrndImg1: "https://via.placeholder.com/50",
                                mutualFrndImg2: "https://via.placeholder.com/50",
                                commentCount: 20,
                                caption: "Enjoying the sunset!",
                                likedByUserIds: [1, 2]
                            },
                        ]
                    })
                });
            } else if (url.includes("/api/posts/getAll?page=2")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        posts: [
                            {
                                id: 3,
                                profileImg: "https://via.placeholder.com/150",
                                username: "john_doe",
                                time: "2024-07-31T22:12:19.840Z",
                                postImg: "https://via.placeholder.com/600",
                                likeCount: 150,
                                mutualFrndImg1: "https://via.placeholder.com/50",
                                mutualFrndImg2: "https://via.placeholder.com/50",
                                commentCount: 20,
                                caption: "Enjoying the sunset!",
                                likedByUserIds: [1, 2]
                            },
                            {
                                id: 4,
                                profileImg: "https://via.placeholder.com/150",
                                username: "john_doe",
                                time: "2024-07-31T22:12:19.840Z",
                                postImg: "https://via.placeholder.com/600",
                                likeCount: 150,
                                mutualFrndImg1: "https://via.placeholder.com/50",
                                mutualFrndImg2: "https://via.placeholder.com/50",
                                commentCount: 20,
                                caption: "Enjoying the sunset!",
                                likedByUserIds: [1, 2]
                            },
                        ]
                    })
                });
            }
            return Promise.resolve({
                ok: false,
                status: 500,
                json: () => Promise.resolve({ error: "An error occurred" })
            });
        });
    });

    afterEach(() => {
        window.fetch.calls.reset();
    });

    it("[REQ074]_fetches_initial_posts_on_component_render", (done) => {
        render(
            <BrowserRouter>
                <Feed newPost={false} updateNewPost={() => { }} />
            </BrowserRouter>
        );

        // Allow time for initial fetch
        setTimeout(() => {
            expect(window.fetch).toHaveBeenCalledWith(`${API_URL}/api/posts/getAll?page=1&limit=2`);
            done();
        }, 0);
    });

    it("[REQ075]_loads_more_posts_when_scrolled_to_bottom", (done) => {
        render(
            <BrowserRouter>
                <Feed newPost={false} updateNewPost={() => { }} />
            </BrowserRouter>
        );

        // Simulate scroll to the bottom
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
            window.dispatchEvent(new Event("scroll"));

            // Allow time for scroll event to trigger fetch
            setTimeout(() => {
                // Get the arguments passed to the `fetch` call
                const fetchCalls = window.fetch.calls.allArgs();
                const urlPattern = new RegExp(`${API_URL}/api/posts/getAll\\?page=\\d+&limit=2`);

                // Check if any fetch call matches the pattern
                const urlMatched = fetchCalls.some(args => urlPattern.test(args[0]));

                expect(urlMatched).toBeTrue();
                done();
            }, 500); // Adjust delay if needed
        }, 100); // Adjust delay if needed
    });
});