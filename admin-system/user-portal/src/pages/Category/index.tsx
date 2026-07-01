import { useEffect, useState } from 'react'
import { Tree, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Empty, Tooltip, Badge } from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  FolderOutlined, FolderOpenOutlined, AppstoreOutlined,
} from '@ant-design/icons'
import { getCategoryTree, createCategory, updateCategory, deleteCategory } from '../../api/category'
import type { DataNode } from 'antd/es/tree'

interface CategoryNode {
  id: number
  name: string
  parentId: number
  sort: number
  children?: CategoryNode[]
}

function Category() {
  const [treeData, setTreeData] = useState<CategoryNode[]>([])
  const [flatList, setFlatList] = useState<CategoryNode[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [form] = Form.useForm()

  useEffect(() => { loadTree() }, [])

  const loadTree = async () => {
    try {
      const res: any = await getCategoryTree()
      setTreeData(res.data)
      setFlatList(flattenTree(res.data))
      setExpandedKeys(collectAllKeys(res.data))
    } catch (e) { /* ignore */ }
  }

  const collectAllKeys = (nodes: CategoryNode[]): number[] => {
    const keys: number[] = []
    const traverse = (list: CategoryNode[]) => {
      list.forEach((n) => { keys.push(n.id); if (n.children?.length) traverse(n.children) })
    }
    traverse(nodes)
    return keys
  }

  const flattenTree = (nodes: CategoryNode[], result: CategoryNode[] = []): CategoryNode[] => {
    nodes.forEach((node) => {
      result.push(node)
      if (node.children) flattenTree(node.children, result)
    })
    return result
  }

  const handleAdd = (parentId = 0) => {
    setEditingId(null)
    form.resetFields()
    form.setFieldsValue({ parentId, sort: 0 })
    setModalOpen(true)
  }

  const handleEdit = (node: CategoryNode) => {
    setEditingId(node.id)
    form.setFieldsValue({ name: node.name, parentId: node.parentId, sort: node.sort })
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id)
      message.success('删除成功')
      loadTree()
    } catch (e: any) { message.error(e.message || '删除失败') }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingId) {
        await updateCategory(editingId, values)
        message.success('修改成功')
      } else {
        await createCategory(values)
        message.success('创建成功')
      }
      setModalOpen(false)
      loadTree()
    } catch (e: any) { if (e.message) message.error(e.message) }
  }

  const countChildren = (node: CategoryNode): number => {
    if (!node.children?.length) return 0
    return node.children.reduce((sum, child) => sum + 1 + countChildren(child), 0)
  }

  const renderTreeNodes = (nodes: CategoryNode[]): DataNode[] =>
    nodes.map((node) => ({
      key: node.id,
      title: (
        <div className="cat-tree-node" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 12px', borderRadius: 10, transition: 'var(--transition-fast)',
          width: '100%',
        }}>
          <span style={{ fontWeight: 500, fontSize: 14, color: 'var(--color-foreground)' }}>
            {node.name}
            {node.children && node.children.length > 0 && (
              <Badge
                count={countChildren(node)}
                style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', marginLeft: 8, fontSize: 11, fontWeight: 600, boxShadow: 'none' }}
                size="small"
              />
            )}
          </span>
          <span className="cat-tree-actions" style={{ marginLeft: 16, opacity: 0, transition: 'var(--transition-fast)' }}>
            <Tooltip title="添加子分类">
              <Button type="text" size="small" icon={<PlusOutlined />}
                onClick={(e) => { e.stopPropagation(); handleAdd(node.id) }}
                style={{ color: 'var(--color-primary)' }}
              />
            </Tooltip>
            <Tooltip title="编辑">
              <Button type="text" size="small" icon={<EditOutlined />}
                onClick={(e) => { e.stopPropagation(); handleEdit(node) }}
                style={{ color: 'var(--color-accent)' }}
              />
            </Tooltip>
            <Popconfirm title="确定删除该分类及其子分类？" onConfirm={() => handleDelete(node.id)} okText="确定" cancelText="取消">
              <Tooltip title="删除">
                <Button type="text" size="small" danger icon={<DeleteOutlined />}
                  onClick={(e) => e.stopPropagation()}
                />
              </Tooltip>
            </Popconfirm>
          </span>
        </div>
      ),
      icon: node.children?.length
        ? <FolderOpenOutlined style={{ color: 'var(--color-primary)', fontSize: 16 }} />
        : <FolderOutlined style={{ color: '#B0A8D0', fontSize: 16 }} />,
      children: node.children ? renderTreeNodes(node.children) : [],
    }))

  const getDepth = (node: CategoryNode): number => {
    let depth = 0, current = node
    while (current.parentId !== 0) {
      const parent = flatList.find((n) => n.id === current.parentId)
      if (!parent) break
      current = parent
      depth++
    }
    return depth
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <AppstoreOutlined style={{ color: 'var(--color-primary)' }} />
            分类管理
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>管理你的错题分类，支持多层级嵌套</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd(0)}
          style={{ borderRadius: 10, height: 40, paddingInline: 20 }}>
          新建顶级分类
        </Button>
      </div>

      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: '16px 20px',
      }}>
        {treeData.length > 0 ? (
          <Tree
            treeData={renderTreeNodes(treeData)}
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys)}
            showIcon
            blockNode
            style={{ fontSize: 14 }}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无分类，创建第一个分类开始整理错题"
            style={{ padding: '48px 0' }}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd(0)}
              style={{ borderRadius: 10 }}>
              创建分类
            </Button>
          </Empty>
        )}
      </div>

      <Modal
        title={editingId ? '编辑分类' : '新建分类'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="确定" cancelText="取消"
        styles={{ body: { paddingTop: 20 } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="分类名称" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="如：数学、语文、英语" maxLength={50} showCount style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item name="parentId" label="父分类">
            <Select style={{ borderRadius: 10 }}>
              <Select.Option value={0}>顶级分类（无父分类）</Select.Option>
              {flatList.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {'　'.repeat(getDepth(c))}{c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="sort" label="排序（数字越小越靠前）">
            <InputNumber min={0} style={{ width: '100%', borderRadius: 10 }} />
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .cat-tree-node:hover { background: var(--color-muted); }
        .cat-tree-node:hover .cat-tree-actions { opacity: 1 !important; }
        .ant-tree .ant-tree-node-content-wrapper { flex: 1; }
        .ant-tree .ant-tree-treenode { padding: 2px 0; }
      `}</style>
    </div>
  )
}

export default Category
