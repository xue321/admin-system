import { useEffect, useState } from 'react'
import { Button, Card, Progress, Space, Tag } from 'antd'
import {
  CheckCircleOutlined,
  EyeOutlined, ScheduleOutlined, TrophyOutlined,
} from '@ant-design/icons'
import { getDueReview, markReviewed } from '../../api/question'

const qualityButtons = [
  { label: '忘了', value: 1, color: '#DC2626' },
  { label: '模糊', value: 2, color: '#D97706' },
  { label: '想起来了', value: 3, color: '#2563EB' },
  { label: '记得', value: 4, color: '#059669' },
  { label: '太简单', value: 5, color: '#7C3AED' },
]

function ReviewPage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [completed, setCompleted] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadDue() }, [])

  const loadDue = async () => {
    try {
      const res: any = await getDueReview()
      setQuestions(res.data || [])
    } catch (e) { /* ignore */ }
    finally { setLoading(false) }
  }

  const handleRate = async (quality: number) => {
    const q = questions[current]
    await markReviewed(q.id, quality)
    setCompleted(completed + 1)
    setShowAnswer(false)
    if (current < questions.length - 1) {
      setCurrent(current + 1)
    } else {
      setCurrent(questions.length)
    }
  }

  const total = questions.length
  const isDone = current >= total

  if (loading) return null

  if (total === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <TrophyOutlined style={{ fontSize: 64, color: 'var(--color-primary)', marginBottom: 16 }} />
        <h2 style={{ color: 'var(--color-foreground)', fontWeight: 700 }}>今天没有待复习的题目</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>所有题目都已按计划复习完毕，继续保持！</p>
      </div>
    )
  }

  if (isDone) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <CheckCircleOutlined style={{ fontSize: 64, color: '#059669', marginBottom: 16 }} />
        <h2 style={{ color: 'var(--color-foreground)', fontWeight: 700 }}>复习完成！</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>今天共复习了 {completed} 道题，继续加油！</p>
        <Button type="primary" onClick={() => { setCurrent(0); setCompleted(0); loadDue() }}
          style={{ borderRadius: 8, marginTop: 16 }}>
          重新开始
        </Button>
      </div>
    )
  }

  const q = questions[current]

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-foreground)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <ScheduleOutlined style={{ color: 'var(--color-primary)' }} />
          今日复习
        </h2>
        <Tag color="purple" style={{ borderRadius: 8, fontSize: 13, padding: '4px 12px' }}>
          {current + 1} / {total}
        </Tag>
      </div>

      <Progress
        percent={Math.round((current / total) * 100)}
        showInfo={false}
        strokeColor="#7C3AED"
        trailColor="#E5E1F5"
        style={{ marginBottom: 24 }}
      />

      <Card style={{ borderRadius: 16, marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 12 }}>
            {q.title}
          </h3>
          {q.content && (
            <div
              style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--color-text)', padding: '12px 16px', background: 'var(--color-muted)', borderRadius: 10 }}
              dangerouslySetInnerHTML={{ __html: q.content }}
            />
          )}
        </div>

        {!showAnswer ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Button
              type="primary"
              size="large"
              icon={<EyeOutlined />}
              onClick={() => setShowAnswer(true)}
              style={{ borderRadius: 10, height: 48, paddingInline: 32 }}
            >
              查看答案
            </Button>
          </div>
        ) : (
          <div>
            {q.myAnswer && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 6, color: '#DC2626', fontSize: 13 }}>我的错误答案</div>
                <div
                  style={{ background: '#FEF2F2', padding: '12px 16px', borderRadius: 10, border: '1px solid #FECACA', lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{ __html: q.myAnswer }}
                />
              </div>
            )}
            {q.correctAnswer && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 6, color: '#059669', fontSize: 13 }}>正确答案</div>
                <div
                  style={{ background: '#F0FDF4', padding: '12px 16px', borderRadius: 10, border: '1px solid #BBF7D0', lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{ __html: q.correctAnswer }}
                />
              </div>
            )}
            {q.note && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--color-primary)', fontSize: 13 }}>笔记</div>
                <div
                  style={{ background: '#F5F3FF', padding: '12px 16px', borderRadius: 10, border: '1px solid #E5E1F5', lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{ __html: q.note }}
                />
              </div>
            )}

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 12, fontSize: 13 }}>你记得多清楚？</p>
              <Space wrap>
                {qualityButtons.map((btn) => (
                  <Button
                    key={btn.value}
                    onClick={() => handleRate(btn.value)}
                    style={{ borderRadius: 8, borderColor: btn.color, color: btn.color, fontWeight: 600 }}
                  >
                    {btn.label}
                  </Button>
                ))}
              </Space>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default ReviewPage
