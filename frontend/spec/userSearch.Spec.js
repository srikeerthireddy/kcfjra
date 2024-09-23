
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserSearch from '../src/components/UserSearch/UserSearch';

describe('UserSearch Component', () => {
  let mockFetch;

  beforeEach(() => {
    // Spy on fetch and mock different responses per test
    mockFetch = spyOn(window, 'fetch').and.callFake((url) => {
      if (url.includes('/api/users/search?query=test')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              users: [
                { id: 1, username: 'testuser1', fullname: 'Test User 1', profilePhoto: '' },
                { id: 2, username: 'testuser2', fullname: 'Test User 2', profilePhoto: '' },
              ],
            }),
        });
      } else if (url.includes('/api/users/search?query=empty')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ users: [] }),
        });
      }
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'An error occurred' }),
      });
    });
  });

  afterEach(() => {
    // Reset the spy after each test to avoid any conflicts
    mockFetch.calls.reset();
  });

  it('[REQ078]_should_render_input_field_correctly', () => {
    render(
      <Router>
        <UserSearch />
      </Router>
    );

    const inputElement = screen.getByPlaceholderText('Search users by username');
    expect(inputElement).toBeTruthy();
    expect(inputElement.className).toContain('w-full');
  });

  it('[REQ079]_should_render_search_results_correctly', async () => {
    render(
      <Router>
        <UserSearch />
      </Router>
    );

    const inputElement = screen.getByPlaceholderText('Search users by username');

    // Simulate typing in input
    fireEvent.change(inputElement, { target: { value: 'test' } });

    // Wait for the users to appear in the search results
    const user1 = await screen.findByText('testuser1');
    const user2 = await screen.findByText('testuser2');

    expect(user1).toBeTruthy();
    expect(user2).toBeTruthy();
  });


});
