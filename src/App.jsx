import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'

export default function App() {
  return (
    <BrowserRouter>
      {/* 認証コンテキストをアプリ全体に提供 */}
      <AuthProvider>
        <Routes>
          {/* ルートアクセス時はログイン画面へ */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 要認証ルート：未ログインの場合は /login へリダイレクト */}
          <Route
            path="/properties"
            element={
              <PrivateRoute>
                <Properties />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
