import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from './Properties.module.css'

// ダミーの物件データ
const DUMMY_PROPERTIES = [
  { id: 1, name: 'サンシャインマンション 301号室', rent: 85000, area: '東京都豊島区東池袋', size: '35㎡', type: '1LDK' },
  { id: 2, name: 'グリーンハイツ 102号室', rent: 62000, area: '東京都杉並区高円寺南', size: '28㎡', type: '1K' },
  { id: 3, name: 'パールコート渋谷 501号室', rent: 145000, area: '東京都渋谷区恵比寿', size: '52㎡', type: '2LDK' },
  { id: 4, name: 'ブルースカイアパート 201号室', rent: 55000, area: '神奈川県横浜市神奈川区', size: '25㎡', type: '1K' },
  { id: 5, name: 'リバーサイドテラス 403号室', rent: 98000, area: '東京都江東区豊洲', size: '42㎡', type: '1LDK' },
  { id: 6, name: 'シティハイム新宿 805号室', rent: 120000, area: '東京都新宿区西新宿', size: '48㎡', type: '2LDK' },
]

// 家賃を「¥85,000」形式にフォーマットする
const formatRent = (rent) =>
  `¥${rent.toLocaleString('ja-JP')}`

export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
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
          <h2 className={styles.pageTitle}>物件一覧</h2>
          <span className={styles.count}>{DUMMY_PROPERTIES.length}件</span>
        </div>

        {/* 物件カード一覧 */}
        <div className={styles.grid}>
          {DUMMY_PROPERTIES.map((property) => (
            <div key={property.id} className={styles.card}>
              {/* 物件タイプのバッジ */}
              <span className={styles.badge}>{property.type}</span>
              <h3 className={styles.propertyName}>{property.name}</h3>
              <p className={styles.area}>📍 {property.area}</p>
              <p className={styles.size}>📐 {property.size}</p>
              <div className={styles.rentRow}>
                <span className={styles.rentLabel}>月額家賃</span>
                <span className={styles.rent}>{formatRent(property.rent)}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
