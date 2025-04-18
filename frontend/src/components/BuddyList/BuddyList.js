import React, { useEffect, useState } from 'react';
import './BuddyList.css';
import useAuthRedirect from '../../hooks/useAuthRedirect';

const Friends = () => {
  useAuthRedirect();

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Function to fetch list of user's friends and incoming friend requests
  const fetchData = async () => {
    setErrorMsg('');

    try {
      const [friendsRes, requestsRes] = await Promise.all([
        fetch('https://greengpt.onrender.com/api/friends/list', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'},
          credentials: 'include',
        }),
        fetch('https://greengpt.onrender.com/api/friends/requests', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json',},
          credentials: 'include',
        }),
      ]);

      if (!friendsRes.ok || !requestsRes.ok) {
        throw new Error('Error loading data');
      }

      const friendsData = await friendsRes.json();
      const requestsData = await requestsRes.json();

      setFriends(friendsData);
      setRequests(requestsData);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load friends or requests');
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to respond to friend requests (accept/decline)
  const respondToRequest = async (friendship_id, action) => {
    setErrorMsg('');

    try {
      const response = await fetch('https://greengpt.onrender.com/api/friends/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ friendship_id, action })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Re-fetch both friends list and pending requests
        await fetchData();
      } else {
        setErrorMsg(data.error || 'Failed to respond to request');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to respond to request');
    }
  };

  return (
    <div className="friends-container">
      <h2>Your Friends</h2>
      {errorMsg && <p className="error">{errorMsg}</p>}

      <div className="friends-list">
        {friends.length === 0 ? (
          <p>You have no friends yet.</p>
        ) : (
          friends.map(friend => (
            <div key={friend.user_id} className="friend-card">
              <strong>{friend.username}</strong><br />
              <span>{friend.email}</span>
            </div>
          ))
        )}
      </div>

      <h2>Pending Friend Requests</h2>
      <div className="requests-list">
        {requests.length === 0 ? (
          <p>No incoming friend requests.</p>
        ) : (
          requests.map(req => (
            <div key={req.friendship_id} className="request-card">
              <strong>{req.username}</strong><br />
              <span>{req.email}</span>
              <div className="action-buttons">
                <button onClick={() => respondToRequest(req.friendship_id, 'accept')}>
                  Accept
                </button>
                <button onClick={() => respondToRequest(req.friendship_id, 'decline')}>
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Friends;