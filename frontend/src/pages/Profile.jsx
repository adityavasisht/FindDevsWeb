import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProfile, updateProfile } from '../services/api'
import { FaHeart, FaHome, FaSignOutAlt } from 'react-icons/fa'
import './Profile.css'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { logout: logoutAuth } = useAuth()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await getProfile()
      setProfile(data)
      setFormData({
        photoUrl: data.photoUrl || '',
        bio: data.bio || '',
        about: data.about || '',
        skills: data.skills?.join(', ') || '',
        gender: data.gender || '',
        password: ''
      })
    } catch (error) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const updateData = { ...formData }
      if (updateData.skills) {
        updateData.skills = updateData.skills.split(',').map(s => s.trim()).filter(s => s)
      }
      if (!updateData.password) {
        delete updateData.password
      }
      
      await updateProfile(updateData)
      setIsEditing(false)
      await loadProfile()
    } catch (error) {
      setError(error.response?.data || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutAuth()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="error-container">
          <p>Failed to load profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={() => navigate('/feed')} className="header-button">
          <FaHome />
        </button>
        <h1>My Profile</h1>
        <button onClick={handleLogout} className="header-button">
          <FaSignOutAlt />
        </button>
      </div>

      <div className="profile-card">
        {error && <div className="error-message">{error}</div>}

        {!isEditing ? (
          <>
            <div className="profile-image-section">
              <img 
                src={profile.photoUrl || 'https://via.placeholder.com/200?text=No+Photo'} 
                alt={`${profile.firstname} ${profile.lastname}`}
                className="profile-image"
              />
            </div>

            <div className="profile-info">
              <h2>{profile.firstname} {profile.lastname}</h2>
              {profile.age && <p className="profile-age">Age: {profile.age}</p>}
              {profile.gender && <p className="profile-gender">Gender: {profile.gender}</p>}
              {profile.emailId && <p className="profile-email">Email: {profile.emailId}</p>}

              {profile.bio && (
                <div className="profile-section">
                  <h3>Bio</h3>
                  <p>{profile.bio}</p>
                </div>
              )}

              {profile.about && (
                <div className="profile-section">
                  <h3>About</h3>
                  <p>{profile.about}</p>
                </div>
              )}

              {profile.skills && profile.skills.length > 0 && (
                <div className="profile-section">
                  <h3>Skills</h3>
                  <div className="skills-list">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setIsEditing(true)} className="edit-button">
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Photo URL</label>
              <input
                type="url"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                placeholder="Write a short bio..."
              />
            </div>

            <div className="form-group">
              <label>About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="5"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="form-group">
              <label>Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="JavaScript, React, Node.js"
              />
            </div>

            <div className="form-group">
              <label>New Password (leave empty to keep current)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false)
                  loadProfile()
                }}
                className="cancel-button"
              >
                Cancel
              </button>
              <button type="submit" className="save-button" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Profile

