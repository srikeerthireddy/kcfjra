import React, { useState, useEffect } from 'react';
import FeedCard from './FeedCard/FeedCard';
import UserSearch from '../UserSearch/UserSearch';

const Feed = ({ newPost, updateNewPost }) => {
  const API_URL = window.location.origin.replace('3000', '5000');
  const [feeds, setFeeds] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [page, setPage] = useState(1);

  // Fetch all posts and user ID
  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/posts/getAll?page=${page}&limit=2`
        );
        if (!response.ok) {
          throw new Error('Network Response is not Ok');
        }
        const data = await response.json();
        setFeeds((prevPosts) => [...prevPosts, ...data.posts]);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUserId = () => {
      const userId = localStorage.getItem('id');
      setCurrentUserId(parseInt(userId, 10));
    };

    fetchFeeds();
    fetchUserId();
  }, [newPost, page, API_URL]);

  // Like a post
  const likePost = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/like`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ postId: id }),
      });
      await response.json();
      updateNewPost();
    } catch (err) {
      console.log(err);
    }
  };

  // Unlike a post
  const unlikePost = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/unlike`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ postId: id }),
      });
      await response.json();
      updateNewPost();
    } catch (err) {
      console.log(err);
    }
  };

  // Handle infinite scroll to load more posts
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Fix cleanup
  }, []);

  return (
    <div className="w-full min-h-screen lg:py-7 sm:py-3 flex flex-col lg:flex-row items-start gap-x-20 mt-5 pt-5 mb-5">
      {/* Search section */}
      <div>
        <UserSearch />
      </div>

      {/* Feed section */}
      <div className="w-full lg:w-[70%] h-auto relative">
        <div className="w-full h-auto flex items-center justify-center mt-6 mb-6">
          <div className="w-full lg:w-[73%] md:w-[73%] sm:w-[80%]">
            {feeds &&
              feeds.map((feed) => (
                <FeedCard
                  key={feed.id}
                  updateNewPost={updateNewPost}
                  feed={feed}
                  onLike={likePost}
                  onUnlike={unlikePost}
                  currentUserId={currentUserId}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Additional space or sidebar */}
      <div className="w-full lg:w-[25%] h-auto lg:block hidden"></div>
    </div>
  );
};

export default Feed;
