import { useEffect, useState } from 'react'
import { Table, Button, Tag, Space, Select, Input, Popconfirm, message, Dropdown, TreeSelect, Modal, Tooltip } from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  MinusOutlined, PlusCircleOutlined, FileTextOutlined,
  FilePdfOutlined,
} from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getQuestions, deleteQuestion, updateQuestionStatus } from '../../api/question'
import { getCategoryTree } from '../../api/category'
import { getTags } from '../../api/tag'
import { exportQuestionsToPDF } from '../../utils/pdfExport'

const statusMap: Record<number, { text: string; color: string; bg: string }> = {
  0: { text: '未复习', color: '#DC2626', bg: '#FEF2F2' },
  1: { text: '复习中', color: '#D97706', bg: '#FFFBEB' },
  2: { text: '已掌握', color: '#059669', bg: '#F0FDF4' },
}

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

function flattenTree(nodes: any[], result: any[] = []): any[] {
  nodes.forEach((n: any) => { result.push(n); if (n.children) flattenTree(n.children, result) })
  return result
}

function QuestionList() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [categories, setCategories] = useState<any[]>([])
  const [treeSelectData, setTreeSelectData] = useState<any[]>([])
  const [allTags, setAllTags] = useState<any[]>([])
  const [filters, setFilters] = useState<any>(() => {
    const catId = searchParams.get('categoryId')
    return catId ? { categoryId: Number(catId) } : {}
  })
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailRecord, setDetailRecord] = useState<any>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [exporting, setExporting] = useState(false)

  useEffect(() => { loadCategories(); loadTags() }, [])
  useEffect(() => { loadData() }, [page, filters])

  const loadCategories = async () => {
    try {
      const res: any = await getCategoryTree()
      setCategories(flattenTree(res.data))
      setTreeSelectData(buildTreeSelectData(res.data))
    } catch (e) { /* ignore */ }
  }

  const loadTags = async () => {
    try {
      const res: any = await getTags()
      setAllTags(res.data || [])
    } catch (e) { /* ignore */ }
  }

  const loadData = async () => {
    try {
      const res: any = await getQuestions({ page, size: 10, ...filters })
      setData(res.data.records)
      setTotal(res.data.total)
    } catch (e) { /* ignore */ }
  }

  const handleDelete = async (id: number) => {
    await deleteQuestion(id)
    message.success('删除成功')
    loadData()
  }

  const handleColorChange = async (id: number, colorTag: string) => {
    await updateQuestionStatus(id, { colorTag })
    loadData()
  }

  const handleStrikethrough = async (id: number, current: number) => {
    await updateQuestionStatus(id, { strikethrough: current === 1 ? 0 : 1 })
    loadData()
  }

  const handleStatusChange = async (id: number, status: number) => {
    await updateQuestionStatus(id, { status })
    loadData()
  }

  const handleReviewCountChange = async (id: number, currentCount: number, delta: number) => {
    const newCount = Math.max(0, currentCount + delta)
    await updateQuestionStatus(id, { reviewCount: newCount })
    loadData()
  }

  const handleExportPDF = async () => {
    const selected = data.filter((d) => selectedRowKeys.includes(d.id))
    if (selected.length === 0) {
      message.warning('请先选择要导出的错题')
      return
    }
    setExporting(true)
    try {
      await exportQuestionsToPDF(selected)
      message.success('导出成功')
    } catch (e) {
      message.error('导出失败')
    } finally {
      setExporting(false)
    }
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: 220,
      render: (text: string, record: any) => (
        <span
          style={{
            textDecoration: record.strikethrough === 1 ? 'line-through' : 'none',
            color: colorOptions.find(c => c.value === record.colorTag)?.hex || 'var(--color-foreground)',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'var(--transition-fast)',
          }}
          onDoubleClick={() => { setDetailRecord(record); setDetailVisible(true) }}
          title="双击查看详情"
        >
          {text}
        </span>
      ),
    },
    {
      title: '分类',
      dataIndex: 'categoryId',
      width: 110,
      render: (id: number) => {
        const cat = categories.find((c) => c.id === id)
        return cat ? (
          <Tag style={{ borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-muted)', color: 'var(--color-primary)' }}>
            {cat.name}
          </Tag>
        ) : '-'
      },
    },
    {
      title: '题目内容',
      dataIndex: 'content',
      width: 280,
      render: (text: string) => (
        <div style={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          maxHeight: 100,
          overflow: 'auto',
          fontSize: 13,
          lineHeight: 1.7,
          color: 'var(--color-text)',
          padding: '4px 0',
        }}
          dangerouslySetInnerHTML={{ __html: text || '-' }}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (s: number, record: any) => (
        <Select
          size="small"
          value={s}
          style={{ width: 90 }}
          onChange={(v) => handleStatusChange(record.id, v)}
          options={Object.entries(statusMap).map(([k, v]) => ({ label: v.text, value: Number(k) }))}
        />
      ),
    },
    {
      title: '颜色',
      dataIndex: 'colorTag',
      width: 80,
      render: (color: string, record: any) => {
        const opt = colorOptions.find(c => c.value === color)
        return (
          <Dropdown menu={{
            items: colorOptions.map((c) => ({
              key: c.value,
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: c.hex, display: 'inline-block' }} />
                  {c.label}
                </span>
              ),
            })),
            onClick: ({ key }) => handleColorChange(record.id, key),
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
              padding: '2px 10px', borderRadius: 6, border: '1px solid #e5e7eb',
              transition: 'var(--transition-fast)',
            }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: opt?.hex || '#EF4444' }} />
              <span style={{ fontSize: 12 }}>{opt?.label || '红色'}</span>
            </span>
          </Dropdown>
        )
      },
    },
    {
      title: '复习次数',
      dataIndex: 'reviewCount',
      width: 130,
      render: (count: number, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() => handleReviewCountChange(record.id, count, -1)}
            disabled={count <= 0}
            style={{ borderRadius: 6, width: 28, height: 28 }}
          />
          <span style={{
            minWidth: 28, textAlign: 'center', fontWeight: 600,
            fontSize: 15, color: 'var(--color-foreground)',
          }}>
            {count || 0}
          </span>
          <Button
            size="small"
            icon={<PlusCircleOutlined />}
            onClick={() => handleReviewCountChange(record.id, count, 1)}
            style={{ borderRadius: 6, width: 28, height: 28, color: 'var(--color-primary)' }}
          />
        </div>
      ),
    },
    {
      title: '操作',
      width: 130,
      render: (_: any, record: any) => (
        <Space size={4}>
          <Tooltip title="编辑">
            <Button size="small" icon={<EditOutlined />}
              onClick={() => navigate(`/questions/edit/${record.id}`)}
              style={{ borderRadius: 6 }}
            />
          </Tooltip>
          <Tooltip title={record.strikethrough === 1 ? '取消删除线' : '加删除线'}>
            <Button size="small"
              onClick={() => handleStrikethrough(record.id, record.strikethrough)}
              type={record.strikethrough === 1 ? 'primary' : 'default'}
              style={{ borderRadius: 6, textDecoration: 'line-through', fontWeight: 700 }}
            >
              S
            </Button>
          </Tooltip>
          <Popconfirm title="确定删除这道错题？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Tooltip title="删除">
              <Button size="small" danger icon={<DeleteOutlined />} style={{ borderRadius: 6 }} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileTextOutlined style={{ color: 'var(--color-primary)' }} />
            我的错题
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>双击标题可快速查看详情</p>
        </div>
        <Space>
          <Button
            icon={<FilePdfOutlined />}
            onClick={handleExportPDF}
            loading={exporting}
            disabled={selectedRowKeys.length === 0}
            style={{ borderRadius: 10, height: 40 }}
          >
            导出PDF ({selectedRowKeys.length})
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/questions/new')}
            style={{ borderRadius: 10, height: 40, paddingInline: 20 }}>
            新建错题
          </Button>
        </Space>
      </div>

      <div style={{
        display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap',
        padding: '16px 20px',
        background: 'var(--color-muted)',
        borderRadius: 'var(--radius-md)',
      }}>
        <TreeSelect
          placeholder="按分类筛选"
          allowClear
          value={filters.categoryId}
          treeData={treeSelectData}
          treeDefaultExpandAll
          showSearch
          treeLine
          treeNodeFilterProp="title"
          style={{ width: 180 }}
          onChange={(v) => { setPage(1); setFilters({ ...filters, categoryId: v }) }}
          dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
        />
        <Select
          placeholder="按状态筛选"
          allowClear
          style={{ width: 130 }}
          onChange={(v) => { setPage(1); setFilters({ ...filters, status: v }) }}
          options={Object.entries(statusMap).map(([k, v]) => ({ label: v.text, value: Number(k) }))}
        />
        <Select
          placeholder="按标签筛选"
          allowClear
          style={{ width: 150 }}
          onChange={(v) => { setPage(1); setFilters({ ...filters, tagId: v }) }}
          options={allTags.map((t) => ({ label: t.name, value: t.id }))}
        />
        <Input.Search
          placeholder="搜索标题关键词"
          style={{ width: 220 }}
          onSearch={(v) => { setPage(1); setFilters({ ...filters, keyword: v }) }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as number[]),
        }}
        pagination={{
          current: page,
          total,
          pageSize: 10,
          onChange: (p) => setPage(p),
          showTotal: (t) => `共 ${t} 条`,
          style: { marginTop: 16 },
        }}
        scroll={{ x: 950 }}
        size="middle"
        style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}
      />

      <Modal
        title={
          <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-foreground)' }}>
            {detailRecord?.title}
          </span>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="edit" type="primary" onClick={() => { setDetailVisible(false); navigate(`/questions/edit/${detailRecord?.id}`) }}
            style={{ borderRadius: 8 }}>
            编辑
          </Button>,
          <Button key="close" onClick={() => setDetailVisible(false)} style={{ borderRadius: 8 }}>关闭</Button>,
        ]}
        width={720}
        styles={{ body: { maxHeight: '65vh', overflow: 'auto', paddingTop: 20 } }}
      >
        {detailRecord && (
          <div>
            <DetailSection title="题目内容" content={detailRecord.content} />
            <DetailSection title="我的错误答案" content={detailRecord.myAnswer} color="#FEF2F2" border="#FECACA" />
            <DetailSection title="正确答案" content={detailRecord.correctAnswer} color="#F0FDF4" border="#BBF7D0" />
            <DetailSection title="笔记 / 讲解" content={detailRecord.note} color="#F5F3FF" border="#E5E1F5" />
            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              {(() => { const info = statusMap[detailRecord.status] || statusMap[0]; return (
                <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: info.bg, color: info.color }}>
                  {info.text}
                </span>
              )})()}
              <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, background: 'var(--color-muted)', color: 'var(--color-text-secondary)' }}>
                复习 {detailRecord.reviewCount || 0} 次
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function DetailSection({ title, content, color, border }: { title: string; content?: string; color?: string; border?: string }) {
  if (!content) return null
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--color-foreground)', fontSize: 14 }}>{title}</div>
      <div style={{
        wordBreak: 'break-word',
        background: color || '#FAFAFA',
        padding: '14px 18px',
        borderRadius: 10,
        border: `1px solid ${border || '#F0F0F0'}`,
        lineHeight: 1.8,
        fontSize: 14,
        color: 'var(--color-text)',
      }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export default QuestionList
