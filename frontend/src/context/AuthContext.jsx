import { createContext, useContext, useState, useEffect } from 'react'
import { checkAuth } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const verifyAuth = async () => {
    try {
      const userData = await checkAuth()
      if (userData && userData._id) {
        setIsAuthenticated(true)
        setUser(userData)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    verifyAuth()
  }, [])

  const login = async (email, password) => {
    const { login: loginAPI } = await import('../services/api')
    await loginAPI(email, password)
    await verifyAuth()
  }

  const logout = async () => {
    const { logout: logoutAPI } = await import('../services/api')
    await logoutAPI()
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, verifyAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

