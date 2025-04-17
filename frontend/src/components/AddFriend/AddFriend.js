import {useState, useEffect} from 'react'
import './AddFriend.css'

const AddFriend = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserID, setSelectedUserID] = useState(null);

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

  const handleAddFriend = (friendId) => {
    fetch('http://localhost:5000/api/add-friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ friend_id: friendId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Added Friend")
        setSelectedUserID(null);
      })
      .catch((err) => {
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
            <div>
            {selectedUserID === user.user_id && <button className='add-friend-button' onClick={(e) => {
              e.stopPropagation();
              handleAddFriend(user.user_id)
            }}>Add Friend</button>}
            </div>
          </div>
          
        ))}
      </div>
    </div>
  )
}

export default AddFriend
