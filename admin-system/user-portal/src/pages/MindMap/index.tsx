import { useEffect, useState } from 'react'
import { Button, Card, Empty, Space, Popconfirm, message, Modal, Input, Row, Col } from 'antd'
import {
  PlusOutlined, DeleteOutlined, EditOutlined,
  PartitionOutlined, ImportOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getMindMaps, createMindMap, deleteMindMap } from '../../api/mindmap'
import { getMindMapData } from '../../api/category'

const defaultData = JSON.stringify({
  data: { text: '中心主题', expand: true },
  children: [],
})

function MindMapList() {
  const navigate = useNavigate()
  const [maps, setMaps] = useState<any[]>([])
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [importing, setImporting] = useState(false)

  useEffect(() => { loadMaps() }, [])

  const loadMaps = async () => {
    try {
      const res: any = await getMindMaps()
      setMaps(res.data || [])
    } catch (e) { /* ignore */ }
  }

  const handleCreate = async () => {
    if (!newTitle.trim()) { message.warning('请输入标题'); return }
    try {
      const res: any = await createMindMap({ title: newTitle, data: defaultData })
      message.success('创建成功')
      setCreating(false)
      setNewTitle('')
      navigate(`/mindmap/edit/${res.data.id}`)
    } catch (e) { message.error('创建失败') }
  }

  const handleDelete = async (id: number) => {
    await deleteMindMap(id)
    message.success('删除成功')
    loadMaps()
  }

  const handleImport = async () => {
    setImporting(true)
    try {
      const res: any = await getMindMapData()
      const categories = res.data || []
      if (categories.length === 0) {
        message.warning('暂无分类数据可导入')
        setImporting(false)
        return
      }
      const root = {
        data: { text: '我的知识库', expand: true },
        children: buildImportNodes(categories),
      }
      const createRes: any = await createMindMap({
        title: '从错题分类导入 - ' + new Date().toLocaleDateString(),
        data: JSON.stringify(root),
      })
      message.success('导入成功！已根据分类和题目数量生成思维导图')
      navigate(`/mindmap/edit/${createRes.data.id}`)
    } catch (e) {
      message.error('导入失败')
    } finally {
      setImporting(false)
    }
  }

  const buildImportNodes = (nodes: any[]): any[] => {
    return nodes.map((n: any) => ({
      data: {
        text: n.questionCount > 0 ? `${n.name} (${n.questionCount}题)` : n.name,
        expand: true,
      },
      children: n.children?.length ? buildImportNodes(n.children) : [],
    }))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <PartitionOutlined style={{ color: 'var(--color-primary)' }} />
            思维导图
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>创建自定义思维导图，或从错题分类一键导入生成</p>
        </div>
        <Space>
          <Button
            icon={<ImportOutlined />}
            onClick={handleImport}
            loading={importing}
            style={{ borderRadius: 10, height: 40 }}
          >
            从分类导入
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreating(true)}
            style={{ borderRadius: 10, height: 40, paddingInline: 20 }}
          >
            新建导图
          </Button>
        </Space>
      </div>

      {maps.length === 0 ? (
        <Empty
          description="暂无思维导图，点击上方按钮创建或导入"
          style={{ padding: '80px 0' }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {maps.map((m) => (
            <Col key={m.id} xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{ borderRadius: 12 }}
                onClick={() => navigate(`/mindmap/edit/${m.id}`)}
                actions={[
                  <EditOutlined key="edit" onClick={(e) => { e.stopPropagation(); navigate(`/mindmap/edit/${m.id}`) }} />,
                  <Popconfirm
                    key="delete"
                    title="确定删除此思维导图？"
                    onConfirm={(e) => { e?.stopPropagation(); handleDelete(m.id) }}
                    onCancel={(e) => e?.stopPropagation()}
                  >
                    <DeleteOutlined onClick={(e) => e.stopPropagation()} style={{ color: '#DC2626' }} />
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  title={
                    <span style={{ fontSize: 16, fontWeight: 600 }}>
                      <PartitionOutlined style={{ color: 'var(--color-primary)', marginRight: 8 }} />
                      {m.title}
                    </span>
                  }
                  description={
                    <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                      更新于 {m.updateTime?.replace('T', ' ').slice(0, 16) || m.createTime?.replace('T', ' ').slice(0, 16)}
                    </span>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="新建思维导图"
        open={creating}
        onOk={handleCreate}
        onCancel={() => { setCreating(false); setNewTitle('') }}
        okText="创建"
        cancelText="取消"
      >
        <Input
          placeholder="输入思维导图标题"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onPressEnter={handleCreate}
          style={{ borderRadius: 8 }}
        />
      </Modal>
    </div>
  )
}

export default MindMapList
