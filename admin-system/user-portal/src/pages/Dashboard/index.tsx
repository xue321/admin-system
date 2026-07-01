import { useEffect, useState } from 'react'
import { Row, Col, Progress, Button } from 'antd'
import {
  FileTextOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  ScheduleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getStatistics } from '../../api/question'
import Charts from './Charts'

const cardStyle = (borderColor: string, bgColor: string): React.CSSProperties => ({
  padding: '28px 24px',
  borderRadius: 'var(--radius-lg)',
  background: bgColor,
  border: `1px solid ${borderColor}`,
  transition: 'var(--transition-normal)',
  cursor: 'default',
})

function Dashboard() {
  const [stats, setStats] = useState<any>({})
  const navigate = useNavigate()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res: any = await getStatistics()
      setStats(res.data)
    } catch (e) {
      // ignore
    }
  }

  const total = stats.total || 0
  const mastered = stats.mastered || 0
  const masteryRate = total > 0 ? Math.round((mastered / total) * 100) : 0
  const dueToday = stats.dueToday || 0

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--color-foreground)',
          marginBottom: 4,
        }}>
          学习概览
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          跟踪你的错题复习进度
        </p>
      </div>

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <div
            style={cardStyle('#E5E1F5', '#F9F7FF')}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileTextOutlined style={{ fontSize: 18, color: '#fff' }} />
              </div>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 500 }}>总错题数</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-foreground)' }}>
              {total}
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div
            style={cardStyle('#FEE2E2', '#FFF5F5')}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(220, 38, 38, 0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ClockCircleOutlined style={{ fontSize: 18, color: '#fff' }} />
              </div>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 500 }}>未复习</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#DC2626' }}>
              {stats.unreviewed || 0}
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div
            style={cardStyle('#FEF3C7', '#FFFBEB')}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #D97706, #F59E0B)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <SyncOutlined style={{ fontSize: 18, color: '#fff' }} />
              </div>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 500 }}>复习中</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#D97706' }}>
              {stats.reviewing || 0}
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div
            style={cardStyle('#D1FAE5', '#F0FDF4')}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(5, 150, 105, 0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #059669, #10B981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircleOutlined style={{ fontSize: 18, color: '#fff' }} />
              </div>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 500 }}>已掌握</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#059669' }}>
              {mastered}
            </div>
          </div>
        </Col>
      </Row>

      <div style={{
        marginTop: 28,
        padding: '28px 32px',
        background: 'linear-gradient(135deg, #F9F7FF, #F3F0FF)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrophyOutlined style={{ fontSize: 20, color: 'var(--color-primary)' }} />
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-foreground)' }}>掌握进度</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary)' }}>
            {masteryRate}%
          </span>
        </div>
        <Progress
          percent={masteryRate}
          showInfo={false}
          strokeColor={{
            '0%': '#7C3AED',
            '100%': '#059669',
          }}
          trailColor="#E5E1F5"
          strokeWidth={10}
          style={{ borderRadius: 8 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12, color: 'var(--color-text-secondary)' }}>
          <span>继续加油！</span>
          <span>{mastered} / {total} 题已掌握</span>
        </div>
      </div>

      {dueToday > 0 && (
        <div style={{
          marginTop: 20,
          padding: '20px 32px',
          background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #FED7AA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ScheduleOutlined style={{ fontSize: 24, color: '#D97706' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-foreground)' }}>今日待复习</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                有 {dueToday} 道题需要复习
              </div>
            </div>
          </div>
          <Button type="primary" onClick={() => navigate('/review')}
            style={{ borderRadius: 8, background: '#D97706', borderColor: '#D97706' }}>
            开始复习
          </Button>
        </div>
      )}

      <Charts />
    </div>
  )
}

export default Dashboard
