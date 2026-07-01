import { useEffect, useState } from 'react'
import { Form, Input, Select, Button, message, TreeSelect } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { createQuestion, getQuestion, updateQuestion } from '../../api/question'
import { getCategoryTree } from '../../api/category'
import { getQuestionTags, setQuestionTags } from '../../api/tag'
import RichTextEditor from '../../components/RichTextEditor'
import TagSelector from '../../components/TagSelector'

const colorOptions = [
  { label: '红色', value: 'red', hex: '#EF4444' },
  { label: '橙色', value: 'orange', hex: '#F97316' },
  { label: '黄色', value: 'gold', hex: '#EAB308' },
  { label: '蓝色', value: 'blue', hex: '#3B82F6' },
  { label: '灰色', value: 'gray', hex: '#6B7280' },
  { label: '黑色', value: 'black', hex: '#1F2937' },
]

interface CategoryNode { id: number; name: string; parentId: number; children?: CategoryNode[] }

function buildTreeSelectData(nodes: CategoryNode[]): any[] {
  return nodes.map((n) => ({
    title: n.name, value: n.id,
    children: n.children?.length ? buildTreeSelectData(n.children) : undefined,
  }))
}

function QuestionEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form] = Form.useForm()
  const [treeSelectData, setTreeSelectData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [tagIds, setTagIds] = useState<number[]>([])

  useEffect(() => {
    loadCategories()
    if (id) {
      loadQuestion()
      loadTags()
    }
  }, [id])

  const loadCategories = async () => {
    try {
      const res: any = await getCategoryTree()
      setTreeSelectData(buildTreeSelectData(res.data))
    } catch (e) { /* ignore */ }
  }

  const loadQuestion = async () => {
    try {
      const res: any = await getQuestion(Number(id))
      form.setFieldsValue(res.data)
    } catch (e: any) { message.error(e.message || '加载失败') }
  }

  const loadTags = async () => {
    try {
      const res: any = await getQuestionTags(Number(id))
      setTagIds((res.data || []).map((t: any) => t.id))
    } catch (e) { /* ignore */ }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields()
      let questionId: number
      if (id) {
        await updateQuestion(Number(id), values)
        questionId = Number(id)
        message.success('修改成功')
      } else {
        const res: any = await createQuestion(values)
        questionId = res.data.id
        message.success('创建成功')
      }
      if (tagIds.length > 0 || id) {
        await setQuestionTags(questionId, tagIds)
      }
      navigate('/questions')
    } catch (e: any) {
      if (e.message) message.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const sectionStyle: React.CSSProperties = {
    background: 'var(--color-muted)',
    borderRadius: 'var(--radius-md)',
    padding: '20px 24px',
    marginBottom: 20,
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/questions')}
          style={{ borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}
        >
          返回列表
        </Button>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-foreground)', margin: 0 }}>
          {id ? '编辑错题' : '新建错题'}
        </h2>
        <div style={{ width: 88 }} />
      </div>

      <Form form={form} layout="vertical" initialValues={{ colorTag: 'red', status: 0, strikethrough: 0 }}>
        <div style={sectionStyle}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 16 }}>基本信息</div>
          <Form.Item name="categoryId" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
            <TreeSelect
              placeholder="选择分类（逐级展开）"
              treeData={treeSelectData}
              treeDefaultExpandAll
              showSearch
              treeLine
              treeNodeFilterProp="title"
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            />
          </Form.Item>
          <Form.Item name="title" label="题目标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="简要描述这道题" style={{ borderRadius: 8 }} />
          </Form.Item>
        </div>

        <div style={sectionStyle}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 16 }}>题目内容</div>
          <Form.Item name="content" label="题目内容">
            <RichTextEditor placeholder="粘贴或输入完整题目内容" minHeight={150} />
          </Form.Item>
        </div>

        <div style={{ ...sectionStyle, background: '#FFF7F7' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#DC2626', marginBottom: 16 }}>答案对比</div>
          <Form.Item name="myAnswer" label="我的错误答案">
            <RichTextEditor placeholder="当时是怎么做错的" minHeight={100} />
          </Form.Item>
          <Form.Item name="correctAnswer" label="正确答案">
            <RichTextEditor placeholder="正确答案是什么" minHeight={100} />
          </Form.Item>
        </div>

        <div style={{ ...sectionStyle, background: '#F5F3FF' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 16 }}>笔记 / 讲解</div>
          <Form.Item name="note">
            <RichTextEditor placeholder="写下你的理解、思路、知识点总结" minHeight={150} />
          </Form.Item>
        </div>

        <div style={{
          display: 'flex', gap: 16, flexWrap: 'wrap',
          padding: '16px 24px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          marginBottom: 20,
        }}>
          <Form.Item name="colorTag" label="颜色标记" style={{ marginBottom: 0 }}>
            <Select style={{ width: 130 }}>
              {colorOptions.map(c => (
                <Select.Option key={c.value} value={c.value}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: c.hex }} />
                    {c.label}
                  </span>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="复习状态" style={{ marginBottom: 0 }}>
            <Select style={{ width: 130 }} options={[
              { label: '未复习', value: 0 },
              { label: '复习中', value: 1 },
              { label: '已掌握', value: 2 },
            ]} />
          </Form.Item>
          <Form.Item name="strikethrough" label="删除线" style={{ marginBottom: 0 }}>
            <Select style={{ width: 130 }} options={[
              { label: '无', value: 0 },
              { label: '加删除线', value: 1 },
            ]} />
          </Form.Item>
        </div>

        <div style={{
          padding: '16px 24px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 12 }}>标签</div>
          <TagSelector value={tagIds} onChange={setTagIds} />
        </div>

        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          icon={<SaveOutlined />}
          size="large"
          style={{
            borderRadius: 10,
            height: 48,
            paddingInline: 32,
            fontSize: 16,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
          }}
        >
          {id ? '保存修改' : '创建错题'}
        </Button>
      </Form>
    </div>
  )
}

export default QuestionEdit
