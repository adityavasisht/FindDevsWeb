import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Provider } from 'react-redux'; // <--- 1. Import Provider
import appStore from './utils/appStore'; // <--- 2. Import your Store (Check this path!)

import Login from './pages/Login'
import Signup from './pages/Signup'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import Requests from './pages/Requests'
import Connections from './pages/Connections'
import PaymentComponent from './pages/PaymentComponent'
import './App.css'

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/feed" />} 
      />
      <Route 
        path="/signup" 
        element={!isAuthenticated ? <Signup /> : <Navigate to="/feed" />} 
      />
      <Route 
        path="/feed" 
        element={isAuthenticated ? <Feed /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/profile" 
        element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/requests" 
        element={isAuthenticated ? <Requests /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/connections" 
        element={isAuthenticated ? <Connections /> : <Navigate to="/login" />} 
      />
      <Route
        path="/payment"
        element={isAuthenticated ? <PaymentComponent /> : <Navigate to="/login" />}
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? "/feed" : "/login"} />} />
      <Route path="/chat/:targetUserId" element={<Chat />} />
    </Routes>
    
  )
}

function App() {
  return (
    // 3. Wrap everything in the Provider
    <Provider store={appStore}> 
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </Provider>
  )
}

export default App