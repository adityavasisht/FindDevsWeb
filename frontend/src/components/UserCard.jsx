import { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { FaHeart, FaTimes, FaCode, FaUser } from 'react-icons/fa'
import './UserCard.css'

function UserCard({ user, onSwipe }) {
  // === FIX: Safety Check ===
  if (!user) return null;

  const [exitX, setExitX] = useState(0)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > 100) {
      setExitX(info.offset.x > 0 ? 200 : -200)
      onSwipe(info.offset.x > 0 ? 'interested' : 'ignore')
    }
  }

  const handleLike = () => {
    setExitX(200)
    onSwipe('interested')
  }

  const handlePass = () => {
    setExitX(-200)
    onSwipe('ignore')
  }

  return (
    <motion.div
      className="user-card"
      style={{
        x,
        rotate,
        opacity,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX, scale: exitX === 0 ? 1 : 0.95, opacity: exitX === 0 ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      initial={{ scale: 1, opacity: 1 }}
    >
      <div className="card-image-container">
        <img 
          src={user.photoUrl || 'https://via.placeholder.com/400x600?text=No+Photo'} 
          alt={`${user.firstname} ${user.lastname}`}
          className="card-image"
        />
        <div className="card-overlay">
          <div className="card-info">
            <h2 className="card-name">
              {user.firstname} {user.lastname}
              {user.age && <span className="card-age">, {user.age}</span>}
            </h2>
            {user.gender && (
              <p className="card-gender">
                <FaUser /> {user.gender}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="card-content">
        {user.bio && (
          <div className="card-section">
            <h3>Bio</h3>
            <p>{user.bio}</p>
          </div>
        )}

        {user.about && (
          <div className="card-section">
            <h3>About</h3>
            <p>{user.about}</p>
          </div>
        )}

        {user.skills && user.skills.length > 0 && (
          <div className="card-section">
            <h3><FaCode /> Skills</h3>
            <div className="skills-list">
              {user.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button className="action-button pass-button" onClick={handlePass}>
          <FaTimes />
        </button>
        <button className="action-button like-button" onClick={handleLike}>
          <FaHeart />
        </button>
      </div>
    </motion.div>
  )
}

export default UserCard
