import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserSearch() {
  const API_URL = window.location.origin.replace('3000', '5000');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const fetchUsers = async (searchTerm) => {
    if (!searchTerm) {
      setResult([]);
      setShowResult(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/users/search?query=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error('Network response is not ok');
      }
      const data = await response.json();
      console.log(data);
      setResult(data.users || []);
      setShowResult(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchUsers(value);
  };

  return (
    <div className="relative max-w-md mx-auto search-container">
      <input
        type="text"
        placeholder="Search users by username"
        value={query}
        onChange={handleInputChange}
        className="w-full py-2 px-3 text-gray-700 bg-gray-100 rounded-md focus:outline-none"
      />
      {showResult && (
        <div className="absolute w-full bg-white mt-1 shadow-lg rounded-lg max-h-60 overflow-y-auto">
          {loading ? (
            <p className="p-4 text-center text-gray">Loading...</p>
          ) : result.length > 0 ? (
            result.map((user) => (
              <Link key={user.username} to={`/profile/${user.username}`}>
                <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-300">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-4">
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.fullname}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="p-4 text-center text-gray">No user found.</p>
          )}
        </div>
      )}
    </div>
  );
}
