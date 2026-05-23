import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import styles from './Properties.module.css'

// 家賃を「¥85,000」形式にフォーマットする
const formatRent = (rent) => `¥${Number(rent).toLocaleString('ja-JP')}`

// フォームの初期値
const EMPTY_FORM = { name: '', rent: '', area: '', layout: '' }

export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // 物件一覧
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 新規登録フォームの表示状態・入力値
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState(EMPTY_FORM)
  const [addLoading, setAddLoading] = useState(false)

  // 編集フォームの表示状態・入力値
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [editLoading, setEditLoading] = useState(false)

  // ログアウト処理
  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  // 自分が登録した物件一覧を Supabase から取得する
  const fetchProperties = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setError('物件の取得に失敗しました: ' + error.message)
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  // 新規物件を INSERT する
  const handleAdd = async (e) => {
    e.preventDefault()
    setAddLoading(true)
    const { error } = await supabase.from('properties').insert({
      name: addForm.name,
      rent: Number(addForm.rent),
      area: addForm.area,
      layout: addForm.layout,
      user_id: user.id,
    })
    if (error) {
      alert('登録に失敗しました: ' + error.message)
    } else {
      setShowAddForm(false)
      setAddForm(EMPTY_FORM)
      await fetchProperties()
    }
    setAddLoading(false)
  }

  // 編集モーダルを開き、対象物件の値をフォームにセットする
  const handleEditOpen = (property) => {
    setEditingId(property.id)
    setEditForm({
      name: property.name,
      rent: String(property.rent),
      area: property.area,
      layout: property.layout,
    })
  }

  // 対象物件を UPDATE する
  const handleUpdate = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    const { error } = await supabase
      .from('properties')
      .update({
        name: editForm.name,
        rent: Number(editForm.rent),
        area: editForm.area,
        layout: editForm.layout,
      })
      .eq('id', editingId)
    if (error) {
      alert('更新に失敗しました: ' + error.message)
    } else {
      setEditingId(null)
      setEditForm(EMPTY_FORM)
      await fetchProperties()
    }
    setEditLoading(false)
  }

  // 対象物件を DELETE する（確認ダイアログあり）
  const handleDelete = async (id) => {
    if (!window.confirm('この物件を削除しますか？')) return
    const { error } = await supabase.from('properties').delete().eq('id', id)
    if (error) {
      alert('削除に失敗しました: ' + error.message)
    } else {
      await fetchProperties()
    }
  }

  return (
    <div className={styles.page}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.headerTitle}>不動産管理システム</h1>
          <div className={styles.headerRight}>
            <span className={styles.userEmail}>{user?.email}</span>
            <button className={styles.logoutButton} onClick={handleSignOut}>
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className={styles.main}>
        <div className={styles.titleRow}>
          <div className={styles.titleLeft}>
            <h2 className={styles.pageTitle}>物件一覧</h2>
            {!loading && (
              <span className={styles.count}>{properties.length}件</span>
            )}
          </div>
          <button
            className={styles.addButton}
            onClick={() => setShowAddForm(true)}
          >
            + 新規登録
          </button>
        </div>

        {/* エラーメッセージ */}
        {error && <p className={styles.errorText}>{error}</p>}

        {/* ローディング・空状態・物件カード一覧 */}
        {loading ? (
          <p className={styles.stateText}>読み込み中...</p>
        ) : properties.length === 0 ? (
          <p className={styles.stateText}>登録された物件はありません</p>
        ) : (
          <div className={styles.grid}>
            {properties.map((property) => (
              <div key={property.id} className={styles.card}>
                {/* 間取りバッジ */}
                <span className={styles.badge}>{property.layout}</span>
                <h3 className={styles.propertyName}>{property.name}</h3>
                <p className={styles.area}>📍 {property.area}</p>
                <div className={styles.rentRow}>
                  <span className={styles.rentLabel}>月額家賃</span>
                  <span className={styles.rent}>{formatRent(property.rent)}</span>
                </div>
                {/* 編集・削除ボタン */}
                <div className={styles.cardActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditOpen(property)}
                  >
                    編集
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(property.id)}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 新規登録モーダル */}
      {showAddForm && (
        <div
          className={styles.overlay}
          onClick={() => { setShowAddForm(false); setAddForm(EMPTY_FORM) }}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>物件を新規登録</h3>
            <form onSubmit={handleAdd} className={styles.form}>
              <label className={styles.label}>
                物件名
                <input
                  className={styles.input}
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="例：サンシャインマンション 301号室"
                  required
                />
              </label>
              <label className={styles.label}>
                家賃（円）
                <input
                  className={styles.input}
                  type="number"
                  value={addForm.rent}
                  onChange={(e) => setAddForm({ ...addForm, rent: e.target.value })}
                  placeholder="例：85000"
                  min="0"
                  required
                />
              </label>
              <label className={styles.label}>
                エリア名
                <input
                  className={styles.input}
                  type="text"
                  value={addForm.area}
                  onChange={(e) => setAddForm({ ...addForm, area: e.target.value })}
                  placeholder="例：東京都豊島区東池袋"
                  required
                />
              </label>
              <label className={styles.label}>
                間取り
                <input
                  className={styles.input}
                  type="text"
                  value={addForm.layout}
                  onChange={(e) => setAddForm({ ...addForm, layout: e.target.value })}
                  placeholder="例：1LDK"
                  required
                />
              </label>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => { setShowAddForm(false); setAddForm(EMPTY_FORM) }}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={addLoading}
                >
                  {addLoading ? '登録中...' : '登録する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 編集モーダル */}
      {editingId && (
        <div className={styles.overlay} onClick={() => setEditingId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>物件を編集</h3>
            <form onSubmit={handleUpdate} className={styles.form}>
              <label className={styles.label}>
                物件名
                <input
                  className={styles.input}
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </label>
              <label className={styles.label}>
                家賃（円）
                <input
                  className={styles.input}
                  type="number"
                  value={editForm.rent}
                  onChange={(e) => setEditForm({ ...editForm, rent: e.target.value })}
                  min="0"
                  required
                />
              </label>
              <label className={styles.label}>
                エリア名
                <input
                  className={styles.input}
                  type="text"
                  value={editForm.area}
                  onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                  required
                />
              </label>
              <label className={styles.label}>
                間取り
                <input
                  className={styles.input}
                  type="text"
                  value={editForm.layout}
                  onChange={(e) => setEditForm({ ...editForm, layout: e.target.value })}
                  required
                />
              </label>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setEditingId(null)}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={editLoading}
                >
                  {editLoading ? '更新中...' : '更新する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
