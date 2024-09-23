
import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import FeedCard from '../src/components/Feed/FeedCard/FeedCard';
import { BrowserRouter } from 'react-router-dom';

const API_URL = window.location.origin.replace("3000", "5000");

describe('FeedCard component comment functionality tests', () => {
  let container;
  let feed;
  let fetchSpy;

  beforeEach(() => {
    // Set up initial feed data
    feed = {
      id: 1,
      username: 'testuser',
      profileImg: 'test.jpg',
      postImg: 'post.jpg',
      caption: 'Test caption',
      time: new Date().toISOString(),
      likedByUserIds: [],
      likeCount: 0,
      commentCount: 0,
    };

    // Mock fetch globally
    spyOn(window, 'fetch').and.callFake((url, options) => {
      if (url.endsWith(`/api/posts/addComments`) && options.method === 'POST') {
        const body = JSON.parse(options.body);
        if (body.comment.trim() !== "") {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 2, content: body.comment, username: 'testuser' }),
          });
        }
      }
      return Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Invalid request' }),
      });
    });

    container = render(<BrowserRouter> <FeedCard feed={feed} currentUserId="currentUserId" />
    </BrowserRouter>);
  });

  afterEach(() => {
    cleanup();
    window.fetch.calls.reset();
  });

  it('[REQ047]_should_add_a_new_comment_when_post_button_is_clicked_with_non_empty_input', async () => {
    const { getByPlaceholderText, getByText } = container;

    // Enter a new comment
    const commentInput = getByPlaceholderText('Add a Comment ....');
    fireEvent.change(commentInput, { target: { value: 'New comment' } });

    // Click the Post button
    const postButton = getByText('Post');
    fireEvent.click(postButton);

    // Wait for the new comment to be added
    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledWith(`${API_URL}/api/posts/addComments`, jasmine.objectContaining({
        method: 'POST',
        headers: jasmine.objectContaining({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }),
        body: jasmine.stringMatching(JSON.stringify({
          postId: feed.id,
          comment: 'New comment',
        })),
      }));
    });

  });

  it('[REQ048]_should_not_make_an_api_call_when_the_comment_is_empty', () => {
    const { getByPlaceholderText, getByText } = container;

    // Enter an empty comment
    const commentInput = getByPlaceholderText('Add a Comment ....');
    fireEvent.change(commentInput, { target: { value: '   ' } });

    // Click the Post button
    const postButton = getByText('Post');
    fireEvent.click(postButton);

    // Assert that fetch API was not called
    expect(window.fetch).not.toHaveBeenCalled();

    // Assert that the comment input is not cleared
    expect(commentInput.value).toBe('   ');
  });
});
