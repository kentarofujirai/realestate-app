import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './Auth.module.css'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (password !== confirm) {
      setError('パスワードが一致しません')
      return
    }
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password)
    if (error) {
      setError('登録に失敗しました: ' + error.message)
    } else {
      // Supabaseの設定によってはメール確認が必要な場合がある
      setMessage('確認メールを送信しました。メールを確認してログインしてください。')
      setTimeout(() => navigate('/login'), 3000)
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>会員登録</h1>
        <p className={styles.subtitle}>不動産管理システム</p>

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>メールアドレス</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>パスワード</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6文字以上"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>パスワード（確認）</label>
            <input
              type="password"
              className={styles.input}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="もう一度入力してください"
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? '登録中...' : '会員登録'}
          </button>
        </form>

        <p className={styles.link}>
          すでにアカウントをお持ちの方は{' '}
          <Link to="/login">ログイン</Link>
        </p>
      </div>
    </div>
  )
}
