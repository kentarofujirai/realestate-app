import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 未ログイン時はログイン画面にリダイレクトする保護ルート
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  // 認証状態の確認中はローディング表示
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#6b7280' }}>読み込み中...</p>
      </div>
    )
  }

  // 未ログインならログイン画面へリダイレクト
  return user ? children : <Navigate to="/login" replace />
}
