import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { selectIsAuthenticated, selectAuthLoading } from './store/slices/authSlice'
import { selectChatLoading } from './store/slices/chatSlice'
import { hydrateChatStateIfPresent } from './store'
import GlobalLoader from './components/GlobalLoader'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ChatDashboard from './pages/ChatDashboard'
import ChatSession from './pages/ChatSession'
import Test from './pages/Test'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);
  const chatLoading = useSelector(selectChatLoading);

  // Guarded one-time hydration of chat after authentication
  const didHydrateRef = useRef(false);
  useEffect(() => {
    if (isAuthenticated && !didHydrateRef.current) {
      const hydrated = hydrateChatStateIfPresent();
      didHydrateRef.current = true; // prevent multiple attempts
      if (!hydrated) {
        // Nothing to hydrate; could optionally initialize defaults here.
      }
    }
    if (!isAuthenticated) {
      // Reset flag so a new login in same session can hydrate again
      didHydrateRef.current = false;
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <GlobalLoader show={authLoading || chatLoading} />
      <Routes>
        {/* Redirect root based on authentication */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/signin" replace />
          } 
        />
        
        {/* Public routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <ChatDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatSession />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/test" 
          element={
            <ProtectedRoute>
              <Test />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
