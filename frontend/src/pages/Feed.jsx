import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFeed, sendRequest } from '../services/api'
import UserCard from '../components/UserCard'
import { FaUser, FaHeart, FaComments, FaUsers, FaCrown } from 'react-icons/fa'
import './Feed.css'

function Feed() {
  const [users, setUsers] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadFeed()
  }, [])

  const loadFeed = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Loading feed...')
      const data = await getFeed(1, 20)
      console.log('Feed data received:', data)
      
      // === FIX: Filter out null/undefined users ===
      const validUsers = (data || []).filter(user => user != null)
      console.log('Number of valid users:', validUsers.length)
      
      setUsers(validUsers)
      setCurrentIndex(0)
      
      if (validUsers.length === 0) {
        console.log('No users in feed')
      }
    } catch (error) {
      console.error('Error loading feed:', error)
      if (error.response?.status === 401) {
        setError('Please log in to view the feed')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        const errorMessage = error.response?.data || error.message || 'Failed to load feed'
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = async (status) => {
    if (currentIndex >= users.length) return

    const currentUser = users[currentIndex]
    
    // Safety check
    if (!currentUser) {
        setCurrentIndex(prev => prev + 1)
        return
    }

    try {
      await sendRequest(currentUser._id, status)
      setCurrentIndex(prev => prev + 1)
      
      // Load more users if we're running low
      if (currentIndex >= users.length - 3) {
        loadMoreUsers()
      }
    } catch (error) {
      console.error('Failed to send request:', error)
      setError('Failed to send request. Please try again.')
    }
  }

  const loadMoreUsers = async () => {
    try {
      const page = Math.floor(users.length / 10) + 1
      const newUsers = await getFeed(page, 10)
      // Filter new users too
      const validNewUsers = (newUsers || []).filter(u => u != null)
      
      if (validNewUsers.length > 0) {
        setUsers(prev => [...prev, ...validNewUsers])
      }
    } catch (error) {
      console.error('Failed to load more users:', error)
    }
  }

  if (loading) {
    return (
      <div className="feed-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (error && users.length === 0) {
    return (
      <div className="feed-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={loadFeed}>Retry</button>
        </div>
      </div>
    )
  }

  if (users.length === 0 || currentIndex >= users.length) {
    return (
      <div className="feed-container">
        <div className="feed-header">
          <h1>FindDevs</h1>
          <div className="header-actions">
            <button onClick={() => navigate('/requests')} className="icon-button" title="Requests">
              <FaComments />
            </button>
            <button onClick={() => navigate('/connections')} className="icon-button" title="Connections">
              <FaUsers />
            </button>
            <button onClick={() => navigate('/profile')} className="icon-button" title="Profile">
              <FaUser />
            </button>
          </div>
        </div>
        <div className="empty-feed">
          <FaHeart className="empty-icon" />
          <h2>No more profiles!</h2>
          <p>This could mean:</p>
          <ul style={{ textAlign: 'left', display: 'inline-block', color: 'white', marginTop: '10px' }}>
            <li>There are no other users in the database</li>
            <li>You've already swiped on everyone</li>
            <li>All users are already in your connections</li>
          </ul>
          <p style={{ marginTop: '20px' }}>Try creating another account to see profiles!</p>
          <button onClick={loadFeed} style={{ marginTop: '20px' }}>Refresh</button>
        </div>
      </div>
    )
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>DevTinder</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/payment')} className="premium-header-button" title="Get Premium">
            <FaCrown /> Premium
          </button>
          <button onClick={() => navigate('/requests')} className="icon-button" title="Requests">
            <FaComments />
          </button>
          <button onClick={() => navigate('/connections')} className="icon-button" title="Connections">
            <FaUsers />
          </button>
          <button onClick={() => navigate('/profile')} className="icon-button" title="Profile">
            <FaUser />
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="cards-container">
        {users.slice(currentIndex, currentIndex + 3).map((user, index) => (
          user ? (
            <div
              key={user._id}
              className="card-wrapper"
              style={{
                zIndex: 3 - index,
                position: index === 0 ? 'relative' : 'absolute',
                top: index === 0 ? 0 : index * 10,
                left: index === 0 ? 0 : index * 10,
              }}
            >
              <UserCard
                user={user}
                onSwipe={index === 0 ? handleSwipe : () => {}}
              />
            </div>
          ) : null
        ))}
      </div>

      <div className="feed-stats">
        <p>{users.length - currentIndex} profiles remaining</p>
      </div>
    </div>
  )
}

export default Feed
