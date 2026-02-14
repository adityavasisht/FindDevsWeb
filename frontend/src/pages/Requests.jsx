import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getReceivedRequests, reviewRequest } from '../services/api'
import { FaHome, FaCheck, FaTimes, FaUser } from 'react-icons/fa'
import './Requests.css'

function Requests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const data = await getReceivedRequests()
      setRequests(data)
    } catch (error) {
      setError('Failed to load requests')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (requestId, status) => {
    try {
      await reviewRequest(requestId, status)
      await loadRequests()
    } catch (error) {
      setError(error.response?.data || 'Failed to update request')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="requests-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="requests-container">
      <div className="requests-header">
        <button onClick={() => navigate('/feed')} className="header-button">
          <FaHome />
        </button>
        <h1>Connection Requests</h1>
        <div style={{ width: 45 }}></div>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="requests-list">
        {requests.length === 0 ? (
          <div className="empty-requests">
            <FaUser className="empty-icon" />
            <h2>No requests yet</h2>
            <p>When someone shows interest, you'll see it here</p>
          </div>
        ) : (
          requests.map((request) => {
            const user = request.fromUserId;
            
            // === FIX: Handle deleted users safely ===
            if (!user) return null; 

            return (
              <div key={request._id} className="request-card">
                <div className="request-user-info">
                  <img 
                    src={user.photoUrl || 'https://via.placeholder.com/100?text=No+Photo'} 
                    alt={`${user.firstname} ${user.lastname}`}
                    className="request-avatar"
                  />
                  <div className="request-details">
                    <h3>{user.firstname} {user.lastname}</h3>
                    {user.bio && <p className="request-bio">{user.bio}</p>}
                    {user.skills && user.skills.length > 0 && (
                      <div className="request-skills">
                        {user.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="skill-tag-small">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="request-actions">
                  <button
                    onClick={() => handleReview(request._id, 'accepted')}
                    className="accept-button"
                  >
                    <FaCheck /> Accept
                  </button>
                  <button
                    onClick={() => handleReview(request._id, 'rejected')}
                    className="reject-button"
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Requests
