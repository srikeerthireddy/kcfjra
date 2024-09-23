
import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import CreatePost from '../src/components/CreatePost/CreatePost';
import Modal from 'react-modal';
import { supabase } from '../src/services/supabaseClientMock';

const API_URL = window.location.origin.replace("3000", "8888");

describe('CreatePost component tests', () => {
  let container;
  let closeModal;
  let fetchSpy;

  beforeEach(() => {
    // Create a div with id 'root' and append it to the document body
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);

    // Set the app element to the newly created div
    Modal.setAppElement(root);

    closeModal = jasmine.createSpy('closeModal');

    // Mock fetch globally
    spyOn(window, 'fetch').and.callFake((url, options) => {
      if (url.endsWith('/api/posts/create') && options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      }
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'An error occurred' }),
      });
    });

    container = render(<CreatePost closeModal={closeModal} />);
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

  it('[REQ018]_should_render_the_CreatePost_component_correctly', () => {
    const { getByPlaceholderText, getByText } = container;

    expect(getByText('Create Post')).toBeTruthy();
    expect(getByPlaceholderText('Add a caption')).toBeTruthy();
    expect(getByPlaceholderText('Add hashtags')).toBeTruthy();
  });

  it('[REQ019]_should_call_handleShare_when_the_Share_button_is_clicked', async () => {
    const { getByText, getByPlaceholderText, getByTestId, getByAltText } = container;

    const captionInput = getByPlaceholderText('Add a caption');
    const hashtagsInput = getByPlaceholderText('Add hashtags');
    const shareButton = getByText('Share');

    fireEvent.change(captionInput, { target: { value: 'Test Caption' } });
    fireEvent.change(hashtagsInput, { target: { value: '#test' } });

    // Mock setting the selected image
    const fileInput = getByTestId('image-upload');
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);

    // Wait for the image to be uploaded and rendered
    await waitFor(() => {
      const image = getByAltText('Selected');
      expect(image).toBeTruthy();
      expect(image.src).toBeTruthy();
    });

    fireEvent.click(shareButton);

    await waitFor(() => {
      // Assert fetch was called with the correct data
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/posts/create`, jasmine.objectContaining({
        method: 'POST',
        headers: jasmine.objectContaining({
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }),
        body: jasmine.any(String) // Check if the body is a string, or use a more specific match if known
      }));

      
      
    });
  });

  it('[REQ031]_should_upload_an_image_and_render_it_correctly', async () => {
    const { getByTestId, getByAltText } = container;
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });

    // Mock the URL returned by Supabase
    const mockPublicUrl = 'http://example.com/images/example.png';
    supabase.storage.from().upload.and.resolveTo({
      data: { path: 'example/path' },
      error: null
    });
    supabase.storage.from().getPublicUrl.and.returnValue({
      data: { publicUrl: mockPublicUrl }
    });

    // Find the file input element by test ID
    const input = getByTestId('image-upload');
    Object.defineProperty(input, 'files', { value: [file] });

    // Trigger file input change
    fireEvent.change(input);

    // Wait for the image to be rendered
    await waitFor(() => {
      const image = getByAltText('Selected');
      expect(image).toBeTruthy();
      expect(image.src).toBe(mockPublicUrl);
    });
  });
});
