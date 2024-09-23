
import '../src/setupModalsTests';
import React from 'react';
import Modal from "react-modal";
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import PostDetailPage from '../src/components/Feed/PostDetailPage/PostDetailPage';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';

describe('PostDetailModal Component', () => {
    let closeModal;
    let handleAddComment;
    let setNewComment;
    let handleKeyDown;
    let newComment;
    let feed;
    let comments;

    beforeEach(() => {
        closeModal = jasmine.createSpy('closeModal');
        handleAddComment = jasmine.createSpy('handleAddComment');
        setNewComment = jasmine.createSpy('setNewComment');
        handleKeyDown = jasmine.createSpy('handleKeyDown');
        newComment = '';
        feed = {
            id: '1',
            postImg: 'image_url',
            profileImg: 'profile_img_url',
            username: 'user1',
            caption: 'Post caption',
        };
        comments = [
            { id: '1', postedBy: { username: 'user2' }, comment: 'Nice post!' },
        ];

        setNewComment.and.callFake((value) => {
            newComment = value;
        });
    });

    afterEach(() => {
        cleanup();
    });




    it('[REQ0049]_calls_handleAddComment_when_the_Post_button_is_clicked', async () => {
        render(
            <PostDetailPage
                isPostDetailModal={true}
                onClose={closeModal}
                feed={feed}
                comments={comments}
                handleAddComment={handleAddComment}
                newComment={newComment}
                setNewComment={setNewComment}
                handleKeyDown={handleKeyDown}
            />
        );

        // Ensure the Post button is present and clickable
        const postButton = screen.getByText('Post');
        expect(postButton).toBeTruthy();

        fireEvent.click(postButton);

        await waitFor(() => {
            expect(handleAddComment).toHaveBeenCalled();
        });
    });

    it('[REQ0050]_updates_newComment_state_on_input_change', async () => {
        render(
            <PostDetailPage
                isPostDetailModal={true}
                onClose={closeModal}
                feed={feed}
                comments={comments}
                handleAddComment={handleAddComment}
                newComment={newComment}
                setNewComment={setNewComment}
                handleKeyDown={handleKeyDown}
            />
        );

        // Ensure the input field is present
        const inputField = screen.getByPlaceholderText('Add a Comment ....');
        expect(inputField).toBeTruthy();

        // Simulate input change
        fireEvent.change(inputField, { target: { value: 'New comment' } });

        // Verify that the setNewComment was called with the new value
        await waitFor(() => {
            expect(setNewComment).toHaveBeenCalledWith('New comment');
        });
    });


});
