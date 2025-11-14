import { Routes, Route, Navigate } from 'react-router-dom'
import SplashScreen from './views/SplashScreen'
import HomePage from './views/HomePage'
import LoginPage from './views/LoginPage'
import RegisterPage from './views/RegisterPage'
import NotificationsPage from './views/NotificationsPage'
import ForgotPasswordPage from './views/ForgotPasswordPage'
import ExplorePage from './views/ExplorePage'
import MessagesPage from './views/MessagesPage'
import ProfilePage from './views/ProfilePage'
import SubscriptionPage from './views/SubscriptionPage'
import ChatPage from './views/ChatPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/splash" element={<SplashScreen />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/chat/:id" element={<ChatPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot" element={<ForgotPasswordPage />} />
      <Route path="/notifications" element={<NotificationsPage onBack={() => history.back()} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
