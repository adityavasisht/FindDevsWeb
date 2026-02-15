import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getConnections } from '../services/api'
import { FaHome, FaUser, FaCode, FaComment } from 'react-icons/fa' 
import './Connections.css'

function Connections() {
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadConnections()
  }, [])

  const loadConnections = async () => {
    try {
      setLoading(true)
      const data = await getConnections()
      // === FIX: Filter out null users to prevent crashes ===
      const validConnections = (data || []).filter(u => u != null)
      setConnections(validConnections)
    } catch (error) {
      setError('Failed to load connections')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChat = (targetUserId) => {
    navigate('/chat/' + targetUserId)
  }

  if (loading) {
    return (
      <div className="connections-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="connections-container">
      <div className="connections-header">
        <button onClick={() => navigate('/feed')} className="header-button">
          <FaHome />
        </button>
        <h1>My Connections</h1>
        <div style={{ width: 45 }}></div>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="connections-list">
        {connections.length === 0 ? (
          <div className="empty-connections">
            <FaUser className="empty-icon" />
            <h2>No connections yet</h2>
            <p>Start swiping to make connections!</p>
            <button onClick={() => navigate('/feed')} className="go-to-feed-button">
              Go to Feed
            </button>
          </div>
        ) : (
          connections.map((user) => (
            <div key={user._id} className="connection-card">
              <div className="connection-main">
                <img 
                  src={user.photoUrl || 'https://via.placeholder.com/120?text=No+Photo'} 
                  alt={`${user.firstname} ${user.lastname}`}
                  className="connection-avatar"
                />
                <div className="connection-info">
                  <h3>{user.firstname} {user.lastname}</h3>
                  {user.gender && (
                    <p className="connection-gender">
                      <FaUser /> {user.gender}
                    </p>
                  )}
                  {user.bio && (
                    <p className="connection-bio">{user.bio}</p>
                  )}
                  {user.about && (
                    <p className="connection-about">{user.about}</p>
                  )}
                  {user.skills && user.skills.length > 0 && (
                    <div className="connection-skills">
                      <FaCode className="skills-icon" />
                      <div className="skills-tags">
                        {user.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="connection-actions">
                <button 
                  className="chat-button" 
                  onClick={() => handleChat(user._id)}
                >
                  <FaComment className="chat-icon" /> Chat
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Connections
