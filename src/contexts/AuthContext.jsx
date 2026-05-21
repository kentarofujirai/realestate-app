import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

// 認証状態をアプリ全体に提供するプロバイダー
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 初回マウント時に現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 認証状態の変化を監視（ログイン・ログアウト時に発火）
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // メールアドレス＋パスワードで会員登録
  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password })

  // メールアドレス＋パスワードでログイン
  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  // ログアウト
  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// AuthContextを利用するカスタムフック
export function useAuth() {
  return useContext(AuthContext)
}
