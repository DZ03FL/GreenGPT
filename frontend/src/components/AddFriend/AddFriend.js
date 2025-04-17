import {useState, useEffect} from 'react'
import './AddFriend.css'

const AddFriend = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [activeMessage, setActiveMessage] = useState('');
  const [activeMessageUserID, setActiveMessageUserID] = useState(null);
  const [activeMessageType, setActiveMessageType] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/users', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  const handleAddFriend = (user_id, username) => {
    fetch('http://localhost:5000/api/friends/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success || !data.error) {
          setActiveMessage(`Friend request sent to ${username}!`);
          setActiveMessageUserID(user_id);
          setActiveMessageType('success');
        } 
        else {
          throw new Error(data.error);
        }
        setSelectedUserID(null);
      })
      .catch((err) => {
        setActiveMessage(`Failed to add friend: ${err.message}`);
        setActiveMessageUserID(user_id);
        setActiveMessageType('error');
        console.error('Error adding friend:', err);
      });
  };

  if(loading) return <p>Users currently loading...</p>

  return (
    <div className='friend-container'>
      <h1 className='add-friend-header'>Add a Friend</h1>
      <p className='add-friend-header-2'>Compete against friends to see who can reduce their energy usage the most!</p>
      <div className='friend-list'>
        {users.map(user => (
          <div className='user-card-container'>
            <div key={user.user_id} className = 'user-card' onClick={()=> setSelectedUserID(selectedUserID === user.user_id ? null : user.user_id)}>
            <img src="/images/icon.jpg" alt="Icon" className="friend-icon" />
            <div className='user-card-container-right'>
            <div className='username-content'>{user.username}</div>
            <div className='email-content'>{user.email}</div>
            </div>
            </div>
            <div className="action-container">
            {selectedUserID === user.user_id && <button className='add-friend-button' onClick={(e) => {
              e.stopPropagation();
              handleAddFriend(user.user_id, user.username)
            }}>Add Friend</button>}

            <div className='user-message-container'>
            {activeMessageUserID === user.user_id && (
              <div className={activeMessageType === 'success' ? 'success' : 'error'}>
                {activeMessage}
              </div>
            )}
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AddFriend
