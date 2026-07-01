import { useEffect, useState } from 'react'
import { Button, Table, Space, Modal, Form, Input, ColorPicker, Popconfirm, message, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, TagsOutlined } from '@ant-design/icons'
import { getTags, createTag, updateTag, deleteTag } from '../../api/tag'

function TagManagement() {
  const [tags, setTags] = useState<any[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingTag, setEditingTag] = useState<any>(null)
  const [form] = Form.useForm()

  useEffect(() => { loadTags() }, [])

  const loadTags = async () => {
    try {
      const res: any = await getTags()
      setTags(res.data || [])
    } catch (e) { /* ignore */ }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const color = typeof values.color === 'string' ? values.color : values.color?.toHexString?.() || '#7C3AED'
      const data = { name: values.name, color }
      if (editingTag) {
        await updateTag(editingTag.id, data)
        message.success('修改成功')
      } else {
        await createTag(data)
        message.success('创建成功')
      }
      setModalVisible(false)
      form.resetFields()
      setEditingTag(null)
      loadTags()
    } catch (e: any) {
      if (e.message) message.error(e.message)
    }
  }

  const handleDelete = async (id: number) => {
    await deleteTag(id)
    message.success('删除成功')
    loadTags()
  }

  const openEdit = (tag: any) => {
    setEditingTag(tag)
    form.setFieldsValue({ name: tag.name, color: tag.color })
    setModalVisible(true)
  }

  const openCreate = () => {
    setEditingTag(null)
    form.resetFields()
    setModalVisible(true)
  }

  const columns = [
    {
      title: '标签',
      dataIndex: 'name',
      render: (name: string, record: any) => (
        <Tag color={record.color} style={{ borderRadius: 6, fontSize: 13, padding: '2px 10px' }}>
          {name}
        </Tag>
      ),
    },
    {
      title: '颜色',
      dataIndex: 'color',
      width: 80,
      render: (color: string) => (
        <span style={{ width: 20, height: 20, borderRadius: 4, background: color, display: 'inline-block' }} />
      ),
    },
    {
      title: '操作',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} style={{ borderRadius: 6 }} />
          <Popconfirm title="确定删除此标签？" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} style={{ borderRadius: 6 }} />
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
            <TagsOutlined style={{ color: 'var(--color-primary)' }} />
            标签管理
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>创建标签对错题进行多维度标记</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ borderRadius: 10, height: 40, paddingInline: 20 }}>
          新建标签
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        rowKey="id"
        pagination={false}
        size="middle"
        style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}
      />

      <Modal
        title={editingTag ? '编辑标签' : '新建标签'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => { setModalVisible(false); setEditingTag(null) }}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" initialValues={{ color: '#7C3AED' }}>
          <Form.Item name="name" label="标签名称" rules={[{ required: true, message: '请输入标签名称' }]}>
            <Input placeholder="如：易错、重点、公式" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item name="color" label="标签颜色">
            <ColorPicker showText />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TagManagement
