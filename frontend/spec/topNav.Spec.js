
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jasmine-dom';
import TopNav from '../src/components/headers/TopNav/TopNav';

describe('TopNav Component', () => {
  it('[REQ0015]_renders_search_input_and_button_correctly', () => {
    const { getByTestId } = render(<TopNav />);



    // Check if the search input is rendered
    const searchInput = screen.getByPlaceholderText(/Search/i);
    expect(searchInput).toBeTruthy();





  });
});
