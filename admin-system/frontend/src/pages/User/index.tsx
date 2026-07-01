import { useEffect, useState } from 'react'
import { Table, Button, Space, Input, Modal, Form, message, Tag, Popconfirm, Select } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { getUsers, createUser, updateUser, deleteUser, getRoles } from '../../api/user'

interface UserRecord {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  status: number
  createTime: string
}

interface RoleRecord {
  id: number
  roleName: string
}

export default function UserPage() {
  const [data, setData] = useState<UserRecord[]>([])
  const [roles, setRoles] = useState<RoleRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res: any = await getUsers({ page, size: 10, username: search || undefined })
      setData(res.data.records)
      setTotal(res.data.total)
    } catch { /* empty */ } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const res: any = await getRoles()
      setRoles(res.data)
    } catch { /* empty */ }
  }

  useEffect(() => { fetchData() }, [page])
  useEffect(() => { fetchRoles() }, [])

  const handleAdd = () => {
    setEditingId(null)
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (record: UserRecord) => {
    setEditingId(record.id)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    await deleteUser(id)
    message.success('删除成功')
    fetchData()
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editingId) {
      await updateUser(editingId, values)
      message.success('更新成功')
    } else {
      await createUser(values)
      message.success('创建成功')
    }
    setModalOpen(false)
    fetchData()
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username' },
    { title: '昵称', dataIndex: 'nickname' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '手机', dataIndex: 'phone' },
    {
      title: '状态', dataIndex: 'status',
      render: (s: number) => s === 1 ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag>,
    },
    { title: '创建时间', dataIndex: 'createTime' },
    {
      title: '操作',
      render: (_: unknown, record: UserRecord) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="搜索用户名" value={search} onChange={(e) => setSearch(e.target.value)} prefix={<SearchOutlined />} />
        <Button onClick={() => { setPage(1); fetchData() }}>搜索</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增用户</Button>
      </Space>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
        pagination={{ current: page, total, pageSize: 10, onChange: setPage }} />
      <Modal title={editingId ? '编辑用户' : '新增用户'} open={modalOpen}
        onOk={handleSubmit} onCancel={() => setModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input disabled={!!editingId} />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={editingId ? [] : [{ required: true }]}>
            <Input.Password placeholder={editingId ? '留空则不修改' : ''} />
          </Form.Item>
          <Form.Item name="nickname" label="昵称"><Input /></Form.Item>
          <Form.Item name="email" label="邮箱"><Input /></Form.Item>
          <Form.Item name="phone" label="手机"><Input /></Form.Item>
          <Form.Item name="roleIds" label="角色">
            <Select mode="multiple" placeholder="选择角色"
              options={roles.map((r) => ({ label: r.roleName, value: r.id }))} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
